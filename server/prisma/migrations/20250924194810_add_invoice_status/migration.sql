-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "status" "public"."LabelStatus" NOT NULL DEFAULT 'FACTORY_DONE';
