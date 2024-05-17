-- CreateTable
CREATE TABLE "Formal_pics" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "Formal_pics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Formal_pics_path_key" ON "Formal_pics"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Formal_pics_usersId_key" ON "Formal_pics"("usersId");

-- AddForeignKey
ALTER TABLE "Formal_pics" ADD CONSTRAINT "Formal_pics_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
