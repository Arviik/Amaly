-- AlterTable
ALTER TABLE `members` ADD COLUMN `employmentType` VARCHAR(191) NULL DEFAULT 'NULL',
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
