-- AlterTable
ALTER TABLE `car_listings` ADD COLUMN `dealer_id` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `dealers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `company_name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `registry_code` VARCHAR(30) NULL,
    `vat_number` VARCHAR(30) NULL,
    `logo_path` VARCHAR(255) NULL,
    `cover_image_path` VARCHAR(255) NULL,
    `website_url` VARCHAR(255) NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `status` ENUM('pending', 'active', 'suspended') NOT NULL DEFAULT 'pending',
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dealers_slug_key`(`slug`),
    INDEX `idx_dealer_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_translations` (
    `dealer_id` INTEGER UNSIGNED NOT NULL,
    `language_code` CHAR(2) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`dealer_id`, `language_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_locations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dealer_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(100) NULL,
    `country_id` INTEGER UNSIGNED NULL,
    `location_id` INTEGER UNSIGNED NULL,
    `address_line` VARCHAR(255) NOT NULL,
    `postal_code` VARCHAR(20) NULL,
    `latitude` DECIMAL(9, 6) NULL,
    `longitude` DECIMAL(9, 6) NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_dealer_locations`(`dealer_id`),
    INDEX `idx_dealer_location_lookup`(`location_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_working_hours` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER UNSIGNED NOT NULL,
    `day_of_week` TINYINT UNSIGNED NOT NULL,
    `opens_at` TIME(0) NULL,
    `closes_at` TIME(0) NULL,
    `is_closed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `dealer_working_hours_location_id_day_of_week_key`(`location_id`, `day_of_week`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_contacts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dealer_id` INTEGER UNSIGNED NOT NULL,
    `location_id` INTEGER UNSIGNED NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `position` VARCHAR(100) NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `photo_path` VARCHAR(255) NULL,
    `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_dealer_contacts`(`dealer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_dealer_listings` ON `car_listings`(`dealer_id`);

-- AddForeignKey
ALTER TABLE `dealer_translations` ADD CONSTRAINT `dealer_translations_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_locations` ADD CONSTRAINT `dealer_locations_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_locations` ADD CONSTRAINT `dealer_locations_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_locations` ADD CONSTRAINT `dealer_locations_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_working_hours` ADD CONSTRAINT `dealer_working_hours_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `dealer_locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_contacts` ADD CONSTRAINT `dealer_contacts_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_contacts` ADD CONSTRAINT `dealer_contacts_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `dealer_locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
