/*
  Warnings:

  - A unique constraint covering the columns `[saleId,status]` on the table `SaleHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SaleHistory_saleId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "SaleHistory_saleId_status_key" ON "SaleHistory"("saleId", "status");
