/*
  Warnings:

  - You are about to drop the column `limit` on the `LicenseKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[planId]` on the table `LicenseKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `planId` to the `LicenseKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LicenseKey" DROP COLUMN "limit",
ADD COLUMN     "planId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Plans" (
    "planId" SERIAL NOT NULL,
    "limit" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "expires" TEXT NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("planId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_planId_key" ON "LicenseKey"("planId");

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("planId") ON DELETE RESTRICT ON UPDATE CASCADE;
