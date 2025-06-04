/*
  Warnings:

  - You are about to drop the column `workDayId` on the `TimeLog` table. All the data in the column will be lost.
  - You are about to drop the `WorkDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_workDayId_fkey";

-- DropForeignKey
ALTER TABLE "WorkDay" DROP CONSTRAINT "WorkDay_userId_fkey";

-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "workDayId";

-- DropTable
DROP TABLE "WorkDay";
