-- DropIndex
DROP INDEX `organizations_id_key` ON `organizations`;

-- AlterTable
ALTER TABLE `members` MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';
