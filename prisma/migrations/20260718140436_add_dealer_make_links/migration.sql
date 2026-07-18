-- CreateTable
CREATE TABLE `dealer_make_links` (
    `dealer_id` INTEGER UNSIGNED NOT NULL,
    `make_id` INTEGER UNSIGNED NOT NULL,

    INDEX `idx_dealer_make_links_make`(`make_id`),
    PRIMARY KEY (`dealer_id`, `make_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dealer_make_links` ADD CONSTRAINT `dealer_make_links_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_make_links` ADD CONSTRAINT `dealer_make_links_make_id_fkey` FOREIGN KEY (`make_id`) REFERENCES `car_makes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
