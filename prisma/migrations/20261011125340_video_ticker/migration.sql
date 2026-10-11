-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "tickerOn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tickerText" TEXT;
