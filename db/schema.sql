-- Landing Platform Database Schema
-- Compatible with phpMyAdmin/MySQL 5.7+

-- Create database (optional - may need to run separately)
-- CREATE DATABASE IF NOT EXISTS landing_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE landing_platform;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `heroImage` TEXT NOT NULL,
  `heroImageMobile` TEXT,
  `aboutImage` TEXT,
  `masterplanImage` TEXT,
  `caption1` TEXT,
  `caption2` TEXT,
  `caption3` TEXT,
  `gallery` TEXT NOT NULL COMMENT 'JSON array of {url, alt} objects',
  `brochureUrl` TEXT,
  `mapEmbedUrl` TEXT COMMENT 'Google Maps embed URL',
  `location` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Videos Table
CREATE TABLE IF NOT EXISTS `project_videos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `projectId` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT '',
  `thumbnailUrl` TEXT NOT NULL,
  `videoUrl` TEXT NOT NULL,
  `description` TEXT,
  `aspectRatio` VARCHAR(50) DEFAULT NULL,
  `sortOrder` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projectId` (`projectId`),
  CONSTRAINT `fk_project_videos_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leads Table
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `job_title` VARCHAR(255) DEFAULT NULL,
  `preferred_contact_way` ENUM('whatsapp', 'call') DEFAULT 'whatsapp',
  `unit_type` VARCHAR(100) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `projectId` INT UNSIGNED DEFAULT NULL,
  `status` ENUM('new', 'qualified', 'spam') DEFAULT 'new',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projectId` (`projectId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_email` (`email`),
  FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
