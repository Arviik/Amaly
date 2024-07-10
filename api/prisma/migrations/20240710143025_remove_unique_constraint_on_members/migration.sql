-- DropIndex
DROP INDEX `members_userId_organizationId_key` ON `members`;

-- AlterTable
ALTER TABLE `members` MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';

-- AlterTable
ALTER TABLE `organizations` MODIFY `updatedAt` DATETIME(3) NULL;
