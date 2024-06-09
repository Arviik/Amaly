-- AlterTable
ALTER TABLE `polls` ADD COLUMN `modality` ENUM('ONE', 'TWO') NOT NULL DEFAULT 'ONE';
