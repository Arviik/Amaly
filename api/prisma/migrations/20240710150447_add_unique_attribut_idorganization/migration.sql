/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `members` MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';

-- CreateIndex
CREATE UNIQUE INDEX `organizations_id_key` ON `organizations`(`id`);
