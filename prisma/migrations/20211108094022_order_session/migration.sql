/*
  Warnings:

  - A unique constraint covering the columns `[feedbackToken]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "session" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_feedbackToken_key" ON "orders"("feedbackToken");
