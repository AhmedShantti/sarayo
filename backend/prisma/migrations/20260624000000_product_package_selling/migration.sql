-- AlterTable: add per-package selling fields to Product
ALTER TABLE "Product" ADD COLUMN "sellingUnit" TEXT NOT NULL DEFAULT 'package';
ALTER TABLE "Product" ADD COLUMN "packageSize" INTEGER NOT NULL DEFAULT 12;
ALTER TABLE "Product" ADD COLUMN "packagePrice" DECIMAL(10,2);

-- Backfill existing products: sell by package of 12 at price * 12.
UPDATE "Product" SET "packagePrice" = "price" * "packageSize" WHERE "packagePrice" IS NULL;
