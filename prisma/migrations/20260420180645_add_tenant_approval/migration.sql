-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "approval_status" "TenantStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "max_users" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "rejection_reason" TEXT;

-- CreateTable
CREATE TABLE "user_actions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_actions_user_id_idx" ON "user_actions"("user_id");

-- CreateIndex
CREATE INDEX "user_actions_tenant_id_idx" ON "user_actions"("tenant_id");
