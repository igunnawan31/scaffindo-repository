/*
  Warnings:

  - Added the required column `type` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Tracking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CompanyType" AS ENUM ('FACTORY', 'DISTRIBUTOR', 'AGENT', 'RETAIL', 'CONSUMER');

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "type" "public"."CompanyType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "nextCompanyId" TEXT;

-- AlterTable
ALTER TABLE "public"."Tracking" DROP COLUMN "role",
ADD COLUMN     "role" "public"."CompanyType" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_nextCompanyId_fkey" FOREIGN KEY ("nextCompanyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
