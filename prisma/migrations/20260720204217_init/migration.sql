-- CreateTable
CREATE TABLE `translations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(50) NOT NULL,
    `ref_id` INTEGER UNSIGNED NOT NULL,
    `language_code` CHAR(2) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    INDEX `idx_lookup`(`category`, `ref_id`),
    UNIQUE INDEX `translations_category_ref_id_language_code_key`(`category`, `ref_id`, `language_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fuel_types` (
    `id` INTEGER UNSIGNED NOT NULL,
    `technical_name` VARCHAR(50) NOT NULL,
    `is_electric` BOOLEAN NOT NULL DEFAULT false,
    `is_hybrid` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `fuel_types_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transmissions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `technical_name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `transmissions_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drive_types` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `technical_name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `drive_types_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `colors` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `technical_name` VARCHAR(50) NOT NULL,
    `hex_code` CHAR(7) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `colors_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_standards` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `technical_name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `emission_standards_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle_categories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `technical_name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `vehicle_categories_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `body_types` (
    `id` INTEGER UNSIGNED NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `technical_name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `body_types_category_id_technical_name_key`(`category_id`, `technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER UNSIGNED NOT NULL,
    `iso2_code` CHAR(2) NULL,
    `fallback_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER UNSIGNED NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `fallback_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_makes` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `car_makes_name_key`(`name`),
    UNIQUE INDEX `car_makes_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_models` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `make_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `car_models_make_id_name_key`(`make_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_periods` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `model_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `year_from` SMALLINT UNSIGNED NULL,
    `year_to` SMALLINT UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature_categories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `technical_name` VARCHAR(50) NOT NULL,
    `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `feature_categories_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_features` (
    `id` INTEGER UNSIGNED NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `technical_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `note` VARCHAR(255) NULL,

    UNIQUE INDEX `dealer_working_hours_location_id_day_of_week_key`(`location_id`, `day_of_week`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_contacts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dealer_id` INTEGER UNSIGNED NOT NULL,
    `type` ENUM('phone', 'email', 'website', 'facebook', 'instagram', 'whatsapp', 'telegram', 'linkedin', 'youtube', 'other') NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_dealer_contacts`(`dealer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_categories` (
    `id` INTEGER UNSIGNED NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `fallback_name` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_dealer_category_parent`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_category_links` (
    `dealer_id` INTEGER UNSIGNED NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,

    INDEX `idx_dealer_category_links_category`(`category_id`),
    PRIMARY KEY (`dealer_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer_make_links` (
    `dealer_id` INTEGER UNSIGNED NOT NULL,
    `make_id` INTEGER UNSIGNED NOT NULL,

    INDEX `idx_dealer_make_links_make`(`make_id`),
    PRIMARY KEY (`dealer_id`, `make_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_listings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `dealer_id` INTEGER UNSIGNED NULL,
    `listing_type` ENUM('sell', 'buy', 'rentWanted', 'rentOffer') NOT NULL DEFAULT 'sell',
    `make_id` INTEGER UNSIGNED NOT NULL,
    `model_id` INTEGER UNSIGNED NOT NULL,
    `model_period_id` INTEGER UNSIGNED NULL,
    `model_trim` VARCHAR(100) NULL,
    `category_id` INTEGER UNSIGNED NULL,
    `body_type_id` INTEGER UNSIGNED NULL,
    `vin_code` VARCHAR(17) NULL,
    `reg_nr` VARCHAR(20) NULL,
    `year_manufactured` SMALLINT UNSIGNED NOT NULL,
    `month_manufactured` TINYINT UNSIGNED NULL,
    `mileage` INTEGER UNSIGNED NOT NULL,
    `fuel_type_id` INTEGER UNSIGNED NOT NULL,
    `transmission_id` INTEGER UNSIGNED NULL,
    `drive_type_id` INTEGER UNSIGNED NULL,
    `engine_displacement_cc` SMALLINT UNSIGNED NULL,
    `engine_power_kw` SMALLINT UNSIGNED NULL,
    `engine_power_hp` SMALLINT UNSIGNED NULL,
    `engine_info` VARCHAR(100) NULL,
    `emission_standard_id` INTEGER UNSIGNED NULL,
    `co2_emission_gkm` SMALLINT UNSIGNED NULL,
    `fuel_consumption_city` DECIMAL(5, 2) NULL,
    `fuel_consumption_highway` DECIMAL(5, 2) NULL,
    `fuel_consumption_mixed` DECIMAL(5, 2) NULL,
    `fuel_tank_capacity_l` SMALLINT UNSIGNED NULL,
    `doors` TINYINT UNSIGNED NULL,
    `seats` TINYINT UNSIGNED NULL,
    `vehicle_length_mm` INTEGER UNSIGNED NULL,
    `vehicle_width_mm` INTEGER UNSIGNED NULL,
    `vehicle_height_mm` INTEGER UNSIGNED NULL,
    `wheelbase_mm` INTEGER UNSIGNED NULL,
    `kerb_weight_kg` INTEGER UNSIGNED NULL,
    `gross_weight_kg` INTEGER UNSIGNED NULL,
    `payload_kg` INTEGER UNSIGNED NULL,
    `tow_capacity_braked_kg` INTEGER UNSIGNED NULL,
    `tow_capacity_unbraked_kg` INTEGER UNSIGNED NULL,
    `acceleration_0_100` DECIMAL(4, 1) NULL,
    `max_speed_kph` SMALLINT UNSIGNED NULL,
    `color_id` INTEGER UNSIGNED NULL,
    `color_finish` ENUM('solid', 'metallic', 'pearl', 'matte') NULL,
    `inspection_valid_until` DATE NULL,
    `has_service_book` BOOLEAN NOT NULL DEFAULT false,
    `has_warranty` BOOLEAN NOT NULL DEFAULT false,
    `warranty_description` VARCHAR(255) NULL,
    `is_crash_damaged` BOOLEAN NOT NULL DEFAULT false,
    `parts_sold_separately` BOOLEAN NOT NULL DEFAULT false,
    `parts_info` TEXT NULL,
    `registered_as_commercial` BOOLEAN NOT NULL DEFAULT false,
    `location_id` INTEGER UNSIGNED NULL,
    `imported_from_country_id` INTEGER UNSIGNED NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discount_price` DECIMAL(10, 2) NULL,
    `export_price` DECIMAL(10, 2) NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'EUR',
    `price_includes_vat` BOOLEAN NOT NULL DEFAULT false,
    `price_includes_reg_fee` BOOLEAN NOT NULL DEFAULT false,
    `est_monthly_loan` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    `est_monthly_insurance` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    `est_monthly_maintenance` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('draft', 'active', 'sold', 'expired') NOT NULL DEFAULT 'draft',
    `views_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_status_price`(`status`, `price`),
    INDEX `idx_search_filters`(`make_id`, `model_id`, `year_manufactured`, `price`),
    INDEX `idx_fuel_trans`(`fuel_type_id`, `transmission_id`),
    INDEX `idx_body`(`body_type_id`, `category_id`),
    INDEX `idx_location`(`location_id`),
    INDEX `idx_dealer_listings`(`dealer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_listing_translations` (
    `listing_id` BIGINT UNSIGNED NOT NULL,
    `language_code` CHAR(2) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`listing_id`, `language_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_listing_features` (
    `listing_id` BIGINT UNSIGNED NOT NULL,
    `feature_id` INTEGER UNSIGNED NOT NULL,
    `extra_info` VARCHAR(255) NULL,

    PRIMARY KEY (`listing_id`, `feature_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `listing_id` BIGINT UNSIGNED NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `is_main` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_listing_images`(`listing_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `premium_features` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `technical_name` VARCHAR(50) NOT NULL,
    `price_per_day` DECIMAL(6, 2) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `premium_features_technical_name_key`(`technical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_listing_premium_features` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `listing_id` BIGINT UNSIGNED NOT NULL,
    `feature_id` INTEGER UNSIGNED NOT NULL,
    `activated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `idx_active_listing_features`(`listing_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature_orders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'EUR',
    `status` ENUM('pending', 'paid', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_user_orders`(`user_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature_order_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `listing_id` BIGINT UNSIGNED NOT NULL,
    `feature_id` INTEGER UNSIGNED NOT NULL,
    `days_purchased` INTEGER UNSIGNED NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `gateway` ENUM('montonio', 'everypay', 'maksekeskus', 'stripe') NOT NULL,
    `gateway_transaction_id` VARCHAR(255) NOT NULL,
    `payment_method` VARCHAR(50) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'EUR',
    `status` ENUM('initiated', 'authorized', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'initiated',
    `request_payload` JSON NULL,
    `callback_payload` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transactions_gateway_transaction_id_key`(`gateway_transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `failed_login_attempts` INTEGER NOT NULL DEFAULT 0,
    `lock_until` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_codes` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_login_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `ip_address` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `user_agent` TEXT NULL,
    `trusted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_user_login_history_user`(`user_id`),
    INDEX `idx_user_login_history_ip`(`ip_address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `body_types` ADD CONSTRAINT `body_types_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `vehicle_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_models` ADD CONSTRAINT `car_models_make_id_fkey` FOREIGN KEY (`make_id`) REFERENCES `car_makes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `model_periods` ADD CONSTRAINT `model_periods_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `car_models`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_features` ADD CONSTRAINT `car_features_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `feature_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `dealer_categories` ADD CONSTRAINT `dealer_categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `dealer_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_category_links` ADD CONSTRAINT `dealer_category_links_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_category_links` ADD CONSTRAINT `dealer_category_links_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `dealer_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_make_links` ADD CONSTRAINT `dealer_make_links_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_make_links` ADD CONSTRAINT `dealer_make_links_make_id_fkey` FOREIGN KEY (`make_id`) REFERENCES `car_makes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_make_id_fkey` FOREIGN KEY (`make_id`) REFERENCES `car_makes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `car_models`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_model_period_id_fkey` FOREIGN KEY (`model_period_id`) REFERENCES `model_periods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `vehicle_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_body_type_id_fkey` FOREIGN KEY (`body_type_id`) REFERENCES `body_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_fuel_type_id_fkey` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_transmission_id_fkey` FOREIGN KEY (`transmission_id`) REFERENCES `transmissions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_drive_type_id_fkey` FOREIGN KEY (`drive_type_id`) REFERENCES `drive_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_emission_standard_id_fkey` FOREIGN KEY (`emission_standard_id`) REFERENCES `emission_standards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_imported_from_country_id_fkey` FOREIGN KEY (`imported_from_country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listings` ADD CONSTRAINT `car_listings_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listing_translations` ADD CONSTRAINT `car_listing_translations_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listing_features` ADD CONSTRAINT `car_listing_features_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listing_features` ADD CONSTRAINT `car_listing_features_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `car_features`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_images` ADD CONSTRAINT `car_images_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listing_premium_features` ADD CONSTRAINT `car_listing_premium_features_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_listing_premium_features` ADD CONSTRAINT `car_listing_premium_features_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `premium_features`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_order_items` ADD CONSTRAINT `feature_order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `feature_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_order_items` ADD CONSTRAINT `feature_order_items_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_order_items` ADD CONSTRAINT `feature_order_items_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `premium_features`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `feature_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
