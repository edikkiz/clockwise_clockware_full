/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `masters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `masters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `masters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `masters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `masters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "masters" ADD COLUMN     "login" VARCHAR(255) NOT NULL,
ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL,
ADD COLUMN     "token" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "masters_login_key" ON "masters"("login");
