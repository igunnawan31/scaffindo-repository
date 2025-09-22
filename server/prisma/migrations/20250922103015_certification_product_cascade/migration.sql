-- DropForeignKey
ALTER TABLE "public"."Certification" DROP CONSTRAINT "Certification_productId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Certification" ADD CONSTRAINT "Certification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
