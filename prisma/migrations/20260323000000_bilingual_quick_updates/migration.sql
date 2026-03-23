-- Delete all existing quick updates (they have old schema, not worth migrating)
DELETE FROM "QuickUpdate";

-- Drop old columns and enum
ALTER TABLE "QuickUpdate" DROP COLUMN "text";
ALTER TABLE "QuickUpdate" DROP COLUMN "type";
DROP TYPE IF EXISTS "UpdateType";

-- Add new columns
ALTER TABLE "QuickUpdate" ADD COLUMN "textEn" TEXT NOT NULL;
ALTER TABLE "QuickUpdate" ADD COLUMN "textAr" TEXT NOT NULL;
ALTER TABLE "QuickUpdate" ADD COLUMN "isBreaking" BOOLEAN NOT NULL DEFAULT false;
