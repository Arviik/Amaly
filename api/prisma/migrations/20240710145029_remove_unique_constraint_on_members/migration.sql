-- AlterTable
ALTER TABLE `members` MODIFY `employmentType` VARCHAR(191) NULL DEFAULT 'NULL';

-- CreateIndex
CREATE INDEX `members_organizationId_idx` ON `members`(`organizationId`);
