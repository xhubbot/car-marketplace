-- CreateTable
-- fuel_price_assumptions / finance_assumptions never existed on this branch
-- (a pre-existing schema gap: the tables were modeled on `main` only). Created
-- here directly in their final form rather than migrated from a prior shape.
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
    `default_monthly_mileage_km` SMALLINT UNSIGNED NOT NULL DEFAULT 1500,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loan_providers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `interest_rate_annual` DECIMAL(5, 2) NOT NULL,
    `min_term_months` SMALLINT UNSIGNED NOT NULL,
    `max_term_months` SMALLINT UNSIGNED NOT NULL,
    `min_downpayment_percent` DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
    `calculation_rules` JSON NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `insurance_providers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `base_rate_per_year` DECIMAL(8, 2) NOT NULL,
    `calculation_rules` JSON NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_cost_estimates` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `make_id` INTEGER UNSIGNED NULL,
    `model_id` INTEGER UNSIGNED NULL,
    `average_monthly_cost` DECIMAL(8, 2) NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'EUR',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `unique_make_model_repair`(`make_id`, `model_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_ownership_costs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `listing_id` BIGINT UNSIGNED NOT NULL,
    `loan_provider_id` INTEGER UNSIGNED NOT NULL,
    `insurance_provider_id` INTEGER UNSIGNED NOT NULL,
    `loan_term_months` SMALLINT UNSIGNED NOT NULL,
    `monthly_loan_payment` DECIMAL(8, 2) NOT NULL,
    `monthly_insurance` DECIMAL(8, 2) NOT NULL,
    `monthly_fuel` DECIMAL(8, 2) NOT NULL,
    `monthly_repair` DECIMAL(8, 2) NOT NULL,
    `total_monthly_owning` DECIMAL(8, 2) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `unique_listing_provider_combo`(`listing_id`, `loan_provider_id`, `insurance_provider_id`, `loan_term_months`),
    INDEX `idx_listing_total_owning`(`listing_id`, `total_monthly_owning`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fuel_price_assumptions` ADD CONSTRAINT `fuel_price_assumptions_fuel_type_id_fkey` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `repair_cost_estimates` ADD CONSTRAINT `repair_cost_estimates_make_id_fkey` FOREIGN KEY (`make_id`) REFERENCES `car_makes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `repair_cost_estimates` ADD CONSTRAINT `repair_cost_estimates_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `car_models`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `car_ownership_costs` ADD CONSTRAINT `car_ownership_costs_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `car_listings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `car_ownership_costs` ADD CONSTRAINT `car_ownership_costs_loan_provider_id_fkey` FOREIGN KEY (`loan_provider_id`) REFERENCES `loan_providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `car_ownership_costs` ADD CONSTRAINT `car_ownership_costs_insurance_provider_id_fkey` FOREIGN KEY (`insurance_provider_id`) REFERENCES `insurance_providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed the singleton finance_assumptions row and the exactly-one default
-- loan/insurance provider directly here so the backfill below has concrete
-- FK ids within this same migration. prisma/seed.ts re-declares the same
-- id=1 rows with skipDuplicates so both paths converge on one row each — do
-- not change these ids without also updating seed.ts.
INSERT INTO `finance_assumptions` (`id`, `default_monthly_mileage_km`, `updated_at`)
VALUES (1, 1500, NOW(3));

INSERT INTO `loan_providers`
  (`id`, `name`, `is_default`, `interest_rate_annual`, `min_term_months`, `max_term_months`, `min_downpayment_percent`, `active`, `created_at`, `updated_at`)
VALUES
  (1, 'Standard Bank Loan', true, 7.50, 12, 84, 10.00, true, NOW(3), NOW(3));

INSERT INTO `insurance_providers`
  (`id`, `name`, `is_default`, `base_rate_per_year`, `active`, `created_at`, `updated_at`)
VALUES
  (1, 'Standard Insurance', true, 650.00, true, NOW(3), NOW(3));

-- Backfill: one car_ownership_costs row per existing listing (if any),
-- referencing the default providers above, mapping est_monthly_maintenance ->
-- monthly_repair, and computing monthly_fuel against default_monthly_mileage_km
-- + fuel_price_assumptions (empty at this point, so fuel is 0 until seeded —
-- same gap already accepted for fuel at listing-create time).
-- total_monthly_owning intentionally excludes fuel (see model comment in schema.prisma).
INSERT INTO `car_ownership_costs`
  (`listing_id`, `loan_provider_id`, `insurance_provider_id`, `loan_term_months`,
   `monthly_loan_payment`, `monthly_insurance`, `monthly_fuel`, `monthly_repair`,
   `total_monthly_owning`, `updated_at`)
SELECT
  c.id,
  1,
  1,
  60,
  c.est_monthly_loan,
  c.est_monthly_insurance,
  ROUND(COALESCE(c.fuel_consumption_mixed, 0) / 100 * 1500 * COALESCE(fpa.price_per_unit, 0), 2),
  c.est_monthly_maintenance,
  c.est_monthly_loan + c.est_monthly_insurance + c.est_monthly_maintenance,
  NOW(3)
FROM car_listings c
LEFT JOIN fuel_price_assumptions fpa ON fpa.fuel_type_id = c.fuel_type_id;
