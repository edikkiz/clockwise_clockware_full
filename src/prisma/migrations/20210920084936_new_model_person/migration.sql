/*
  Warnings:

  - You are about to drop the column `login` on the `masters` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `masters` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `masters` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `masters` table. All the data in the column will be lost.
  - You are about to drop the `roleAdmin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `personId` to the `masters` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "masters_login_key";

-- AlterTable
ALTER TABLE "masters" DROP COLUMN "login",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "salt",
ADD COLUMN     "personId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "roleAdmin";

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_login_key" ON "Person"("login");

-- AddForeignKey
ALTER TABLE "masters" ADD CONSTRAINT "masters_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
