-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('not_submitted', 'submitted', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "kyc_approved_at" TIMESTAMP(3),
ADD COLUMN     "kyc_rejection_reason" TEXT,
ADD COLUMN     "kyc_status" "KycStatus" NOT NULL DEFAULT 'not_submitted',
ADD COLUMN     "kyc_submitted_at" TIMESTAMP(3),
ADD COLUMN     "nida_number" VARCHAR(50),
ADD COLUMN     "shop_address" TEXT,
ADD COLUMN     "shop_photo_url" TEXT,
ADD COLUMN     "shop_type" VARCHAR(100);
