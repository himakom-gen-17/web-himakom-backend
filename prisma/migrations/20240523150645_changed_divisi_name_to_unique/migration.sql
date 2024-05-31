/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Divisi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Divisi_name_key" ON "Divisi"("name");
