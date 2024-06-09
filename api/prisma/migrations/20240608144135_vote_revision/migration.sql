/*
  Warnings:

  - You are about to drop the `VotesOnChoices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `choiceId` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `VotesOnChoices` DROP FOREIGN KEY `VotesOnChoices_choiceId_fkey`;

-- DropForeignKey
ALTER TABLE `VotesOnChoices` DROP FOREIGN KEY `VotesOnChoices_voteId_fkey`;

-- AlterTable
ALTER TABLE `votes` ADD COLUMN `choiceId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `VotesOnChoices`;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_choiceId_fkey` FOREIGN KEY (`choiceId`) REFERENCES `choices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
