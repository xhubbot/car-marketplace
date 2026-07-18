-- Temporary test data for autodpro.car_listings
-- Import this directly in phpMyAdmin (select the `autodpro` database, then
-- Import tab -> choose this file -> Go) to exercise /classified/search in
-- both Sticker Price and Ownership Cost modes.
--
-- make_id / model_id / fuel_type_id / transmission_id / color_id all
-- reference rows already created by `npx prisma db seed`.
-- est_monthly_loan / est_monthly_insurance / est_monthly_maintenance are
-- pre-computed by hand using the same formulas as lib/costAssumptions.ts,
-- against the seeded finance_assumptions defaults (60mo term, 7.5% APR, 10%
-- down, 4.5% annual insurance, 30 base + 8/age-year maintenance) so the
-- Ownership Cost search returns realistic, varied totals (~€440-€1,960/mo
-- at the default 1500 km/month) without needing the app running.
--
-- Safe to delete afterwards with:
--   DELETE FROM car_listings WHERE reg_nr LIKE 'TEST-%';

INSERT INTO `car_listings`
  (`user_id`, `make_id`, `model_id`, `model_trim`, `reg_nr`, `year_manufactured`, `mileage`,
   `fuel_type_id`, `transmission_id`, `fuel_consumption_mixed`, `color_id`,
   `price`, `currency`, `est_monthly_loan`, `est_monthly_insurance`, `est_monthly_maintenance`,
   `status`, `created_at`, `updated_at`)
VALUES
  -- Toyota Corolla 1.6 — cheap, old, thirsty petrol (~€450/mo ownership)
  (1, 531, 54,   NULL,               'TEST-001', 2010, 220000, 1, 1, 6.5,  3, 6000.00,  'EUR', 108.29,  22.50, 158.00, 'active', NOW(), NOW()),

  -- VW Golf 2.0 TDI — mid-age diesel hatchback (~€488/mo)
  (1, 563, 2,    NULL,               'TEST-002', 2016, 120000, 2, 1, 5.0,  1, 12000.00, 'EUR', 216.57,  45.00, 110.00, 'active', NOW(), NOW()),

  -- Skoda Octavia 1.5 TSI — popular family petrol (~€613/mo)
  (1, 478, 177,  NULL,               'TEST-003', 2018, 95000,  1, 1, 6.0,  6, 17000.00, 'EUR', 306.81,  63.75,  94.00, 'active', NOW(), NOW()),

  -- Nissan LEAF — budget EV, cheap to fuel (~€437/mo)
  (1, 378, 2024, NULL,               'TEST-004', 2019, 60000,  3, 2, 17.0, 2, 14000.00, 'EUR', 252.67,  52.50,  86.00, 'active', NOW(), NOW()),

  -- BMW 320d — mid-range diesel saloon (~€693/mo)
  (1, 55,  1173, '320d',             'TEST-005', 2019, 70000,  2, 2, 5.5,  2, 22000.00, 'EUR', 397.05,  82.50,  86.00, 'active', NOW(), NOW()),

  -- Mercedes-Benz C 220d — mid-range diesel exec (~€875/mo)
  (1, 343, 1228, 'AMG Line',         'TEST-006', 2020, 55000,  2, 2, 5.2,  1, 31000.00, 'EUR', 559.48, 116.25,  78.00, 'active', NOW(), NOW()),

  -- Toyota RAV4 Hybrid — newer hybrid SUV (~€804/mo)
  (1, 531, 82,   'Hybrid Dynamic',   'TEST-007', 2021, 40000,  4, 2, 5.0,  4, 28000.00, 'EUR', 505.34, 105.00,  70.00, 'active', NOW(), NOW()),

  -- Tesla Model 3 Long Range — newer EV (~€865/mo)
  (1, 526, 2466, 'Long Range',       'TEST-008', 2022, 20000,  3, 2, 15.0, 2, 35000.00, 'EUR', 631.67, 131.25,  62.00, 'active', NOW(), NOW()),

  -- Audi A6 45 TDI — premium diesel exec (~€1,182/mo)
  (1, 33,  89,   '45 TDI quattro',   'TEST-009', 2022, 15000,  2, 2, 6.0,  5, 45000.00, 'EUR', 812.15, 168.75,  62.00, 'active', NOW(), NOW()),

  -- Porsche Taycan — premium EV, top of the range (~€1,964/mo)
  (1, 410, 5291, '4S',               'TEST-010', 2023, 8000,   3, 2, 21.0, 9, 85000.00, 'EUR', 1534.06, 318.75, 54.00, 'active', NOW(), NOW());
