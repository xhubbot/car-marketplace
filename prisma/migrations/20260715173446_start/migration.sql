-- DropForeignKey
ALTER TABLE `car_listing_premium_features` DROP FOREIGN KEY `car_listing_premium_features_feature_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_body_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_color_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_drive_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_emission_standard_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_fuel_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_imported_from_country_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_location_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_make_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_model_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_model_period_id_fkey`;

-- DropForeignKey
ALTER TABLE `car_listings` DROP FOREIGN KEY `car_listings_transmission_id_fkey`;

-- DropForeignKey
ALTER TABLE `feature_order_items` DROP FOREIGN KEY `feature_order_items_feature_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_transactions` DROP FOREIGN KEY `payment_transactions_order_id_fkey`;

-- DropIndex
DROP INDEX `car_listing_premium_features_feature_id_fkey` ON `car_listing_premium_features`;

-- DropIndex
DROP INDEX `car_listings_category_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `car_listings_color_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `car_listings_drive_type_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `car_listings_emission_standard_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `car_listings_imported_from_country_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `car_listings_model_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `car_listings_model_period_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `car_listings_transmission_id_fkey` ON `car_listings`;

-- DropIndex
DROP INDEX `feature_order_items_feature_id_fkey` ON `feature_order_items`;

-- DropIndex
DROP INDEX `payment_transactions_order_id_fkey` ON `payment_transactions`;

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
ALTER TABLE `car_listing_premium_features` ADD CONSTRAINT `car_listing_premium_features_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `premium_features`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_order_items` ADD CONSTRAINT `feature_order_items_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `premium_features`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `feature_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `body_types` RENAME INDEX `unique_category_tech_name` TO `body_types_category_id_technical_name_key`;

-- RenameIndex
ALTER TABLE `car_models` RENAME INDEX `unique_make_model` TO `car_models_make_id_name_key`;

-- RenameIndex
ALTER TABLE `translations` RENAME INDEX `unique_translation` TO `translations_category_ref_id_language_code_key`;
