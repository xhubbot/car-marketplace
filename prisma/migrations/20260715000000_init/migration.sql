-- CreateTable: translations
CREATE TABLE `translations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(50) NOT NULL,
  `ref_id` INT UNSIGNED NOT NULL,
  `language_code` CHAR(2) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_translation` (`category`, `ref_id`, `language_code`),
  KEY `idx_lookup` (`category`, `ref_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: fuel_types
CREATE TABLE `fuel_types` (
  `id` INT UNSIGNED NOT NULL,
  `technical_name` VARCHAR(50) NOT NULL,
  `is_electric` TINYINT(1) NOT NULL DEFAULT 0,
  `is_hybrid` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `fuel_types_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: transmissions
CREATE TABLE `transmissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `technical_name` VARCHAR(50) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `transmissions_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: drive_types
CREATE TABLE `drive_types` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `technical_name` VARCHAR(50) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `drive_types_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: colors
CREATE TABLE `colors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `technical_name` VARCHAR(50) NOT NULL,
  `hex_code` CHAR(7) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `colors_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: emission_standards
CREATE TABLE `emission_standards` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `technical_name` VARCHAR(20) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `emission_standards_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: vehicle_categories
CREATE TABLE `vehicle_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `technical_name` VARCHAR(50) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicle_categories_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: body_types
CREATE TABLE `body_types` (
  `id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `technical_name` VARCHAR(50) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_category_tech_name` (`category_id`, `technical_name`),
  CONSTRAINT `body_types_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `vehicle_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: countries
CREATE TABLE `countries` (
  `id` INT UNSIGNED NOT NULL,
  `iso2_code` CHAR(2) NULL,
  `fallback_name` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: locations
CREATE TABLE `locations` (
  `id` INT UNSIGNED NOT NULL,
  `parent_id` INT UNSIGNED NULL,
  `fallback_name` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `locations_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_makes
CREATE TABLE `car_makes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(50) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `car_makes_name_key` (`name`),
  UNIQUE KEY `car_makes_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_models
CREATE TABLE `car_models` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `make_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(50) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_make_model` (`make_id`, `name`),
  CONSTRAINT `car_models_make_id_fkey` FOREIGN KEY (`make_id`) REFERENCES `car_makes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: model_periods
CREATE TABLE `model_periods` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `model_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `year_from` SMALLINT UNSIGNED NULL,
  `year_to` SMALLINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `model_periods_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `car_models` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: feature_categories
CREATE TABLE `feature_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `technical_name` VARCHAR(50) NOT NULL,
  `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature_categories_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_features
CREATE TABLE `car_features` (
  `id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `technical_name` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `car_features_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `feature_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_listings
CREATE TABLE `car_listings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `make_id` INT UNSIGNED NOT NULL,
  `model_id` INT UNSIGNED NOT NULL,
  `model_period_id` INT UNSIGNED NULL,
  `model_trim` VARCHAR(100) NULL,
  `category_id` INT UNSIGNED NULL,
  `body_type_id` INT UNSIGNED NULL,
  `vin_code` VARCHAR(17) NULL,
  `reg_nr` VARCHAR(20) NULL,
  `year_manufactured` SMALLINT UNSIGNED NOT NULL,
  `month_manufactured` TINYINT UNSIGNED NULL,
  `mileage` INT UNSIGNED NOT NULL,
  `fuel_type_id` INT UNSIGNED NOT NULL,
  `transmission_id` INT UNSIGNED NULL,
  `drive_type_id` INT UNSIGNED NULL,
  `engine_displacement_cc` SMALLINT UNSIGNED NULL,
  `engine_power_kw` SMALLINT UNSIGNED NULL,
  `engine_power_hp` SMALLINT UNSIGNED NULL,
  `engine_info` VARCHAR(100) NULL,
  `emission_standard_id` INT UNSIGNED NULL,
  `co2_emission_gkm` SMALLINT UNSIGNED NULL,
  `fuel_consumption_city` DECIMAL(5,2) NULL,
  `fuel_consumption_highway` DECIMAL(5,2) NULL,
  `fuel_consumption_mixed` DECIMAL(5,2) NULL,
  `fuel_tank_capacity_l` SMALLINT UNSIGNED NULL,
  `doors` TINYINT UNSIGNED NULL,
  `seats` TINYINT UNSIGNED NULL,
  `vehicle_length_mm` INT UNSIGNED NULL,
  `vehicle_width_mm` INT UNSIGNED NULL,
  `vehicle_height_mm` INT UNSIGNED NULL,
  `wheelbase_mm` INT UNSIGNED NULL,
  `kerb_weight_kg` INT UNSIGNED NULL,
  `gross_weight_kg` INT UNSIGNED NULL,
  `payload_kg` INT UNSIGNED NULL,
  `tow_capacity_braked_kg` INT UNSIGNED NULL,
  `tow_capacity_unbraked_kg` INT UNSIGNED NULL,
  `acceleration_0_100` DECIMAL(4,1) NULL,
  `max_speed_kph` SMALLINT UNSIGNED NULL,
  `color_id` INT UNSIGNED NULL,
  `color_finish` ENUM('solid','metallic','pearl','matte') NULL,
  `inspection_valid_until` DATE NULL,
  `has_service_book` TINYINT(1) NOT NULL DEFAULT 0,
  `has_warranty` TINYINT(1) NOT NULL DEFAULT 0,
  `warranty_description` VARCHAR(255) NULL,
  `is_crash_damaged` TINYINT(1) NOT NULL DEFAULT 0,
  `parts_sold_separately` TINYINT(1) NOT NULL DEFAULT 0,
  `parts_info` TEXT NULL,
  `registered_as_commercial` TINYINT(1) NOT NULL DEFAULT 0,
  `location_id` INT UNSIGNED NULL,
  `imported_from_country_id` INT UNSIGNED NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `discount_price` DECIMAL(10,2) NULL,
  `export_price` DECIMAL(10,2) NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'EUR',
  `price_includes_vat` TINYINT(1) NOT NULL DEFAULT 0,
  `price_includes_reg_fee` TINYINT(1) NOT NULL DEFAULT 0,
  `est_monthly_loan` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  `est_monthly_insurance` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  `est_monthly_maintenance` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('draft','active','sold','expired') NOT NULL DEFAULT 'draft',
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status_price` (`status`, `price`),
  KEY `idx_search_filters` (`make_id`, `model_id`, `year_manufactured`, `price`),
  KEY `idx_fuel_trans` (`fuel_type_id`, `transmission_id`),
  KEY `idx_body` (`body_type_id`, `category_id`),
  KEY `idx_location` (`location_id`),
  CONSTRAINT `car_listings_make_id_fkey` FOREIGN KEY (`make_id`) REFERENCES `car_makes` (`id`),
  CONSTRAINT `car_listings_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `car_models` (`id`),
  CONSTRAINT `car_listings_model_period_id_fkey` FOREIGN KEY (`model_period_id`) REFERENCES `model_periods` (`id`),
  CONSTRAINT `car_listings_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `vehicle_categories` (`id`),
  CONSTRAINT `car_listings_body_type_id_fkey` FOREIGN KEY (`body_type_id`) REFERENCES `body_types` (`id`),
  CONSTRAINT `car_listings_fuel_type_id_fkey` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types` (`id`),
  CONSTRAINT `car_listings_transmission_id_fkey` FOREIGN KEY (`transmission_id`) REFERENCES `transmissions` (`id`),
  CONSTRAINT `car_listings_drive_type_id_fkey` FOREIGN KEY (`drive_type_id`) REFERENCES `drive_types` (`id`),
  CONSTRAINT `car_listings_emission_standard_id_fkey` FOREIGN KEY (`emission_standard_id`) REFERENCES `emission_standards` (`id`),
  CONSTRAINT `car_listings_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`),
  CONSTRAINT `car_listings_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  CONSTRAINT `car_listings_imported_from_country_id_fkey` FOREIGN KEY (`imported_from_country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_listing_translations
CREATE TABLE `car_listing_translations` (
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `language_code` CHAR(2) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`listing_id`, `language_code`),
  CONSTRAINT `car_listing_translations_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_listing_features
CREATE TABLE `car_listing_features` (
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `feature_id` INT UNSIGNED NOT NULL,
  `extra_info` VARCHAR(255) NULL,
  PRIMARY KEY (`listing_id`, `feature_id`),
  CONSTRAINT `car_listing_features_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `car_listing_features_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `car_features` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_images
CREATE TABLE `car_images` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `is_main` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_listing_images` (`listing_id`, `sort_order`),
  CONSTRAINT `car_images_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: premium_features
CREATE TABLE `premium_features` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `technical_name` VARCHAR(50) NOT NULL,
  `price_per_day` DECIMAL(6,2) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `premium_features_technical_name_key` (`technical_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: car_listing_premium_features
CREATE TABLE `car_listing_premium_features` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `feature_id` INT UNSIGNED NOT NULL,
  `activated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expires_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_active_listing_features` (`listing_id`),
  CONSTRAINT `car_listing_premium_features_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `car_listing_premium_features_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `premium_features` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: feature_orders
CREATE TABLE `feature_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'EUR',
  `status` ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_orders` (`user_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: feature_order_items
CREATE TABLE `feature_order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `feature_id` INT UNSIGNED NOT NULL,
  `days_purchased` INT UNSIGNED NOT NULL,
  `price` DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `feature_order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `feature_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `feature_order_items_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `feature_order_items_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `premium_features` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CreateTable: payment_transactions
CREATE TABLE `payment_transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `gateway` ENUM('montonio','everypay','maksekeskus','stripe') NOT NULL,
  `gateway_transaction_id` VARCHAR(255) NOT NULL,
  `payment_method` VARCHAR(50) NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'EUR',
  `status` ENUM('initiated','authorized','completed','failed','refunded') NOT NULL DEFAULT 'initiated',
  `request_payload` JSON NULL,
  `callback_payload` JSON NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_transactions_gateway_transaction_id_key` (`gateway_transaction_id`),
  CONSTRAINT `payment_transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `feature_orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
