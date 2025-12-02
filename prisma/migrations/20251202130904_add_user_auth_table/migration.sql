-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(255) NULL,
    MODIFY `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL DEFAULT 'OTHER',
    MODIFY `birth` DATE NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `phone_number` VARCHAR(15) NULL,
    MODIFY `nickname` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `user_auth` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` ENUM('GOOGLE') NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `providerEmail` VARCHAR(191) NULL,
    `refreshTokenHash` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_auth_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_auth` ADD CONSTRAINT `user_auth_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
