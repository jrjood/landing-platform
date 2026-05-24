CREATE TABLE IF NOT EXISTS `project_highlights` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `projectId` INT UNSIGNED NOT NULL,
  `label` VARCHAR(80) NOT NULL,
  `value` VARCHAR(160) NOT NULL,
  `icon` VARCHAR(100) DEFAULT 'check',
  `sortOrder` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projectId` (`projectId`),
  CONSTRAINT `fk_project_highlights_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

