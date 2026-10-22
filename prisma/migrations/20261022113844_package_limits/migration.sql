-- AlterTable
ALTER TABLE "LiveStream" ADD COLUMN     "liveSeconds" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "packageId" TEXT NOT NULL DEFAULT 'free';
