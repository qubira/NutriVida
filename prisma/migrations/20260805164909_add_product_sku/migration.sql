-- AlterTable
ALTER TABLE "Product" ADD COLUMN "sku" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
