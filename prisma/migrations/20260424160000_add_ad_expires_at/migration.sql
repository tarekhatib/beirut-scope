-- Add expiresAt column to Ad
ALTER TABLE "Ad"
ADD COLUMN "expiresAt" TIMESTAMP(3);
