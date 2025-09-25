/*
  Warnings:

  - Made the column `labelId` on table `Tracking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Tracking" ALTER COLUMN "labelId" SET NOT NULL;
