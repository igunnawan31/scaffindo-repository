/*
  Warnings:

  - The values [DISTRIBUTOR_PICKED_UP,ARRIVED_AT_DISTRIBUTOR,DISTRIBUTOR_TO_AGENT,ARRIVED_AT_AGENT,AGENT_TO_RETAIL] on the enum `LabelStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ARRIVED_AT_DISTRIBUTOR,ARRIVED_AT_AGENT,ARRIVED_AT_RETAIL] on the enum `TrackStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."LabelStatus_new" AS ENUM ('FACTORY_DONE', 'WAITING_DISTRIBUTOR', 'DISTRIBUTOR_ACCEPTED', 'WAITING_AGENT', 'AGENT_ACCEPTED', 'WAITING_RETAIL', 'RETAIL_ACCEPTED', 'ARRIVED_AT_RETAIL', 'PURCHASED_BY_CUSTOMER');
ALTER TABLE "public"."Invoice" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Label" ALTER COLUMN "status" TYPE "public"."LabelStatus_new" USING ("status"::text::"public"."LabelStatus_new");
ALTER TABLE "public"."Invoice" ALTER COLUMN "status" TYPE "public"."LabelStatus_new" USING ("status"::text::"public"."LabelStatus_new");
ALTER TYPE "public"."LabelStatus" RENAME TO "LabelStatus_old";
ALTER TYPE "public"."LabelStatus_new" RENAME TO "LabelStatus";
DROP TYPE "public"."LabelStatus_old";
ALTER TABLE "public"."Invoice" ALTER COLUMN "status" SET DEFAULT 'FACTORY_DONE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TrackStatus_new" AS ENUM ('FACTORY_DONE', 'DISTRIBUTOR_ACCEPTED', 'AGENT_ACCEPTED', 'RETAIL_ACCEPTED', 'PURCHASED_BY_CUSTOMER');
ALTER TABLE "public"."Tracking" ALTER COLUMN "status" TYPE "public"."TrackStatus_new" USING ("status"::text::"public"."TrackStatus_new");
ALTER TYPE "public"."TrackStatus" RENAME TO "TrackStatus_old";
ALTER TYPE "public"."TrackStatus_new" RENAME TO "TrackStatus";
DROP TYPE "public"."TrackStatus_old";
COMMIT;
