/*
  Warnings:

  - Added the required column `role` to the `masters` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER');

-- AlterTable
ALTER TABLE "masters" ADD COLUMN     "role" "Role" NOT NULL;
