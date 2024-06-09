/*
  Warnings:

  - Added the required column `text` to the `polls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `polls` ADD COLUMN `text` VARCHAR(255) NOT NULL;
