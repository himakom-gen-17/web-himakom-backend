/*
  Warnings:

  - You are about to drop the `Formal_pics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile_pics` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Formal_pics" DROP CONSTRAINT "Formal_pics_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Profile_pics" DROP CONSTRAINT "Profile_pics_usersId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "formalPicture" TEXT,
ADD COLUMN     "profilePicture" TEXT;

-- DropTable
DROP TABLE "Formal_pics";

-- DropTable
DROP TABLE "Profile_pics";

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");
