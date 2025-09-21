/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_invoiceId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "invoiceId";

-- CreateTable
CREATE TABLE "public"."InvoicePIC" (
    "userId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "InvoicePIC_pkey" PRIMARY KEY ("userId","invoiceId")
);

-- AddForeignKey
ALTER TABLE "public"."InvoicePIC" ADD CONSTRAINT "InvoicePIC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoicePIC" ADD CONSTRAINT "InvoicePIC_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
