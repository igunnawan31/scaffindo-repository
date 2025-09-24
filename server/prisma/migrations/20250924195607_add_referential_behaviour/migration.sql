-- DropForeignKey
ALTER TABLE "public"."Label" DROP CONSTRAINT "Label_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Label" DROP CONSTRAINT "Label_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tracking" DROP CONSTRAINT "Tracking_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tracking" DROP CONSTRAINT "Tracking_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Label" ADD CONSTRAINT "Label_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Label" ADD CONSTRAINT "Label_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tracking" ADD CONSTRAINT "Tracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tracking" ADD CONSTRAINT "Tracking_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
