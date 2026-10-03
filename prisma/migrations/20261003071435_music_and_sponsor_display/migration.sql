-- AlterEnum
ALTER TYPE "MediaKind" ADD VALUE 'MUSIC';

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "display" TEXT NOT NULL DEFAULT 'logo';
