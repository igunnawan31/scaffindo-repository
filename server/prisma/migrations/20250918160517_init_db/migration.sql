-- CreateEnum
CREATE TYPE "public"."LabelStatus" AS ENUM ('FACTORY_DONE', 'WAITING_DISTRIBUTOR', 'DISTRIBUTOR_ACCEPTED', 'DISTRIBUTOR_PICKED_UP', 'ARRIVED_AT_DISTRIBUTOR', 'AGENT_ACCEPTED', 'DISTRIBUTOR_TO_AGENT', 'ARRIVED_AT_AGENT', 'RETAIL_ACCEPTED', 'AGENT_TO_RETAIL', 'ARRIVED_AT_RETAIL', 'PURCHASED_BY_CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."TrackStatus" AS ENUM ('FACTORY_DONE', 'ARRIVED_AT_DISTRIBUTOR', 'ARRIVED_AT_AGENT', 'ARRIVED_AT_RETAIL', 'PURCHASED_BY_CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('CLOTHING', 'FOOD_BEVERAGE', 'ELECTRONIC');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPERADMIN', 'CONSUMER', 'FACTORY', 'DISTRIBUTOR', 'AGENT', 'RETAIL');

-- CreateEnum
CREATE TYPE "public"."SubRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "factoryName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "subRole" "public"."SubRole" NOT NULL,
    "invoiceId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" JSONB NOT NULL,
    "price" TEXT NOT NULL,
    "category" "public"."ProductCategory"[],

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expired" TIMESTAMP(3) NOT NULL,
    "details" TEXT NOT NULL,
    "document" JSONB NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Label" (
    "id" TEXT NOT NULL,
    "qrCode" JSONB NOT NULL,
    "status" "public"."LabelStatus" NOT NULL,
    "productId" INTEGER NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" TEXT NOT NULL,
    "qrCode" JSONB NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."TrackStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "labelId" TEXT,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certification" ADD CONSTRAINT "Certification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Label" ADD CONSTRAINT "Label_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Label" ADD CONSTRAINT "Label_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tracking" ADD CONSTRAINT "Tracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tracking" ADD CONSTRAINT "Tracking_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "public"."Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;
