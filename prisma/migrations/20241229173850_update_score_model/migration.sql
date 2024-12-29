/*
  Warnings:

  - You are about to drop the column `completed` on the `Score` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "completed",
ADD COLUMN     "hintsUsed" INTEGER,
ADD COLUMN     "timeTaken" INTEGER;
