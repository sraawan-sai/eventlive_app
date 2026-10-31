import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy: the browser only loads scripts, frames and connections from the places the site needs.
 * - img/media allow https because owners paste their own cover image links and files come from the storage bucket.
 * - connect allows wss/https because the LiveKit server address is set by an environment variable.
 * - 'unsafe-inline' scripts are required by Next.js's own inline bootstrap code (a nonce-based policy would make every page dynamic).
 * - form-action is left out on purpose: the Google sign-in form redirects to accounts.google.com, which that rule would block.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https: wss:${dev ? " ws:" : ""}`,
  "worker-src 'self' blob:",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The broadcaster page needs the camera and microphone; nothing else on the site does.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
