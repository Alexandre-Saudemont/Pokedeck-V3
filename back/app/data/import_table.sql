SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `deck_pokemon`;
DROP TABLE IF EXISTS `deck`;
DROP TABLE IF EXISTS `pokemon_type`;
DROP TABLE IF EXISTS `types`;
DROP TABLE IF EXISTS `pokemon`;
DROP TABLE IF EXISTS `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- Créer la table "user"
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Créer la table "pokemon"
CREATE TABLE IF NOT EXISTS `pokemon`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255) NOT NULL,
    `pv` INT NOT NULL,
    `attaque` INT NOT NULL,
    `defense` INT NOT NULL,
    `attaque_spe` INT NOT NULL,
    `defense_spe` INT NOT NULL,
    `vitesse` INT NOT NULL,
    `url` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Créer la table "types"
CREATE TABLE IF NOT EXISTS `types`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Créer la table de relation "pokemon_type"
CREATE TABLE IF NOT EXISTS `pokemon_type`(
    `pokemon_id` INT NOT NULL,
    `type_id` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME,
    FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`type_id`) REFERENCES `types`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Créer la table "deck"
CREATE TABLE IF NOT EXISTS `deck`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `pokemon_id` INT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Créer la table "deck_pokemon"
CREATE TABLE IF NOT EXISTS `deck_pokemon`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `deck_id` INT NOT NULL,
    `pokemon_id` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME,
    FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
