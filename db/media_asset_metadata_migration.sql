-- Add generated media variant metadata to existing installations.
-- Run after landing_page_platform_migration.sql on databases created before media variants existed.

SET @schema_name = DATABASE();

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `media_assets` ADD COLUMN `originalUrl` TEXT AFTER `url`',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'media_assets' AND COLUMN_NAME = 'originalUrl'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `media_assets` ADD COLUMN `webpUrl` TEXT AFTER `originalUrl`',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'media_assets' AND COLUMN_NAME = 'webpUrl'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `media_assets` ADD COLUMN `thumbnailUrl` TEXT AFTER `webpUrl`',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'media_assets' AND COLUMN_NAME = 'thumbnailUrl'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `media_assets` ADD COLUMN `mediumUrl` TEXT AFTER `thumbnailUrl`',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'media_assets' AND COLUMN_NAME = 'mediumUrl'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `media_assets` ADD COLUMN `size` INT UNSIGNED DEFAULT NULL AFTER `height`',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = 'media_assets' AND COLUMN_NAME = 'size'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
