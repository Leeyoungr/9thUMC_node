/*
  Warnings:

  - Added the required column `updated_at` to the `food_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_prefer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `food_category` ADD COLUMN `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `updated_at` DATETIME(6) NOT NULL;

-- AlterTable
ALTER TABLE `review` MODIFY `content` TEXT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `nickname` VARCHAR(100) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(6) NOT NULL;

-- AlterTable
ALTER TABLE `user_prefer` ADD COLUMN `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `updated_at` DATETIME(6) NOT NULL;
