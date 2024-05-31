-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_generasiName_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "generasiName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_generasiName_fkey" FOREIGN KEY ("generasiName") REFERENCES "Generasi"("name") ON DELETE SET NULL ON UPDATE CASCADE;
