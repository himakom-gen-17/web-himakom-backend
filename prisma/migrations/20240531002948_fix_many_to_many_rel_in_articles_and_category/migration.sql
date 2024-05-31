/*
  Warnings:

  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArticlesToCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArticlesToCategories" DROP CONSTRAINT "_ArticlesToCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticlesToCategories" DROP CONSTRAINT "_ArticlesToCategories_B_fkey";

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "_ArticlesToCategories";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticlesToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticlesToCategory_AB_unique" ON "_ArticlesToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticlesToCategory_B_index" ON "_ArticlesToCategory"("B");

-- AddForeignKey
ALTER TABLE "_ArticlesToCategory" ADD CONSTRAINT "_ArticlesToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticlesToCategory" ADD CONSTRAINT "_ArticlesToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
