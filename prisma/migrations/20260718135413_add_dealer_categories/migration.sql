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

-- AddForeignKey
ALTER TABLE `dealer_categories` ADD CONSTRAINT `dealer_categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `dealer_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_category_links` ADD CONSTRAINT `dealer_category_links_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealer_category_links` ADD CONSTRAINT `dealer_category_links_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `dealer_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
