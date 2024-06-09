/*
  Warnings:

  - You are about to drop the column `agId` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the column `choice` on the `votes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `votes` DROP FOREIGN KEY `votes_agId_fkey`;

-- AlterTable
ALTER TABLE `votes` DROP COLUMN `agId`,
    DROP COLUMN `choice`;

-- CreateTable
CREATE TABLE `polls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usersId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `choices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `choice` VARCHAR(191) NOT NULL,
    `pollId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VotesOnChoices` (
    `choiceId` INTEGER NOT NULL,
    `voteId` INTEGER NOT NULL,

    PRIMARY KEY (`voteId`, `choiceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `polls` ADD CONSTRAINT `polls_agId_fkey` FOREIGN KEY (`agId`) REFERENCES `ags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `polls` ADD CONSTRAINT `polls_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `choices` ADD CONSTRAINT `choices_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `polls`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VotesOnChoices` ADD CONSTRAINT `VotesOnChoices_choiceId_fkey` FOREIGN KEY (`choiceId`) REFERENCES `choices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VotesOnChoices` ADD CONSTRAINT `VotesOnChoices_voteId_fkey` FOREIGN KEY (`voteId`) REFERENCES `votes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
