/*
  Warnings:

  - Added the required column `role` to the `roleAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "roleAdmin" ADD COLUMN     "role" "Role" NOT NULL;
