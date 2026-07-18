/*
  Warnings:

  - You are about to drop the column `email` on the `dealer_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `dealer_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `dealer_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `dealer_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `photo_path` on the `dealer_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `dealer_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `fax` on the `dealer_locations` table. All the data in the column will be lost.
  - Added the required column `type` to the `dealer_contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `dealer_contacts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dealer_contacts` DROP FOREIGN KEY `dealer_contacts_location_id_fkey`;

-- DropIndex
DROP INDEX `dealer_contacts_location_id_fkey` ON `dealer_contacts`;

-- AlterTable
ALTER TABLE `dealer_contacts` DROP COLUMN `email`,
    DROP COLUMN `full_name`,
    DROP COLUMN `location_id`,
    DROP COLUMN `phone`,
    DROP COLUMN `photo_path`,
    DROP COLUMN `position`,
    ADD COLUMN `type` ENUM('phone', 'email', 'website', 'facebook', 'instagram', 'whatsapp', 'telegram', 'linkedin', 'youtube', 'other') NOT NULL,
    ADD COLUMN `value` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `dealer_locations` DROP COLUMN `fax`;
