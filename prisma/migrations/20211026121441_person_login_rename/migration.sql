/*
  Warnings:

  - You are about to drop the column `login` on the `Person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Person_login_key";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "login",
ADD COLUMN     "email" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");
