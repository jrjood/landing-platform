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

-- Developers Table
CREATE TABLE IF NOT EXISTS `developers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `headline` VARCHAR(255),
  `logoUrl` TEXT,
  `showcaseImageUrl` TEXT,
  `yearsOfExperience` VARCHAR(50),
  `projectsDelivered` VARCHAR(50),
  `happyFamilies` VARCHAR(50),
  `brandColor` VARCHAR(32),
  `contactEmail` VARCHAR(255),
  `contactPhone` VARCHAR(50),
  `websiteUrl` TEXT,
  `socialLinks` TEXT NOT NULL COMMENT 'JSON object',
  `seoTitle` VARCHAR(255),
  `seoDescription` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `subdomain` VARCHAR(63) DEFAULT NULL UNIQUE,
  `developerId` INT UNSIGNED DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `seoTitle` VARCHAR(255),
  `seoDescription` VARCHAR(500),
  `ogTitle` VARCHAR(255),
  `ogDescription` VARCHAR(500),
  `ogImage` TEXT,
  `canonicalUrl` TEXT,
  `landingVisibility` ENUM('public', 'hidden', 'draft') NOT NULL DEFAULT 'public',
  `formSettings` TEXT NOT NULL COMMENT 'JSON object for custom form settings',
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
  `locationImage` TEXT,
  `locationText` VARCHAR(255),
  `location` VARCHAR(255),
  `type` VARCHAR(100) NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_subdomain` (`subdomain`),
  INDEX `idx_developerId` (`developerId`),
  INDEX `idx_landing_visibility` (`landingVisibility`),
  CONSTRAINT `fk_projects_developer` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Central reusable amenity library
CREATE TABLE IF NOT EXISTS `amenities` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `description` TEXT,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_amenities` (
  `projectId` INT UNSIGNED NOT NULL,
  `amenityId` INT UNSIGNED NOT NULL,
  `sortOrder` INT DEFAULT 0,
  PRIMARY KEY (`projectId`, `amenityId`),
  CONSTRAINT `fk_project_amenities_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_project_amenities_amenity` FOREIGN KEY (`amenityId`) REFERENCES `amenities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project hero highlights managed per landing page
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

-- Project payment plans
CREATE TABLE IF NOT EXISTS `payment_plans` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `projectId` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `downPayment` VARCHAR(100) DEFAULT NULL,
  `installments` VARCHAR(100) DEFAULT NULL,
  `years` VARCHAR(100) DEFAULT NULL,
  `deliveryDate` VARCHAR(100) DEFAULT NULL,
  `startingPrice` VARCHAR(100) DEFAULT NULL,
  `promotionalOffer` VARCHAR(255) DEFAULT NULL,
  `badge` VARCHAR(100) DEFAULT NULL,
  `sortOrder` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_payment_plans_projectId` (`projectId`),
  INDEX `idx_projectId` (`projectId`),
  CONSTRAINT `fk_payment_plans_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CMS media library with project categorization
CREATE TABLE IF NOT EXISTS `media_assets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `projectId` INT UNSIGNED DEFAULT NULL,
  `developerId` INT UNSIGNED DEFAULT NULL,
  `url` TEXT NOT NULL,
  `originalUrl` TEXT,
  `webpUrl` TEXT,
  `thumbnailUrl` TEXT,
  `mediumUrl` TEXT,
  `altText` VARCHAR(255) DEFAULT '',
  `title` VARCHAR(255) DEFAULT '',
  `type` ENUM('image', 'video', 'brochure', 'masterplan', 'logo', 'other') NOT NULL DEFAULT 'image',
  `category` VARCHAR(100) DEFAULT 'gallery',
  `mimeType` VARCHAR(100) DEFAULT NULL,
  `width` INT UNSIGNED DEFAULT NULL,
  `height` INT UNSIGNED DEFAULT NULL,
  `size` INT UNSIGNED DEFAULT NULL,
  `sortOrder` INT DEFAULT 0,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projectId` (`projectId`),
  INDEX `idx_developerId` (`developerId`),
  INDEX `idx_type_category` (`type`, `category`),
  CONSTRAINT `fk_media_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_media_developer` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`) ON DELETE SET NULL
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
  `campaign` VARCHAR(255) DEFAULT NULL,
  `utm_source` VARCHAR(255) DEFAULT NULL,
  `utm_medium` VARCHAR(255) DEFAULT NULL,
  `utm_campaign` VARCHAR(255) DEFAULT NULL,
  `utm_content` VARCHAR(255) DEFAULT NULL,
  `utm_term` VARCHAR(255) DEFAULT NULL,
  `source_url` TEXT DEFAULT NULL,
  `landing_host` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('new', 'contacted', 'qualified', 'closed', 'spam') DEFAULT 'new',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projectId` (`projectId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_email` (`email`),
  INDEX `idx_campaign` (`campaign`),
  INDEX `idx_utm_source` (`utm_source`),
  FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
