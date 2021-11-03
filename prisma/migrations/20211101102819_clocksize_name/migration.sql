/*
  Warnings:

  - You are about to drop the column `size` on the `clockSizes` table. All the data in the column will be lost.
  - Added the required column `name` to the `clockSizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clockSizes" DROP COLUMN "size",
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
