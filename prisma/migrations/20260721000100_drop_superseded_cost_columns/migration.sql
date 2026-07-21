-- AlterTable: superseded by car_ownership_costs (backfilled in the prior migration).
ALTER TABLE `car_listings`
  DROP COLUMN `est_monthly_loan`,
  DROP COLUMN `est_monthly_insurance`,
  DROP COLUMN `est_monthly_maintenance`;
