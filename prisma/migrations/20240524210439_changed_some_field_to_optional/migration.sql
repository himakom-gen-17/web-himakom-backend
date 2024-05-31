/*
  Warnings:

  - You are about to drop the column `title` on the `Categories` table. All the data in the column will be lost.
  - Added the required column `name` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_divisiId_fkey";

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_userId_fkey";

-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_userId_fkey";

-- DropForeignKey
ALTER TABLE "Episodes" DROP CONSTRAINT "Episodes_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Socials" DROP CONSTRAINT "Socials_userId_fkey";

-- AlterTable
ALTER TABLE "Articles" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "divisiId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Courses" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Episodes" ALTER COLUMN "courseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Images" ALTER COLUMN "albumId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Socials" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Socials" ADD CONSTRAINT "Socials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "Divisi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episodes" ADD CONSTRAINT "Episodes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
