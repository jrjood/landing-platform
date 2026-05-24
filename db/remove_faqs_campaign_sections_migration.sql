-- Removes project FAQ and dynamic campaign-section storage from existing databases.
-- Run this after deploying the code that no longer reads these structures.

DROP TABLE IF EXISTS `project_faqs`;

ALTER TABLE `projects`
  DROP COLUMN `campaignSections`;
