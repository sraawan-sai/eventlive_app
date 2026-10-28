"use client";

import "@livekit/components-styles";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LiveKitRoom, RoomAudioRenderer, StartAudio, VideoTrack, useConnectionState, useRoomContext, useTracks } from "@livekit/components-react";
import { useLang } from "@/components/event/lang";
import { TickerBar } from "./ticker-bar";
import { ConnectionQuality, ConnectionState, RoomEvent, Track, type RemoteTrackPublication, type RoomOptions } from "livekit-client";

type Status = "OFFLINE" | "LIVE" | "ENDED";

const NAME_KEY = "eventra-guest-name";
const NAME_EVENT = "eventra-guest-name-change";

function subscribeName(onChange: () => void) {
  window.addEventListener(NAME_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(NAME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readName(): string | null {
  try {
    return localStorage.getItem(NAME_KEY);
  } catch {
    return "";
  }
}

// adaptiveStream: request only the quality layer that fits the player size and the viewer's bandwidth.
// dynacast: lets the broadcaster stop encoding layers nobody needs.
const ROOM_OPTIONS: RoomOptions = { adaptiveStream: true, dynacast: true };

function Panel({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="grid aspect-video w-full place-items-center rounded-2xl bg-neutral-900 p-6 text-center text-white">
      <div>
        <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-white/10 text-2xl">📹</div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="mt-1 text-sm text-white/60">{sub}</p>
      </div>
    </div>
  );
}

function ReconnectBanner() {
  const { tr } = useLang();
  const state = useConnectionState();
  if (state !== ConnectionState.Reconnecting) return null;
  return <p className="mt-2 text-sm font-medium text-amber-600">{tr("reconnecting")}</p>;
}

function QualityNotice() {
  const { tr } = useLang();
  const room = useRoomContext();
  const [poor, setPoor] = useState(false);
  useEffect(() => {
    const onQ = (q: ConnectionQuality, p: { isLocal: boolean }) => {
      if (p.isLocal) setPoor(q === ConnectionQuality.Poor || q === ConnectionQuality.Lost);
    };
    room.on(RoomEvent.ConnectionQualityChanged, onQ);
    return () => {
      room.off(RoomEvent.ConnectionQualityChanged, onQ);
    };
  }, [room]);
  if (!poor) return null;
  return <p className="mt-2 text-sm font-medium text-amber-600">{tr("slowConn")}</p>;
}

function Stage({ ticker }: { ticker: { on: boolean; text: string } }) {
  const { tr } = useLang();
  const [audioOnly, setAudioOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Real fullscreen where supported; otherwise (e.g. iPhone Safari) a page-filling view.
  function toggleExpand() {
    const box = boxRef.current;
    if (!box) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (expanded) {
      setExpanded(false);
      return;
    }
    if (box.requestFullscreen) {
      box.requestFullscreen().catch(() => setExpanded(true));
    } else {
      setExpanded(true);
    }
  }

  // Keep state in sync when the user leaves fullscreen with Esc / swipe.
  useEffect(() => {
    const onChange = () => setExpanded(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // onlySubscribed:false keeps unsubscribed video listed so "audio only" can be switched back off.
  const all = useTracks([Track.Source.Camera, Track.Source.ScreenShare], { onlySubscribed: false });

  // Audio only = unsubscribe from video (saves most of the bandwidth on a weak connection).
  useEffect(() => {
    for (const t of all) (t.publication as RemoteTrackPublication | undefined)?.setSubscribed(!audioOnly);
  }, [all, audioOnly]);

  const playable = all.filter((t) => t.publication?.track);
  const main = playable.find((t) => t.source === Track.Source.ScreenShare) ?? playable[0];
  // Match the broadcaster's shape: a phone held upright is tall, a laptop or phone held sideways is wide.
  const dim = main?.publication?.dimensions;
  const ratio = dim && dim.width && dim.height ? dim.width / dim.height : 16 / 9;

  return (
    <>
      {audioOnly ? (
        <Panel title={tr("audioOnly")} sub={tr("audioOnlyOn")} />
      ) : main ? (
        <div
          ref={boxRef}
          onDoubleClick={toggleExpand}
          style={expanded ? undefined : ({ aspectRatio: ratio, "--r": ratio } as React.CSSProperties)}
          className={
            expanded
              ? "fixed inset-0 z-50 flex items-center justify-center bg-black"
              : "relative mx-auto w-full overflow-hidden rounded-2xl bg-black md:max-w-[calc(85vh*var(--r))]"
          }
        >
          <VideoTrack trackRef={main} className="h-full w-full object-contain" />
          <button
            type="button"
            onClick={toggleExpand}
            aria-label={expanded ? tr("close") : tr("fullscreen")}
            className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-black/80"
          >
            {expanded ? tr("close") : tr("fullscreen")}
          </button>
        </div>
      ) : (
        <Panel title={tr("waiting")} sub={tr("waitingSub")} />
      )}
      {ticker.on && ticker.text && <TickerBar text={ticker.text} />}
      <button
        type="button"
        onClick={() => setAudioOnly((v) => !v)}
        className="mt-2 text-xs font-semibold underline opacity-70 hover:opacity-100"
      >
        {audioOnly ? tr("videoBack") : tr("audioOnlyLink")}
      </button>
    </>
  );
}

export function LiveViewer({ slug, initialStatus, initialTicker }: { slug: string; initialStatus: Status; initialTicker: { on: boolean; text: string } }) {
  const { tr } = useLang();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [viewers, setViewers] = useState(0);
  const [ticker, setTicker] = useState(initialTicker);
  const [full, setFull] = useState(false);
  const [conn, setConn] = useState<{ token: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const connected = useRef(false); // have a token / are joining
  const failed = useRef(false); // last join failed: wait for the user to retry
  const nameRef = useRef(""); // optional display name the host sees in the viewer list
  const askedRef = useRef(false); // true once the guest typed a name or skipped
  const stored = useSyncExternalStore(subscribeName, readName, () => ""); // null = never asked on this device
  const [answered, setAnswered] = useState(false);
  const nameAsked = answered || stored !== null; // false = show the name prompt before joining
  const [draft, setDraft] = useState("");

  useEffect(() => {
    nameRef.current = stored ?? nameRef.current;
    askedRef.current = askedRef.current || stored !== null;
  }, [stored]);

  const join = useCallback(async () => {
    if (connected.current) return;
    connected.current = true;
    failed.current = false;
    setError(null);
    setFull(false);
    try {
      const r = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, role: "viewer", name: nameRef.current || undefined }),
      });
      if (!r.ok) {
        const d = (await r.json().catch(() => ({}))) as { code?: string };
        if (d.code === "stream_full") {
          // Package viewer cap reached: show a friendly message instead of an error.
          connected.current = false;
          failed.current = true;
          setFull(true);
          return;
        }
        throw new Error();
      }
      setConn(await r.json());
    } catch {
      connected.current = false;
      failed.current = true;
      setError("Unable to connect to the live stream. Please try again.");
    }
  }, [slug]);

  // Poll public status; join when the stream goes live, drop the connection when it stops.
  useEffect(() => {
    let stop = false;
    async function poll() {
      try {
        const r = await fetch(`/api/events/${slug}/status`, { cache: "no-store" });
        if (!r.ok || stop) return;
        const d = (await r.json()) as { status: Status; viewers: number; ticker?: { on: boolean; text: string } };
        setStatus(d.status);
        setViewers(d.viewers);
        if (d.ticker) setTicker(d.ticker);
        if (d.status === "LIVE") {
          if (!connected.current && !failed.current && askedRef.current) void join();
        } else {
          connected.current = false;
          failed.current = false;
          setConn(null);
          setError(null);
        }
      } catch {
        /* keep last known state */
      }
    }
    void poll();
    const id = setInterval(poll, 5000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [slug, join]);

  function answerName(value: string) {
    const v = value.trim().slice(0, 40);
    nameRef.current = v;
    askedRef.current = true;
    try {
      localStorage.setItem(NAME_KEY, v);
      window.dispatchEvent(new Event(NAME_EVENT));
    } catch {
      /* storage blocked: the guest is asked again next visit */
    }
    setAnswered(true);
    void join();
  }

  if (status === "ENDED" || status === "OFFLINE") {
    return (
      <div>
        {status === "ENDED" ? <Panel title={tr("ended")} sub={tr("endedSub")} /> : <Panel title={tr("notStarted")} sub={tr("notStartedSub")} />}
        {ticker.on && ticker.text && <TickerBar text={ticker.text} />}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-bold text-red-600">
          <span className="live-dot">🔴</span> {tr("liveNow")}
        </span>
        <span className="opacity-70">{viewers} {viewers === 1 ? tr("viewer") : tr("viewers")}</span>
      </div>
      {!nameAsked ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            answerName(draft);
          }}
          className="grid aspect-video place-items-center rounded-2xl bg-neutral-900 p-6 text-center text-white"
        >
          <div className="w-full max-w-xs">
            <p className="font-semibold">{tr("yourName")}</p>
            <p className="mt-1 text-sm text-white/60">{tr("yourNameSub")}</p>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={40}
              autoComplete="name"
              className="mt-3 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-base text-white outline-none placeholder:text-white/40 focus:border-white/60"
            />
            <div className="mt-3 flex justify-center gap-2">
              <button type="submit" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-900">
                {tr("watchLive")}
              </button>
              <button type="button" onClick={() => answerName("")} className="rounded-lg px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
                {tr("skip")}
              </button>
            </div>
          </div>
        </form>
      ) : full ? (
        <div className="grid aspect-video place-items-center rounded-2xl bg-neutral-900 p-6 text-center text-white">
          <div>
            <p className="font-semibold">{tr("streamFull")}</p>
            <p className="mt-1 text-sm text-white/60">{tr("streamFullSub")}</p>
            <button
              type="button"
              onClick={() => void join()}
              className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
            >
              {tr("tryAgain")}
            </button>
          </div>
        </div>
      ) : error ? (
        <div className="grid aspect-video place-items-center rounded-2xl bg-neutral-900 p-6 text-center text-white">
          <div>
            <p className="font-semibold">{tr("unableConnect")}</p>
            <button
              type="button"
              onClick={() => void join()}
              className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
            >
              {tr("tryAgain")}
            </button>
          </div>
        </div>
      ) : conn ? (
        <LiveKitRoom
          serverUrl={conn.url}
          token={conn.token}
          connect
          audio={false}
          video={false}
          options={ROOM_OPTIONS}
          onDisconnected={() => {
            connected.current = false;
            setConn(null);
          }}
          onError={() => {
            failed.current = true;
            connected.current = false;
            setConn(null);
            setError("Unable to connect to the live stream. Please try again.");
          }}
          onMediaDeviceFailure={() => {}}
        >
          <Stage ticker={ticker} />
          <RoomAudioRenderer />
          <div className="mt-3 flex justify-center">
            <StartAudio label={tr("tapSound")} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white" />
          </div>
          <ReconnectBanner />
          <QualityNotice />
        </LiveKitRoom>
      ) : (
        <Panel title={tr("connecting")} sub={tr("connectingSub")} />
      )}
    </div>
  );
}
