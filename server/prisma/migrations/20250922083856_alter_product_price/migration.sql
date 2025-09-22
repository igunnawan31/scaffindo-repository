/*
  Warnings:

  - Changed the type of `totalHarga` on the `Penjualan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Penjualan" DROP COLUMN "totalHarga",
ADD COLUMN     "totalHarga" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL;
