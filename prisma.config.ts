import { defineConfig, env } from "prisma/config";

// Prisma CLI does not read .env.local on its own.
try {
  process.loadEnvFile(".env.local");
} catch {
  // fall back to real environment variables
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrations should use a direct (non-pooled) connection when one is provided (e.g. Neon's DIRECT_URL).
  datasource: { url: process.env.DIRECT_URL || env("DATABASE_URL") },
});
