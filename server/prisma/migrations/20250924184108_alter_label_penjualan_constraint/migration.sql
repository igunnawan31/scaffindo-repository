/*
  Warnings:

  - Made the column `productId` on table `Certification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Label" DROP CONSTRAINT "Label_penjualanId_fkey";

-- AlterTable
ALTER TABLE "public"."Certification" ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Label" ALTER COLUMN "penjualanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Label" ADD CONSTRAINT "Label_penjualanId_fkey" FOREIGN KEY ("penjualanId") REFERENCES "public"."Penjualan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
