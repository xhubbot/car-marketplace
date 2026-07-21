-- Temporary test data for autodpro: 100 varied car_listings, 3 loan
-- providers, 3 insurance providers, and per-make repair cost estimates.
-- Import this directly in phpMyAdmin (select the `autodpro` database, then
-- Import tab -> choose this file -> Go) to exercise /search in both Sticker
-- Price and Ownership Cost modes, and every filter (make, model, fuel type,
-- transmission, year, price, ownership cost range) with realistic variety.
--
-- make_id / model_id / fuel_type_id / transmission_id / color_id all
-- reference rows already created by `npx prisma db seed`. Loan/insurance
-- provider id=1 ("Standard Bank Loan" / "Standard Insurance") also comes from
-- that seed — this file adds 2 more of each (ids 2 and 3) so there are 3
-- total, matching what the details-page provider dropdowns expect.
--
-- car_ownership_costs rows use the DEFAULT provider combo (id=1/id=1, 60mo
-- term) and are computed by hand using the exact formulas in
-- lib/ownershipFormulas.ts, so /search's Ownership Cost mode and the
-- listing details page show consistent, realistic numbers immediately —
-- without needing the app running to populate the cache first. Loan
-- payments vary properly with price; insurance is a flat rate per fuel type
-- (matches the real per-provider formula, not a % of price); repair cost is
-- a flat per-make average (also matches the real formula) — so ownership
-- cost varies mainly by price and make, same as the live app would show.
--
-- Safe to delete afterwards with:
--   DELETE FROM car_ownership_costs WHERE listing_id IN (SELECT id FROM car_listings WHERE reg_nr LIKE 'TEST-%');
--   DELETE FROM car_listings WHERE reg_nr LIKE 'TEST-%';
--   DELETE FROM loan_providers WHERE id IN (2, 3);
--   DELETE FROM insurance_providers WHERE id IN (2, 3);
--   DELETE FROM repair_cost_estimates WHERE model_id IS NULL AND make_id <> 531;

-- ── Extra loan providers (id=1 already seeded by prisma/seed.ts) ──
INSERT INTO `loan_providers`
  (`id`, `name`, `is_default`, `interest_rate_annual`, `min_term_months`, `max_term_months`, `min_downpayment_percent`, `active`, `created_at`, `updated_at`)
VALUES
  (2, 'EuroDrive Finance', false, 5.90, 24, 96, 15.00, true, NOW(), NOW()),
  (3, 'QuickWheels Credit', false, 9.90, 6, 60, 5.00, true, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ── Extra insurance providers (id=1 already seeded by prisma/seed.ts) ──
INSERT INTO `insurance_providers`
  (`id`, `name`, `is_default`, `base_rate_per_year`, `calculation_rules`, `active`, `created_at`, `updated_at`)
VALUES
  (2, 'NordicShield Insurance', false, 520.00, '{"multipliers": {"electric": 0.8, "hybrid_petrol": 0.9, "hybrid_diesel": 0.9, "phev_petrol": 0.9, "phev_diesel": 0.9}}', true, NOW(), NOW()),
  (3, 'SafeDrive Premium', false, 780.00, '{"multipliers": {"electric": 0.9, "hybrid_petrol": 1.0, "hybrid_diesel": 1.0, "phev_petrol": 1.0, "phev_diesel": 1.0}}', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ── Per-make repair cost estimates (Toyota already covered by prisma/seed.ts) ──
INSERT INTO `repair_cost_estimates` (`make_id`, `model_id`, `average_monthly_cost`, `created_at`, `updated_at`)
VALUES
  (563, NULL, 42.00, NOW(), NOW()),
  (478, NULL, 38.00, NOW(), NOW()),
  (378, NULL, 28.00, NOW(), NOW()),
  (55, NULL, 75.00, NOW(), NOW()),
  (343, NULL, 80.00, NOW(), NOW()),
  (526, NULL, 55.00, NOW(), NOW()),
  (33, NULL, 78.00, NOW(), NOW()),
  (410, NULL, 95.00, NOW(), NOW()),
  (104, NULL, 33.00, NOW(), NOW()),
  (114, NULL, 26.00, NOW(), NOW()),
  (165, NULL, 30.00, NOW(), NOW()),
  (176, NULL, 34.00, NOW(), NOW()),
  (216, NULL, 32.00, NOW(), NOW()),
  (227, NULL, 36.00, NOW(), NOW()),
  (267, NULL, 35.00, NOW(), NOW()),
  (291, NULL, 110.00, NOW(), NOW()),
  (299, NULL, 65.00, NOW(), NOW()),
  (334, NULL, 33.00, NOW(), NOW()),
  (348, NULL, 55.00, NOW(), NOW()),
  (393, NULL, 31.00, NOW(), NOW()),
  (402, NULL, 34.00, NOW(), NOW()),
  (424, NULL, 30.00, NOW(), NOW()),
  (468, NULL, 33.00, NOW(), NOW()),
  (499, NULL, 44.00, NOW(), NOW()),
  (564, NULL, 70.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE `average_monthly_cost` = VALUES(`average_monthly_cost`);

-- ── 100 test listings ──
INSERT INTO `car_listings`
  (`user_id`, `make_id`, `model_id`, `model_trim`, `reg_nr`, `year_manufactured`, `mileage`,
   `fuel_type_id`, `transmission_id`, `fuel_consumption_mixed`, `color_id`,
   `price`, `currency`, `status`, `created_at`, `updated_at`)
VALUES
  (1, 531, 54, NULL, 'TEST-001', 2016, 58667, 1, 1, 6.1, 11, 13672.19, 'EUR', 'active', NOW(), NOW()),
  (1, 563, 2, NULL, 'TEST-002', 2018, 36000, 2, 1, 5, 17, 15496.94, 'EUR', 'active', NOW(), NOW()),
  (1, 478, 177, NULL, 'TEST-003', 2016, 84333, 1, 2, 5.6, 4, 18948.85, 'EUR', 'active', NOW(), NOW()),
  (1, 378, 2024, NULL, 'TEST-004', 2020, 46667, 3, 2, 16.9, 1, 16106.21, 'EUR', 'active', NOW(), NOW()),
  (1, 55, 1173, NULL, 'TEST-005', 2022, 13333, 2, 2, 5.2, 1, 25069.51, 'EUR', 'active', NOW(), NOW()),
  (1, 343, 1228, NULL, 'TEST-006', 2017, 36667, 2, 2, 4.7, 7, 32103.85, 'EUR', 'active', NOW(), NOW()),
  (1, 531, 82, NULL, 'TEST-007', 2020, 53667, 4, 2, 4.8, 15, 26828.36, 'EUR', 'active', NOW(), NOW()),
  (1, 526, 2466, NULL, 'TEST-008', 2021, 16000, 3, 2, 15.3, 9, 25873.68, 'EUR', 'active', NOW(), NOW()),
  (1, 33, 89, NULL, 'TEST-009', 2019, 50667, 2, 2, 6.3, 4, 29818.74, 'EUR', 'active', NOW(), NOW()),
  (1, 410, 5291, NULL, 'TEST-010', 2024, 17000, 3, 2, 20.1, 4, 67146.65, 'EUR', 'active', NOW(), NOW()),
  (1, 104, 906, NULL, 'TEST-011', 2010, 107667, 1, 1, 6.7, 11, 10446.15, 'EUR', 'active', NOW(), NOW()),
  (1, 114, 1612, NULL, 'TEST-012', 2012, 120000, 1, 1, 5.4, 28, 7017.96, 'EUR', 'active', NOW(), NOW()),
  (1, 165, 16, NULL, 'TEST-013', 2009, 48000, 1, 1, 5.6, 7, 5482.45, 'EUR', 'active', NOW(), NOW()),
  (1, 176, 63, NULL, 'TEST-014', 2019, 24000, 1, 1, 6, 28, 13195.98, 'EUR', 'active', NOW(), NOW()),
  (1, 216, 158, NULL, 'TEST-015', 2019, 29333, 1, 2, 5.5, 17, 13723.48, 'EUR', 'active', NOW(), NOW()),
  (1, 227, 1016, NULL, 'TEST-016', 2023, 24000, 2, 2, 6.6, 6, 24825.68, 'EUR', 'active', NOW(), NOW()),
  (1, 267, 109, NULL, 'TEST-017', 2018, 54000, 1, 2, 6.7, 15, 16844.37, 'EUR', 'active', NOW(), NOW()),
  (1, 291, 105, NULL, 'TEST-018', 2019, 61333, 2, 2, 9.7, 28, 73228.59, 'EUR', 'active', NOW(), NOW()),
  (1, 299, 524, NULL, 'TEST-019', 2020, 39667, 4, 2, 6.2, 2, 35990.10, 'EUR', 'active', NOW(), NOW()),
  (1, 334, 258, NULL, 'TEST-020', 2015, 88000, 1, 1, 6.1, 2, 16047.75, 'EUR', 'active', NOW(), NOW()),
  (1, 348, 2029, NULL, 'TEST-021', 2021, 20000, 1, 2, 6.7, 2, 24645.70, 'EUR', 'active', NOW(), NOW()),
  (1, 378, 1006, NULL, 'TEST-022', 2020, 28000, 1, 1, 6.5, 2, 13541.48, 'EUR', 'active', NOW(), NOW()),
  (1, 393, 42, NULL, 'TEST-023', 2014, 47667, 1, 1, 5.8, 17, 10660.13, 'EUR', 'active', NOW(), NOW()),
  (1, 402, 1007, NULL, 'TEST-024', 2019, 40000, 2, 1, 4.4, 17, 7182.54, 'EUR', 'active', NOW(), NOW()),
  (1, 424, 187, NULL, 'TEST-025', 2011, 112000, 1, 1, 5.8, 17, 9264.48, 'EUR', 'active', NOW(), NOW()),
  (1, 468, 119, NULL, 'TEST-026', 2014, 78000, 1, 1, 5.4, 3, 11147.80, 'EUR', 'active', NOW(), NOW()),
  (1, 478, 176, NULL, 'TEST-027', 2021, 40000, 2, 2, 5.1, 4, 16789.40, 'EUR', 'active', NOW(), NOW()),
  (1, 499, 855, NULL, 'TEST-028', 2015, 44000, 1, 2, 8.2, 9, 27909.28, 'EUR', 'active', NOW(), NOW()),
  (1, 563, 4, NULL, 'TEST-029', 2016, 40333, 2, 2, 5, 4, 18292.53, 'EUR', 'active', NOW(), NOW()),
  (1, 564, 1376, NULL, 'TEST-030', 2021, 30000, 2, 2, 6, 6, 35722.74, 'EUR', 'active', NOW(), NOW()),
  (1, 531, 54, NULL, 'TEST-031', 2019, 34667, 1, 1, 6.6, 9, 10457.36, 'EUR', 'active', NOW(), NOW()),
  (1, 563, 2, NULL, 'TEST-032', 2018, 36000, 2, 1, 4.8, 4, 11904.39, 'EUR', 'active', NOW(), NOW()),
  (1, 478, 177, NULL, 'TEST-033', 2020, 25667, 1, 2, 5.8, 11, 12031.66, 'EUR', 'active', NOW(), NOW()),
  (1, 378, 2024, NULL, 'TEST-034', 2016, 47667, 3, 2, 16, 9, 10424.15, 'EUR', 'active', NOW(), NOW()),
  (1, 55, 1173, NULL, 'TEST-035', 2019, 37333, 2, 2, 5.8, 28, 27104.85, 'EUR', 'active', NOW(), NOW()),
  (1, 343, 1228, NULL, 'TEST-036', 2020, 23333, 2, 2, 5.6, 7, 33617.35, 'EUR', 'active', NOW(), NOW()),
  (1, 531, 82, NULL, 'TEST-037', 2024, 16000, 4, 2, 5.3, 9, 22052.34, 'EUR', 'active', NOW(), NOW()),
  (1, 526, 2466, NULL, 'TEST-038', 2020, 35000, 3, 2, 15, 28, 34276.26, 'EUR', 'active', NOW(), NOW()),
  (1, 33, 89, NULL, 'TEST-039', 2024, 23000, 2, 2, 5.5, 1, 42103.28, 'EUR', 'active', NOW(), NOW()),
  (1, 410, 5291, NULL, 'TEST-040', 2021, 34000, 3, 2, 23.1, 15, 83682.99, 'EUR', 'active', NOW(), NOW()),
  (1, 104, 906, NULL, 'TEST-041', 2018, 57000, 1, 1, 6.3, 17, 11695.81, 'EUR', 'active', NOW(), NOW()),
  (1, 114, 1612, NULL, 'TEST-042', 2015, 64000, 1, 1, 5.6, 11, 10148.66, 'EUR', 'active', NOW(), NOW()),
  (1, 165, 16, NULL, 'TEST-043', 2017, 63333, 1, 1, 5.1, 17, 5311.32, 'EUR', 'active', NOW(), NOW()),
  (1, 176, 63, NULL, 'TEST-044', 2014, 34667, 1, 1, 6.6, 11, 6855.02, 'EUR', 'active', NOW(), NOW()),
  (1, 216, 158, NULL, 'TEST-045', 2021, 46000, 1, 2, 5.6, 11, 13128.72, 'EUR', 'active', NOW(), NOW()),
  (1, 227, 1016, NULL, 'TEST-046', 2018, 30000, 2, 2, 6.4, 4, 12667.46, 'EUR', 'active', NOW(), NOW()),
  (1, 267, 109, NULL, 'TEST-047', 2020, 46667, 1, 2, 6.6, 15, 23903.57, 'EUR', 'active', NOW(), NOW()),
  (1, 291, 105, NULL, 'TEST-048', 2020, 39667, 2, 2, 8.9, 7, 59394.91, 'EUR', 'active', NOW(), NOW()),
  (1, 299, 524, NULL, 'TEST-049', 2019, 34667, 4, 2, 6, 2, 36305.07, 'EUR', 'active', NOW(), NOW()),
  (1, 334, 258, NULL, 'TEST-050', 2015, 68000, 1, 1, 6, 11, 12479.57, 'EUR', 'active', NOW(), NOW()),
  (1, 348, 2029, NULL, 'TEST-051', 2016, 29333, 1, 2, 5.8, 28, 13926.31, 'EUR', 'active', NOW(), NOW()),
  (1, 378, 1006, NULL, 'TEST-052', 2021, 30000, 1, 1, 6.7, 2, 14527.13, 'EUR', 'active', NOW(), NOW()),
  (1, 393, 42, NULL, 'TEST-053', 2011, 74667, 1, 1, 6.1, 11, 7067.39, 'EUR', 'active', NOW(), NOW()),
  (1, 402, 1007, NULL, 'TEST-054', 2012, 125000, 2, 1, 4.8, 11, 12750.98, 'EUR', 'active', NOW(), NOW()),
  (1, 424, 187, NULL, 'TEST-055', 2017, 73333, 1, 1, 4.9, 2, 8452.91, 'EUR', 'active', NOW(), NOW()),
  (1, 468, 119, NULL, 'TEST-056', 2013, 42000, 1, 1, 6.1, 11, 8996.36, 'EUR', 'active', NOW(), NOW()),
  (1, 478, 176, NULL, 'TEST-057', 2020, 58333, 2, 2, 5.1, 6, 13287.73, 'EUR', 'active', NOW(), NOW()),
  (1, 499, 855, NULL, 'TEST-058', 2017, 73333, 1, 2, 8.2, 3, 21513.43, 'EUR', 'active', NOW(), NOW()),
  (1, 563, 4, NULL, 'TEST-059', 2022, 20000, 2, 2, 5.5, 17, 17738.68, 'EUR', 'active', NOW(), NOW()),
  (1, 564, 1376, NULL, 'TEST-060', 2022, 30000, 2, 2, 6.2, 4, 38198.35, 'EUR', 'active', NOW(), NOW()),
  (1, 531, 54, NULL, 'TEST-061', 2018, 51000, 1, 1, 6.6, 9, 12185.49, 'EUR', 'active', NOW(), NOW()),
  (1, 563, 2, NULL, 'TEST-062', 2021, 50000, 2, 1, 5.1, 4, 17198.74, 'EUR', 'active', NOW(), NOW()),
  (1, 478, 177, NULL, 'TEST-063', 2020, 53667, 1, 2, 5.8, 17, 14642.18, 'EUR', 'active', NOW(), NOW()),
  (1, 378, 2024, NULL, 'TEST-064', 2023, 20000, 3, 2, 18.1, 7, 13396.47, 'EUR', 'active', NOW(), NOW()),
  (1, 55, 1173, NULL, 'TEST-065', 2020, 53667, 2, 2, 5.3, 2, 26755.83, 'EUR', 'active', NOW(), NOW()),
  (1, 343, 1228, NULL, 'TEST-066', 2023, 21333, 2, 2, 5.5, 9, 22946.91, 'EUR', 'active', NOW(), NOW()),
  (1, 531, 82, NULL, 'TEST-067', 2023, 26667, 4, 2, 5.4, 17, 22602.46, 'EUR', 'active', NOW(), NOW()),
  (1, 526, 2466, NULL, 'TEST-068', 2022, 26667, 3, 2, 16.2, 7, 26232.69, 'EUR', 'active', NOW(), NOW()),
  (1, 33, 89, NULL, 'TEST-069', 2022, 25000, 2, 2, 6.3, 9, 35184.00, 'EUR', 'active', NOW(), NOW()),
  (1, 410, 5291, NULL, 'TEST-070', 2023, 10667, 3, 2, 19.4, 2, 65865.72, 'EUR', 'active', NOW(), NOW()),
  (1, 104, 906, NULL, 'TEST-071', 2013, 102667, 1, 1, 5.7, 11, 11702.85, 'EUR', 'active', NOW(), NOW()),
  (1, 114, 1612, NULL, 'TEST-072', 2012, 60000, 1, 1, 6.2, 3, 8900.16, 'EUR', 'active', NOW(), NOW()),
  (1, 165, 16, NULL, 'TEST-073', 2014, 104000, 1, 1, 5.1, 4, 8384.77, 'EUR', 'active', NOW(), NOW()),
  (1, 176, 63, NULL, 'TEST-074', 2017, 40000, 1, 1, 6, 4, 10801.81, 'EUR', 'active', NOW(), NOW()),
  (1, 216, 158, NULL, 'TEST-075', 2019, 45333, 1, 2, 5.5, 9, 13369.14, 'EUR', 'active', NOW(), NOW()),
  (1, 227, 1016, NULL, 'TEST-076', 2022, 33333, 2, 2, 5.9, 2, 24860.61, 'EUR', 'active', NOW(), NOW()),
  (1, 267, 109, NULL, 'TEST-077', 2016, 51333, 1, 2, 7.7, 3, 15602.31, 'EUR', 'active', NOW(), NOW()),
  (1, 291, 105, NULL, 'TEST-078', 2020, 53667, 2, 2, 8.2, 11, 53788.88, 'EUR', 'active', NOW(), NOW()),
  (1, 299, 524, NULL, 'TEST-079', 2022, 36667, 4, 2, 6.3, 3, 38148.75, 'EUR', 'active', NOW(), NOW()),
  (1, 334, 258, NULL, 'TEST-080', 2017, 33333, 1, 1, 6, 15, 7824.92, 'EUR', 'active', NOW(), NOW()),
  (1, 348, 2029, NULL, 'TEST-081', 2021, 44000, 1, 2, 6, 28, 18415.88, 'EUR', 'active', NOW(), NOW()),
  (1, 378, 1006, NULL, 'TEST-082', 2015, 68000, 1, 1, 6.6, 3, 16420.81, 'EUR', 'active', NOW(), NOW()),
  (1, 393, 42, NULL, 'TEST-083', 2013, 46667, 1, 1, 6.1, 9, 10938.98, 'EUR', 'active', NOW(), NOW()),
  (1, 402, 1007, NULL, 'TEST-084', 2013, 112000, 2, 1, 4.1, 15, 10695.83, 'EUR', 'active', NOW(), NOW()),
  (1, 424, 187, NULL, 'TEST-085', 2021, 36000, 1, 1, 5.2, 1, 6629.59, 'EUR', 'active', NOW(), NOW()),
  (1, 468, 119, NULL, 'TEST-086', 2019, 56000, 1, 1, 5.8, 17, 8884.84, 'EUR', 'active', NOW(), NOW()),
  (1, 478, 176, NULL, 'TEST-087', 2017, 63333, 2, 2, 5.7, 3, 19597.69, 'EUR', 'active', NOW(), NOW()),
  (1, 499, 855, NULL, 'TEST-088', 2015, 40000, 1, 2, 7.5, 3, 27929.84, 'EUR', 'active', NOW(), NOW()),
  (1, 563, 4, NULL, 'TEST-089', 2019, 50667, 2, 2, 4.8, 11, 17298.95, 'EUR', 'active', NOW(), NOW()),
  (1, 564, 1376, NULL, 'TEST-090', 2024, 22000, 2, 2, 6.2, 3, 28926.03, 'EUR', 'active', NOW(), NOW()),
  (1, 531, 54, NULL, 'TEST-091', 2018, 48000, 1, 1, 6.5, 3, 10366.61, 'EUR', 'active', NOW(), NOW()),
  (1, 563, 2, NULL, 'TEST-092', 2014, 99667, 2, 1, 4.8, 6, 12363.21, 'EUR', 'active', NOW(), NOW()),
  (1, 478, 177, NULL, 'TEST-093', 2019, 21333, 1, 2, 6.5, 1, 17990.24, 'EUR', 'active', NOW(), NOW()),
  (1, 378, 2024, NULL, 'TEST-094', 2022, 31667, 3, 2, 17.3, 1, 18100.76, 'EUR', 'active', NOW(), NOW()),
  (1, 55, 1173, NULL, 'TEST-095', 2020, 37333, 2, 2, 5.4, 7, 23711.61, 'EUR', 'active', NOW(), NOW()),
  (1, 343, 1228, NULL, 'TEST-096', 2021, 16000, 2, 2, 5.4, 1, 30749.10, 'EUR', 'active', NOW(), NOW()),
  (1, 531, 82, NULL, 'TEST-097', 2020, 32667, 4, 2, 4.8, 28, 30160.81, 'EUR', 'active', NOW(), NOW()),
  (1, 526, 2466, NULL, 'TEST-098', 2022, 40000, 3, 2, 15.2, 1, 32856.05, 'EUR', 'active', NOW(), NOW()),
  (1, 33, 89, NULL, 'TEST-099', 2021, 30000, 2, 2, 5.5, 15, 35771.93, 'EUR', 'active', NOW(), NOW()),
  (1, 410, 5291, NULL, 'TEST-100', 2023, 24000, 3, 2, 20.9, 17, 93095.35, 'EUR', 'active', NOW(), NOW());

-- ── Default-combo ownership cost cache row per listing, looked up by reg_nr
-- (safe regardless of auto_increment gaps or how the import tool batches
-- statements) ──
INSERT INTO `car_ownership_costs`
  (`listing_id`, `loan_provider_id`, `insurance_provider_id`, `loan_term_months`,
   `monthly_loan_payment`, `monthly_insurance`, `monthly_fuel`, `monthly_repair`,
   `total_monthly_owning`, `updated_at`)
  SELECT id, 1, 1, 60, 246.57, 54.17, 150.97, 30.00, 330.73, NOW() FROM car_listings WHERE reg_nr = 'TEST-001'
UNION ALL
  SELECT id, 1, 1, 60, 279.47, 54.17, 116.25, 42.00, 375.64, NOW() FROM car_listings WHERE reg_nr = 'TEST-002'
UNION ALL
  SELECT id, 1, 1, 60, 341.73, 54.17, 138.60, 38.00, 433.89, NOW() FROM car_listings WHERE reg_nr = 'TEST-003'
UNION ALL
  SELECT id, 1, 1, 60, 290.46, 46.04, 45.63, 28.00, 364.50, NOW() FROM car_listings WHERE reg_nr = 'TEST-004'
UNION ALL
  SELECT id, 1, 1, 60, 452.11, 54.17, 120.90, 75.00, 581.27, NOW() FROM car_listings WHERE reg_nr = 'TEST-005'
UNION ALL
  SELECT id, 1, 1, 60, 578.97, 54.17, 109.28, 80.00, 713.13, NOW() FROM car_listings WHERE reg_nr = 'TEST-006'
UNION ALL
  SELECT id, 1, 1, 60, 483.83, 51.46, 118.80, 30.00, 565.29, NOW() FROM car_listings WHERE reg_nr = 'TEST-007'
UNION ALL
  SELECT id, 1, 1, 60, 466.61, 46.04, 41.31, 55.00, 567.65, NOW() FROM car_listings WHERE reg_nr = 'TEST-008'
UNION ALL
  SELECT id, 1, 1, 60, 537.76, 54.17, 146.47, 78.00, 669.92, NOW() FROM car_listings WHERE reg_nr = 'TEST-009'
UNION ALL
  SELECT id, 1, 1, 60, 1210.93, 46.04, 54.27, 95.00, 1351.97, NOW() FROM car_listings WHERE reg_nr = 'TEST-010'
UNION ALL
  SELECT id, 1, 1, 60, 188.39, 54.17, 165.82, 33.00, 275.55, NOW() FROM car_listings WHERE reg_nr = 'TEST-011'
UNION ALL
  SELECT id, 1, 1, 60, 126.56, 54.17, 133.65, 26.00, 206.73, NOW() FROM car_listings WHERE reg_nr = 'TEST-012'
UNION ALL
  SELECT id, 1, 1, 60, 98.87, 54.17, 138.60, 30.00, 183.04, NOW() FROM car_listings WHERE reg_nr = 'TEST-013'
UNION ALL
  SELECT id, 1, 1, 60, 237.98, 54.17, 148.50, 34.00, 326.14, NOW() FROM car_listings WHERE reg_nr = 'TEST-014'
UNION ALL
  SELECT id, 1, 1, 60, 247.49, 54.17, 136.13, 32.00, 333.66, NOW() FROM car_listings WHERE reg_nr = 'TEST-015'
UNION ALL
  SELECT id, 1, 1, 60, 447.71, 54.17, 153.45, 36.00, 537.88, NOW() FROM car_listings WHERE reg_nr = 'TEST-016'
UNION ALL
  SELECT id, 1, 1, 60, 303.77, 54.17, 165.82, 35.00, 392.94, NOW() FROM car_listings WHERE reg_nr = 'TEST-017'
UNION ALL
  SELECT id, 1, 1, 60, 1320.62, 54.17, 225.52, 110.00, 1484.78, NOW() FROM car_listings WHERE reg_nr = 'TEST-018'
UNION ALL
  SELECT id, 1, 1, 60, 649.05, 51.46, 153.45, 65.00, 765.51, NOW() FROM car_listings WHERE reg_nr = 'TEST-019'
UNION ALL
  SELECT id, 1, 1, 60, 289.41, 54.17, 150.97, 33.00, 376.57, NOW() FROM car_listings WHERE reg_nr = 'TEST-020'
UNION ALL
  SELECT id, 1, 1, 60, 444.46, 54.17, 165.82, 55.00, 553.63, NOW() FROM car_listings WHERE reg_nr = 'TEST-021'
UNION ALL
  SELECT id, 1, 1, 60, 244.21, 54.17, 160.88, 36.00, 334.38, NOW() FROM car_listings WHERE reg_nr = 'TEST-022'
UNION ALL
  SELECT id, 1, 1, 60, 192.25, 54.17, 143.55, 31.00, 277.41, NOW() FROM car_listings WHERE reg_nr = 'TEST-023'
UNION ALL
  SELECT id, 1, 1, 60, 129.53, 54.17, 102.30, 34.00, 217.70, NOW() FROM car_listings WHERE reg_nr = 'TEST-024'
UNION ALL
  SELECT id, 1, 1, 60, 167.08, 54.17, 143.55, 30.00, 251.24, NOW() FROM car_listings WHERE reg_nr = 'TEST-025'
UNION ALL
  SELECT id, 1, 1, 60, 201.04, 54.17, 133.65, 33.00, 288.21, NOW() FROM car_listings WHERE reg_nr = 'TEST-026'
UNION ALL
  SELECT id, 1, 1, 60, 302.78, 54.17, 118.58, 40.00, 396.95, NOW() FROM car_listings WHERE reg_nr = 'TEST-027'
UNION ALL
  SELECT id, 1, 1, 60, 503.32, 54.17, 202.95, 44.00, 601.49, NOW() FROM car_listings WHERE reg_nr = 'TEST-028'
UNION ALL
  SELECT id, 1, 1, 60, 329.89, 54.17, 116.25, 43.00, 427.06, NOW() FROM car_listings WHERE reg_nr = 'TEST-029'
UNION ALL
  SELECT id, 1, 1, 60, 644.23, 54.17, 139.50, 70.00, 768.40, NOW() FROM car_listings WHERE reg_nr = 'TEST-030'
UNION ALL
  SELECT id, 1, 1, 60, 188.59, 54.17, 163.35, 30.00, 272.76, NOW() FROM car_listings WHERE reg_nr = 'TEST-031'
UNION ALL
  SELECT id, 1, 1, 60, 214.69, 54.17, 111.60, 42.00, 310.85, NOW() FROM car_listings WHERE reg_nr = 'TEST-032'
UNION ALL
  SELECT id, 1, 1, 60, 216.98, 54.17, 143.55, 38.00, 309.15, NOW() FROM car_listings WHERE reg_nr = 'TEST-033'
UNION ALL
  SELECT id, 1, 1, 60, 187.99, 46.04, 43.20, 28.00, 262.03, NOW() FROM car_listings WHERE reg_nr = 'TEST-034'
UNION ALL
  SELECT id, 1, 1, 60, 488.81, 54.17, 134.85, 75.00, 617.98, NOW() FROM car_listings WHERE reg_nr = 'TEST-035'
UNION ALL
  SELECT id, 1, 1, 60, 606.26, 54.17, 130.20, 80.00, 740.43, NOW() FROM car_listings WHERE reg_nr = 'TEST-036'
UNION ALL
  SELECT id, 1, 1, 60, 397.70, 51.46, 131.17, 30.00, 479.15, NOW() FROM car_listings WHERE reg_nr = 'TEST-037'
UNION ALL
  SELECT id, 1, 1, 60, 618.14, 46.04, 40.50, 55.00, 719.19, NOW() FROM car_listings WHERE reg_nr = 'TEST-038'
UNION ALL
  SELECT id, 1, 1, 60, 759.30, 54.17, 127.88, 78.00, 891.46, NOW() FROM car_listings WHERE reg_nr = 'TEST-039'
UNION ALL
  SELECT id, 1, 1, 60, 1509.15, 46.04, 62.37, 95.00, 1650.19, NOW() FROM car_listings WHERE reg_nr = 'TEST-040'
UNION ALL
  SELECT id, 1, 1, 60, 210.92, 54.17, 155.92, 33.00, 298.09, NOW() FROM car_listings WHERE reg_nr = 'TEST-041'
UNION ALL
  SELECT id, 1, 1, 60, 183.02, 54.17, 138.60, 26.00, 263.19, NOW() FROM car_listings WHERE reg_nr = 'TEST-042'
UNION ALL
  SELECT id, 1, 1, 60, 95.79, 54.17, 126.22, 30.00, 179.95, NOW() FROM car_listings WHERE reg_nr = 'TEST-043'
UNION ALL
  SELECT id, 1, 1, 60, 123.62, 54.17, 163.35, 34.00, 211.79, NOW() FROM car_listings WHERE reg_nr = 'TEST-044'
UNION ALL
  SELECT id, 1, 1, 60, 236.77, 54.17, 138.60, 32.00, 322.93, NOW() FROM car_listings WHERE reg_nr = 'TEST-045'
UNION ALL
  SELECT id, 1, 1, 60, 228.45, 54.17, 148.80, 36.00, 318.61, NOW() FROM car_listings WHERE reg_nr = 'TEST-046'
UNION ALL
  SELECT id, 1, 1, 60, 431.08, 54.17, 163.35, 35.00, 520.25, NOW() FROM car_listings WHERE reg_nr = 'TEST-047'
UNION ALL
  SELECT id, 1, 1, 60, 1071.14, 54.17, 206.93, 110.00, 1235.30, NOW() FROM car_listings WHERE reg_nr = 'TEST-048'
UNION ALL
  SELECT id, 1, 1, 60, 654.73, 51.46, 148.50, 65.00, 771.19, NOW() FROM car_listings WHERE reg_nr = 'TEST-049'
UNION ALL
  SELECT id, 1, 1, 60, 225.06, 54.17, 148.50, 33.00, 312.23, NOW() FROM car_listings WHERE reg_nr = 'TEST-050'
UNION ALL
  SELECT id, 1, 1, 60, 251.15, 54.17, 143.55, 55.00, 360.32, NOW() FROM car_listings WHERE reg_nr = 'TEST-051'
UNION ALL
  SELECT id, 1, 1, 60, 261.98, 54.17, 165.82, 36.00, 352.15, NOW() FROM car_listings WHERE reg_nr = 'TEST-052'
UNION ALL
  SELECT id, 1, 1, 60, 127.45, 54.17, 150.97, 31.00, 212.62, NOW() FROM car_listings WHERE reg_nr = 'TEST-053'
UNION ALL
  SELECT id, 1, 1, 60, 229.95, 54.17, 111.60, 34.00, 318.12, NOW() FROM car_listings WHERE reg_nr = 'TEST-054'
UNION ALL
  SELECT id, 1, 1, 60, 152.44, 54.17, 121.27, 30.00, 236.61, NOW() FROM car_listings WHERE reg_nr = 'TEST-055'
UNION ALL
  SELECT id, 1, 1, 60, 162.24, 54.17, 150.97, 33.00, 249.41, NOW() FROM car_listings WHERE reg_nr = 'TEST-056'
UNION ALL
  SELECT id, 1, 1, 60, 239.63, 54.17, 118.58, 40.00, 333.80, NOW() FROM car_listings WHERE reg_nr = 'TEST-057'
UNION ALL
  SELECT id, 1, 1, 60, 387.98, 54.17, 202.95, 44.00, 486.14, NOW() FROM car_listings WHERE reg_nr = 'TEST-058'
UNION ALL
  SELECT id, 1, 1, 60, 319.90, 54.17, 127.88, 43.00, 417.07, NOW() FROM car_listings WHERE reg_nr = 'TEST-059'
UNION ALL
  SELECT id, 1, 1, 60, 688.87, 54.17, 144.15, 70.00, 813.04, NOW() FROM car_listings WHERE reg_nr = 'TEST-060'
UNION ALL
  SELECT id, 1, 1, 60, 219.76, 54.17, 163.35, 30.00, 303.92, NOW() FROM car_listings WHERE reg_nr = 'TEST-061'
UNION ALL
  SELECT id, 1, 1, 60, 310.16, 54.17, 118.58, 42.00, 406.33, NOW() FROM car_listings WHERE reg_nr = 'TEST-062'
UNION ALL
  SELECT id, 1, 1, 60, 264.06, 54.17, 143.55, 38.00, 356.23, NOW() FROM car_listings WHERE reg_nr = 'TEST-063'
UNION ALL
  SELECT id, 1, 1, 60, 241.59, 46.04, 48.87, 28.00, 315.64, NOW() FROM car_listings WHERE reg_nr = 'TEST-064'
UNION ALL
  SELECT id, 1, 1, 60, 482.52, 54.17, 123.23, 75.00, 611.69, NOW() FROM car_listings WHERE reg_nr = 'TEST-065'
UNION ALL
  SELECT id, 1, 1, 60, 413.83, 54.17, 127.88, 80.00, 547.99, NOW() FROM car_listings WHERE reg_nr = 'TEST-066'
UNION ALL
  SELECT id, 1, 1, 60, 407.62, 51.46, 133.65, 30.00, 489.07, NOW() FROM car_listings WHERE reg_nr = 'TEST-067'
UNION ALL
  SELECT id, 1, 1, 60, 473.08, 46.04, 43.74, 55.00, 574.13, NOW() FROM car_listings WHERE reg_nr = 'TEST-068'
UNION ALL
  SELECT id, 1, 1, 60, 634.51, 54.17, 146.47, 78.00, 766.68, NOW() FROM car_listings WHERE reg_nr = 'TEST-069'
UNION ALL
  SELECT id, 1, 1, 60, 1187.83, 46.04, 52.38, 95.00, 1328.87, NOW() FROM car_listings WHERE reg_nr = 'TEST-070'
UNION ALL
  SELECT id, 1, 1, 60, 211.05, 54.17, 141.07, 33.00, 298.22, NOW() FROM car_listings WHERE reg_nr = 'TEST-071'
UNION ALL
  SELECT id, 1, 1, 60, 160.51, 54.17, 153.45, 26.00, 240.67, NOW() FROM car_listings WHERE reg_nr = 'TEST-072'
UNION ALL
  SELECT id, 1, 1, 60, 151.21, 54.17, 126.22, 30.00, 235.38, NOW() FROM car_listings WHERE reg_nr = 'TEST-073'
UNION ALL
  SELECT id, 1, 1, 60, 194.80, 54.17, 148.50, 34.00, 282.97, NOW() FROM car_listings WHERE reg_nr = 'TEST-074'
UNION ALL
  SELECT id, 1, 1, 60, 241.10, 54.17, 136.13, 32.00, 327.27, NOW() FROM car_listings WHERE reg_nr = 'TEST-075'
UNION ALL
  SELECT id, 1, 1, 60, 448.34, 54.17, 137.18, 36.00, 538.51, NOW() FROM car_listings WHERE reg_nr = 'TEST-076'
UNION ALL
  SELECT id, 1, 1, 60, 281.37, 54.17, 190.57, 35.00, 370.54, NOW() FROM car_listings WHERE reg_nr = 'TEST-077'
UNION ALL
  SELECT id, 1, 1, 60, 970.04, 54.17, 190.65, 110.00, 1134.20, NOW() FROM car_listings WHERE reg_nr = 'TEST-078'
UNION ALL
  SELECT id, 1, 1, 60, 687.98, 51.46, 155.92, 65.00, 804.44, NOW() FROM car_listings WHERE reg_nr = 'TEST-079'
UNION ALL
  SELECT id, 1, 1, 60, 141.12, 54.17, 148.50, 33.00, 228.28, NOW() FROM car_listings WHERE reg_nr = 'TEST-080'
UNION ALL
  SELECT id, 1, 1, 60, 332.11, 54.17, 148.50, 55.00, 441.28, NOW() FROM car_listings WHERE reg_nr = 'TEST-081'
UNION ALL
  SELECT id, 1, 1, 60, 296.14, 54.17, 163.35, 36.00, 386.30, NOW() FROM car_listings WHERE reg_nr = 'TEST-082'
UNION ALL
  SELECT id, 1, 1, 60, 197.28, 54.17, 150.97, 31.00, 282.44, NOW() FROM car_listings WHERE reg_nr = 'TEST-083'
UNION ALL
  SELECT id, 1, 1, 60, 192.89, 54.17, 95.32, 34.00, 281.06, NOW() FROM car_listings WHERE reg_nr = 'TEST-084'
UNION ALL
  SELECT id, 1, 1, 60, 119.56, 54.17, 128.70, 30.00, 203.73, NOW() FROM car_listings WHERE reg_nr = 'TEST-085'
UNION ALL
  SELECT id, 1, 1, 60, 160.23, 54.17, 143.55, 33.00, 247.40, NOW() FROM car_listings WHERE reg_nr = 'TEST-086'
UNION ALL
  SELECT id, 1, 1, 60, 353.43, 54.17, 132.53, 40.00, 447.59, NOW() FROM car_listings WHERE reg_nr = 'TEST-087'
UNION ALL
  SELECT id, 1, 1, 60, 503.69, 54.17, 185.63, 44.00, 601.86, NOW() FROM car_listings WHERE reg_nr = 'TEST-088'
UNION ALL
  SELECT id, 1, 1, 60, 311.97, 54.17, 111.60, 43.00, 409.14, NOW() FROM car_listings WHERE reg_nr = 'TEST-089'
UNION ALL
  SELECT id, 1, 1, 60, 521.66, 54.17, 144.15, 70.00, 645.82, NOW() FROM car_listings WHERE reg_nr = 'TEST-090'
UNION ALL
  SELECT id, 1, 1, 60, 186.95, 54.17, 160.88, 30.00, 271.12, NOW() FROM car_listings WHERE reg_nr = 'TEST-091'
UNION ALL
  SELECT id, 1, 1, 60, 222.96, 54.17, 111.60, 42.00, 319.13, NOW() FROM car_listings WHERE reg_nr = 'TEST-092'
UNION ALL
  SELECT id, 1, 1, 60, 324.44, 54.17, 160.88, 38.00, 416.61, NOW() FROM car_listings WHERE reg_nr = 'TEST-093'
UNION ALL
  SELECT id, 1, 1, 60, 326.43, 46.04, 46.71, 28.00, 400.47, NOW() FROM car_listings WHERE reg_nr = 'TEST-094'
UNION ALL
  SELECT id, 1, 1, 60, 427.62, 54.17, 125.55, 75.00, 556.79, NOW() FROM car_listings WHERE reg_nr = 'TEST-095'
UNION ALL
  SELECT id, 1, 1, 60, 554.53, 54.17, 125.55, 80.00, 688.70, NOW() FROM car_listings WHERE reg_nr = 'TEST-096'
UNION ALL
  SELECT id, 1, 1, 60, 543.92, 51.46, 118.80, 30.00, 625.38, NOW() FROM car_listings WHERE reg_nr = 'TEST-097'
UNION ALL
  SELECT id, 1, 1, 60, 592.53, 46.04, 41.04, 55.00, 693.57, NOW() FROM car_listings WHERE reg_nr = 'TEST-098'
UNION ALL
  SELECT id, 1, 1, 60, 645.12, 54.17, 127.88, 78.00, 777.28, NOW() FROM car_listings WHERE reg_nr = 'TEST-099'
UNION ALL
  SELECT id, 1, 1, 60, 1678.90, 46.04, 56.43, 95.00, 1819.94, NOW() FROM car_listings WHERE reg_nr = 'TEST-100';
