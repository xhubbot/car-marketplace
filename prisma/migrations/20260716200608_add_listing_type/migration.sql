-- AlterTable
ALTER TABLE `car_listings` ADD COLUMN `listing_type` ENUM('sell', 'buy', 'rentWanted', 'rentOffer') NOT NULL DEFAULT 'sell';
