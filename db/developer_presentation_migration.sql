-- Adds dynamic public landing-page presentation fields for developers.
-- Run this once on existing databases before editing developer presentation content.

ALTER TABLE `developers`
  ADD COLUMN `headline` VARCHAR(255) AFTER `description`,
  ADD COLUMN `showcaseImageUrl` TEXT AFTER `logoUrl`,
  ADD COLUMN `yearsOfExperience` VARCHAR(50) AFTER `showcaseImageUrl`,
  ADD COLUMN `projectsDelivered` VARCHAR(50) AFTER `yearsOfExperience`,
  ADD COLUMN `happyFamilies` VARCHAR(50) AFTER `projectsDelivered`;

UPDATE `developers`
SET
  `headline` = COALESCE(`headline`, 'Built on Trust. Driven by Excellence.'),
  `showcaseImageUrl` = COALESCE(`showcaseImageUrl`, '/Citra/about-bg.jpg'),
  `yearsOfExperience` = COALESCE(`yearsOfExperience`, '25+'),
  `projectsDelivered` = COALESCE(`projectsDelivered`, '50+'),
  `happyFamilies` = COALESCE(`happyFamilies`, '20,000+')
WHERE `slug` = 'wealth-holding';
