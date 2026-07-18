-- CreateTable
CREATE TABLE `fuel_price_assumptions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `fuel_type_id` INTEGER UNSIGNED NOT NULL,
    `price_per_unit` DECIMAL(6, 3) NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'EUR',
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fuel_price_assumptions_fuel_type_id_key`(`fuel_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_assumptions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `loan_term_months` SMALLINT UNSIGNED NOT NULL DEFAULT 60,
    `annual_interest_pct` DECIMAL(5, 2) NOT NULL DEFAULT 7.50,
    `down_payment_pct` DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
    `insurance_annual_pct_of_price` DECIMAL(5, 2) NOT NULL DEFAULT 4.50,
    `maintenance_base_monthly` DECIMAL(6, 2) NOT NULL DEFAULT 30.00,
    `maintenance_per_age_year_monthly` DECIMAL(6, 2) NOT NULL DEFAULT 8.00,
    `default_monthly_mileage_km` SMALLINT UNSIGNED NOT NULL DEFAULT 1500,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fuel_price_assumptions` ADD CONSTRAINT `fuel_price_assumptions_fuel_type_id_fkey` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
