/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "createdAt",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
