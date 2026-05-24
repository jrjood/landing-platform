-- Landing-page platform migration for existing databases.
-- Run after the previous schema has already been imported.

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

ALTER TABLE `projects`
  ADD COLUMN `subdomain` VARCHAR(63) DEFAULT NULL UNIQUE AFTER `slug`,
  ADD COLUMN `developerId` INT UNSIGNED DEFAULT NULL AFTER `subdomain`,
  ADD COLUMN `seoTitle` VARCHAR(255) AFTER `description`,
  ADD COLUMN `seoDescription` VARCHAR(500) AFTER `seoTitle`,
  ADD COLUMN `ogTitle` VARCHAR(255) AFTER `seoDescription`,
  ADD COLUMN `ogDescription` VARCHAR(500) AFTER `ogTitle`,
  ADD COLUMN `ogImage` TEXT AFTER `ogDescription`,
  ADD COLUMN `canonicalUrl` TEXT AFTER `ogImage`,
  ADD COLUMN `landingVisibility` ENUM('public', 'hidden', 'draft') NOT NULL DEFAULT 'public' AFTER `canonicalUrl`,
  ADD COLUMN `formSettings` TEXT AFTER `landingVisibility`,
  ADD INDEX `idx_subdomain` (`subdomain`),
  ADD INDEX `idx_developerId` (`developerId`),
  ADD INDEX `idx_landing_visibility` (`landingVisibility`);

UPDATE `projects`
SET
  `formSettings` = '{}',
  `landingVisibility` = 'public'
WHERE `formSettings` IS NULL
  OR `formSettings` = '';

ALTER TABLE `projects`
  MODIFY COLUMN `formSettings` TEXT NOT NULL;

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
  PRIMARY KEY (`projectId`, `amenityId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  INDEX `idx_projectId` (`projectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  INDEX `idx_type_category` (`type`, `category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_highlights` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `projectId` INT UNSIGNED NOT NULL,
  `label` VARCHAR(80) NOT NULL,
  `value` VARCHAR(160) NOT NULL,
  `icon` VARCHAR(100) DEFAULT 'check',
  `sortOrder` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projectId` (`projectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `leads`
  ADD COLUMN `campaign` VARCHAR(255) DEFAULT NULL AFTER `projectId`,
  ADD COLUMN `utm_source` VARCHAR(255) DEFAULT NULL AFTER `campaign`,
  ADD COLUMN `utm_medium` VARCHAR(255) DEFAULT NULL AFTER `utm_source`,
  ADD COLUMN `utm_campaign` VARCHAR(255) DEFAULT NULL AFTER `utm_medium`,
  ADD COLUMN `utm_content` VARCHAR(255) DEFAULT NULL AFTER `utm_campaign`,
  ADD COLUMN `utm_term` VARCHAR(255) DEFAULT NULL AFTER `utm_content`,
  ADD COLUMN `source_url` TEXT DEFAULT NULL AFTER `utm_term`,
  ADD COLUMN `landing_host` VARCHAR(255) DEFAULT NULL AFTER `source_url`,
  ADD INDEX `idx_campaign` (`campaign`),
  ADD INDEX `idx_utm_source` (`utm_source`);

ALTER TABLE `leads`
  MODIFY COLUMN `status` ENUM('new', 'contacted', 'qualified', 'closed', 'spam') DEFAULT 'new';

INSERT INTO developers (slug, name, description, headline, logoUrl, showcaseImageUrl, yearsOfExperience, projectsDelivered, happyFamilies, brandColor, contactPhone, websiteUrl, socialLinks)
VALUES (
  'wealth-holding',
  'Wealth Holding Developments',
  'A real-estate developer focused on premium residential communities and campaign-ready project experiences.',
  'Built on Trust. Driven by Excellence.',
  '/logo-black.png',
  '/Citra/about-bg.jpg',
  '25+',
  '50+',
  '20,000+',
  '#9dae91',
  '19640',
  'https://wealthholding-eg.com',
  '{"facebook":"https://www.facebook.com/WealthHolding/","instagram":"https://www.instagram.com/wealthholding/","linkedin":"https://www.linkedin.com/company/wealth-holding-developments/"}'
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  headline = VALUES(headline),
  logoUrl = VALUES(logoUrl),
  showcaseImageUrl = VALUES(showcaseImageUrl),
  yearsOfExperience = VALUES(yearsOfExperience),
  projectsDelivered = VALUES(projectsDelivered),
  happyFamilies = VALUES(happyFamilies),
  brandColor = VALUES(brandColor),
  contactPhone = VALUES(contactPhone),
  websiteUrl = VALUES(websiteUrl),
  socialLinks = VALUES(socialLinks);

UPDATE `projects`
SET
  `developerId` = (SELECT id FROM developers WHERE slug = 'wealth-holding'),
  `subdomain` = CASE WHEN `slug` = 'citra' THEN 'citra' ELSE `subdomain` END,
  `seoTitle` = COALESCE(`seoTitle`, CONCAT(`title`, ' | Wealth Holding Developments')),
  `seoDescription` = COALESCE(`seoDescription`, `subtitle`),
  `ogTitle` = COALESCE(`ogTitle`, `title`),
  `ogDescription` = COALESCE(`ogDescription`, `subtitle`),
  `ogImage` = COALESCE(`ogImage`, `heroImage`)
WHERE `developerId` IS NULL;
