-- DropForeignKey
ALTER TABLE "public"."Tracking" DROP CONSTRAINT "Tracking_labelId_fkey";

-- AlterTable
ALTER TABLE "public"."Tracking" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Tracking" ADD CONSTRAINT "Tracking_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "public"."Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
