-- DropForeignKey
ALTER TABLE "public"."InvoicePIC" DROP CONSTRAINT "InvoicePIC_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvoicePIC" DROP CONSTRAINT "InvoicePIC_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."InvoicePIC" ADD CONSTRAINT "InvoicePIC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoicePIC" ADD CONSTRAINT "InvoicePIC_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
