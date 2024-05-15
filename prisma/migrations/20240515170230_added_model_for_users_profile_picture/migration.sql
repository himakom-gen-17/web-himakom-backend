/*
  Warnings:

  - You are about to drop the column `image` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "Profile_pics" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "Profile_pics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_pics_path_key" ON "Profile_pics"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_pics_usersId_key" ON "Profile_pics"("usersId");

-- AddForeignKey
ALTER TABLE "Profile_pics" ADD CONSTRAINT "Profile_pics_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
