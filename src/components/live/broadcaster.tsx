"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AudioPresets,
  ConnectionQuality,
  LocalAudioTrack,
  LocalVideoTrack,
  Room,
  RoomEvent,
  Track,
  VideoPresets,
  createLocalAudioTrack,
  createLocalVideoTrack,
} from "livekit-client";
import { Button } from "@/components/ui";

type Phase = "idle" | "starting" | "live" | "stopping";

const MSG = {
  camera: "Camera permission is required. Please enable camera access in your browser settings.",
  mic: "Microphone permission is required for live audio.",
  noCamera: "No camera was found on this device.",
  noMic: "No microphone was found on this device.",
  connect: "Unable to connect to the live stream. Please try again.",
  reconnecting: "Connection interrupted. Reconnecting...",
};

function mediaError(e: unknown, kind: "camera" | "mic"): string {
  const name = e instanceof DOMException ? e.name : (e as { name?: string })?.name;
  if (name === "NotFoundError" || name === "OverconstrainedError") return kind === "camera" ? MSG.noCamera : MSG.noMic;
  if (name === "NotAllowedError" || name === "SecurityError") return kind === "camera" ? MSG.camera : MSG.mic;
  return kind === "camera" ? MSG.camera : MSG.mic;
}

/** An error retrying cannot fix (not logged in, not the owner, permissions). Empty message = already shown. */
class FatalError extends Error {
  constructor(message: string | null) {
    super(message ?? "");
  }
}

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(sec).padStart(2, "0")}`;
};

export function Broadcaster({ slug, eventName }: { slug: string; eventName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const camRef = useRef<LocalVideoTrack | null>(null);
  const micRef = useRef<LocalAudioTrack | null>(null);
  const wantLive = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const micOnRef = useRef(true);
  const camOnRef = useRef(true);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hasPreview, setHasPreview] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [viewers, setViewers] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [quality, setQuality] = useState<ConnectionQuality>(ConnectionQuality.Unknown);

  const attachPreview = useCallback((t: LocalVideoTrack | null) => {
    if (videoRef.current && t) t.attach(videoRef.current);
  }, []);

  const refreshCameras = useCallback(async () => {
    try {
      setCameras(await Room.getLocalDevices("videoinput"));
    } catch {
      /* not critical */
    }
  }, []);

  /** Ask for camera + mic. Only ever called from a user action. */
  const acquireMedia = useCallback(async (): Promise<boolean> => {
    setError(null);
    if (!camRef.current) {
      try {
        camRef.current = await createLocalVideoTrack({ facingMode: facing, resolution: { width: 1280, height: 720, frameRate: 30 } });
      } catch (e) {
        setError(mediaError(e, "camera"));
        return false;
      }
    }
    if (!micRef.current) {
      try {
        micRef.current = await createLocalAudioTrack({ echoCancellation: true, noiseSuppression: true });
      } catch (e) {
        setError(mediaError(e, "mic"));
        return false;
      }
    }
    attachPreview(camRef.current);
    setHasPreview(true);
    void refreshCameras();
    return true;
  }, [facing, attachPreview, refreshCameras]);

  const post = useCallback(
    (action: "start" | "heartbeat" | "stop") =>
      fetch(`/api/events/${slug}/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
        keepalive: action === "stop",
      }),
    [slug],
  );

  const teardownMedia = useCallback(() => {
    camRef.current?.stop();
    micRef.current?.stop();
    camRef.current = null;
    micRef.current = null;
    setHasPreview(false);
  }, []);

  /** Fetch a broadcaster token (server verifies ownership), connect and publish camera + mic. */
  async function connectRoom(): Promise<Room> {
    const r = await fetch("/api/livekit/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, role: "broadcaster" }),
    });
    if (!r.ok) {
      const d = (await r.json().catch(() => ({}))) as { error?: string };
      throw new FatalError(r.status === 401 || r.status === 403 || r.status === 503 ? d.error ?? MSG.connect : MSG.connect);
    }
    const { token, url } = (await r.json()) as { token: string; url: string };

    // Recreate tracks if the browser/LiveKit stopped them after a disconnect.
    if (camRef.current && camRef.current.mediaStreamTrack.readyState !== "live") camRef.current = null;
    if (micRef.current && micRef.current.mediaStreamTrack.readyState !== "live") micRef.current = null;
    if (!(await acquireMedia())) throw new FatalError(null);

    const room = new Room({
      adaptiveStream: true,
      dynacast: true, // stop encoding layers nobody is watching
      publishDefaults: {
        simulcast: true, // 3 quality layers so each viewer gets what their network can carry
        videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
        videoEncoding: { maxBitrate: 1_500_000, maxFramerate: 30 },
        degradationPreference: "balanced", // trade resolution and fps when our uplink is weak
        audioPreset: AudioPresets.speech,
        dtx: true,
        red: true, // audio redundancy: survives packet loss
      },
    });
    room
      .on(RoomEvent.Reconnecting, () => setNotice(MSG.reconnecting))
      .on(RoomEvent.Reconnected, () => setNotice(null))
      .on(RoomEvent.ParticipantConnected, () => setViewers(room.remoteParticipants.size))
      .on(RoomEvent.ParticipantDisconnected, () => setViewers(room.remoteParticipants.size))
      .on(RoomEvent.ConnectionQualityChanged, (q, p) => {
        if (p.isLocal) setQuality(q);
      })
      .on(RoomEvent.Disconnected, () => {
        // Unexpected drop (manual stop clears roomRef first): try to rejoin automatically.
        if (roomRef.current === room && wantLive.current) {
          roomRef.current = null;
          void rejoin();
        }
      });
    await room.connect(url, token);
    await room.localParticipant.publishTrack(camRef.current!, { source: Track.Source.Camera });
    await room.localParticipant.publishTrack(micRef.current!, { source: Track.Source.Microphone });
    if (!camOnRef.current) await camRef.current!.mute();
    if (!micOnRef.current) await micRef.current!.mute();
    roomRef.current = room;
    return room;
  }

  async function rejoin() {
    setNotice(MSG.reconnecting);
    for (let attempt = 1; attempt <= 15 && wantLive.current; attempt++) {
      await new Promise((r) => setTimeout(r, Math.min(1500 * attempt, 10000)));
      if (!wantLive.current) return;
      try {
        const room = await connectRoom();
        await post("start"); // in case the stream was marked ended while we were offline
        setViewers(room.remoteParticipants.size);
        setNotice(null);
        return;
      } catch (e) {
        if (e instanceof FatalError) break;
        /* network still down: keep trying */
      }
    }
    if (!wantLive.current) return;
    wantLive.current = false;
    setNotice(null);
    setError(MSG.connect);
    setPhase("idle");
    void post("stop").catch(() => {});
  }

  async function startLive() {
    setNotice(null);
    setError(null);
    setPhase("starting");
    wantLive.current = true;
    try {
      const room = await connectRoom();
      const s = await post("start"); // mark LIVE only after media is publishing
      if (!s.ok) throw new Error("start failed");
      setViewers(room.remoteParticipants.size);
      setSeconds(0);
      setPhase("live");
    } catch (e) {
      wantLive.current = false;
      const room = roomRef.current;
      roomRef.current = null;
      void room?.disconnect();
      if (e instanceof FatalError) {
        if (e.message) setError(e.message);
      } else {
        setError(MSG.connect);
      }
      setPhase("idle");
    }
  }

  async function stopLive() {
    setPhase("stopping");
    wantLive.current = false; // stops any rejoin loop
    const room = roomRef.current;
    roomRef.current = null; // prevents the Disconnected handler from rejoining
    try {
      if (room) {
        for (const pub of room.localParticipant.trackPublications.values()) {
          if (pub.track) await room.localParticipant.unpublishTrack(pub.track, false);
        }
        await room.disconnect();
      }
    } finally {
      await post("stop").catch(() => {});
      teardownMedia();
      setViewers(0);
      setPhase("idle");
    }
  }

  async function toggleMic() {
    const t = micRef.current;
    const next = !micOn;
    micOnRef.current = next;
    setMicOn(next);
    if (t) await (next ? t.unmute() : t.mute());
  }

  async function toggleCam() {
    const t = camRef.current;
    const next = !camOn;
    camOnRef.current = next;
    setCamOn(next);
    if (t) await (next ? t.unmute() : t.mute());
  }

  async function flipCamera() {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    if (camRef.current) {
      try {
        await camRef.current.restartTrack({ facingMode: next });
        attachPreview(camRef.current);
      } catch {
        setError("Could not switch cameras on this device.");
      }
    }
  }

  async function pickCamera(deviceId: string) {
    if (!camRef.current) return;
    try {
      await camRef.current.setDeviceId(deviceId);
      attachPreview(camRef.current);
    } catch {
      setError("Could not switch to that camera.");
    }
  }

  function toggleExpand() {
    const box = boxRef.current;
    if (!box) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (expanded) {
      setExpanded(false);
    } else if (box.requestFullscreen) {
      box.requestFullscreen().catch(() => setExpanded(true));
    } else {
      setExpanded(true); // e.g. iPhone Safari: page-filling view
    }
  }

  useEffect(() => {
    const onChange = () => setExpanded(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Duration timer + heartbeat (keeps the stream marked LIVE for guests) + viewer count
  useEffect(() => {
    if (phase !== "live") return;
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    const beat = setInterval(() => void post("heartbeat").catch(() => {}), 10000);
    return () => {
      clearInterval(tick);
      clearInterval(beat);
    };
  }, [phase, post]);

  // Warn before leaving while live; clean up on unmount
  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (roomRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      wantLive.current = false;
      roomRef.current?.disconnect();
      camRef.current?.stop();
      micRef.current?.stop();
    };
  }, []);

  const live = phase === "live";
  const busy = phase === "starting" || phase === "stopping";
  const statusText =
    phase === "starting" ? "Connecting…" : phase === "stopping" ? "Stopping…" : live ? (notice ? "Reconnecting…" : "Connected") : "Offline";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-serif text-xl font-bold">{eventName}</h1>
          <Link href={`/event/${slug}`} className="text-sm text-brand hover:underline">View website</Link>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${live ? "bg-red-600 text-white" : "bg-black/10"}`}>
          {live ? <><span className="live-dot">●</span> LIVE</> : statusText}
        </span>
      </div>

      <div
        ref={boxRef}
        className={expanded ? "fixed inset-0 z-50 bg-neutral-900" : "relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-900 sm:aspect-video"}
      >
        <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""} ${hasPreview && camOn ? "" : "invisible"}`} />
        {(!hasPreview || !camOn) && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
            <div>
              <div className="text-4xl">{hasPreview ? "🚫" : "📷"}</div>
              <p className="mt-2 text-sm text-white/70">
                {hasPreview ? "Camera is off" : "Camera preview appears after you enable the camera."}
              </p>
              {!hasPreview && (
                <Button className="mt-4" variant="secondary" onClick={() => void acquireMedia()} disabled={busy}>
                  Enable Camera
                </Button>
              )}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={toggleExpand}
          aria-label={expanded ? "Exit full screen" : "Full screen"}
          className="absolute bottom-3 right-3 z-10 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-black/80"
        >
          {expanded ? "✕ Close" : "⛶ Full screen"}
        </button>
        {expanded && live && (
          <button
            type="button"
            onClick={stopLive}
            disabled={busy}
            className="absolute bottom-3 left-3 z-10 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-bold text-white"
          >
            ⏹ STOP LIVE
          </button>
        )}
        {live && (
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-3 text-xs font-semibold text-white">
            <span className="rounded bg-red-600 px-2 py-0.5">● LIVE</span>
            <span>👁 {viewers} {viewers === 1 ? "viewer" : "viewers"}</span>
            <span className="tabular-nums">{fmt(seconds)}</span>
          </div>
        )}
      </div>

      {live && (quality === ConnectionQuality.Poor || quality === ConnectionQuality.Lost) && !notice && (
        <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Weak connection. Video quality is being lowered automatically so the stream keeps playing.
        </p>
      )}
      {notice && <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{notice}</p>}
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-3 gap-2">
        <Button variant="secondary" onClick={toggleMic} disabled={busy}>{micOn ? "🎤 Mic" : "🔇 Muted"}</Button>
        <Button variant="secondary" onClick={toggleCam} disabled={busy}>{camOn ? "📷 Camera" : "🚫 Off"}</Button>
        <Button variant="secondary" onClick={flipCamera} disabled={busy}>🔄 Flip</Button>
      </div>

      {cameras.length > 1 && (
        <select
          aria-label="Select camera"
          className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          onChange={(e) => void pickCamera(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Switch camera…</option>
          {cameras.map((c, i) => (
            <option key={c.deviceId} value={c.deviceId}>{c.label || `Camera ${i + 1}`}</option>
          ))}
        </select>
      )}

      {live ? (
        <Button onClick={stopLive} disabled={busy} variant="danger" className="py-4 text-base">⏹ STOP LIVE</Button>
      ) : (
        <Button onClick={startLive} disabled={busy} className="py-4 text-base">
          {phase === "starting" ? "Starting…" : "🔴 START LIVE"}
        </Button>
      )}
      <p className="text-center text-xs text-foreground/50">Camera and microphone are only requested when you enable the camera or start the live stream.</p>
    </div>
  );
}
