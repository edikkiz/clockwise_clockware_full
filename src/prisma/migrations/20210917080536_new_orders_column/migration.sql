-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" BOOLEAN DEFAULT false,
ALTER COLUMN "feedback" SET DEFAULT E'null';
