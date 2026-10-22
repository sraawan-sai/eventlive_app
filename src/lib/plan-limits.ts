/** Limits enforced by the server for each package. Keep in step with src/lib/packages.ts (what the website shows). */
export interface PlanLimits {
  id: string;
  name: string;
  maxViewers: number; // guests watching at the same time
  maxLiveMinutes: number; // total live time per event
  storageGB: number; // photos, card, video and music per user
}

export const DEFAULT_PLAN = "free";

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: { id: "free", name: "Free", maxViewers: 20, maxLiveMinutes: 60, storageGB: 1 },
  starter: { id: "starter", name: "Starter", maxViewers: 30, maxLiveMinutes: 120, storageGB: 2 },
  basic: { id: "basic", name: "Basic", maxViewers: 50, maxLiveMinutes: 120, storageGB: 3 },
  pro: { id: "pro", name: "Pro", maxViewers: 100, maxLiveMinutes: 240, storageGB: 10 },
  premium: { id: "premium", name: "Premium", maxViewers: 300, maxLiveMinutes: 300, storageGB: 20 },
  community: { id: "community", name: "Community", maxViewers: 1000, maxLiveMinutes: 180, storageGB: 2 },
  mega: { id: "mega", name: "Mega", maxViewers: 1000, maxLiveMinutes: 240, storageGB: 20 },
  unlimited: { id: "unlimited", name: "Unlimited", maxViewers: 200, maxLiveMinutes: 360, storageGB: 50 },
};

export const PLAN_IDS = Object.keys(PLAN_LIMITS);
export const limitsFor = (id?: string | null): PlanLimits => PLAN_LIMITS[id ?? ""] ?? PLAN_LIMITS[DEFAULT_PLAN];

export interface UsageInfo {
  planName: string;
  maxViewers: number;
  limitSeconds: number;
  usedSeconds: number;
  exempt: boolean;
}
