-- Seed Data for Landing Platform (current live DB snapshot)
-- Run after importing schema.sql

-- Admin user (hash retained from live DB)
INSERT INTO admin_users (email, password_hash, role)
VALUES ('admin@wealthholding-eg.com', '$2b$10$b3lLhGHzpB5.J.0HHybTb.4NgSgh8L2.jqSZruKD89.VPnTjGn49y', 'admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

INSERT INTO developers (
  slug,
  name,
  description,
  headline,
  logoUrl,
  showcaseImageUrl,
  yearsOfExperience,
  projectsDelivered,
  happyFamilies,
  brandColor,
  contactPhone,
  websiteUrl,
  socialLinks
)
VALUES (
  'wealth-holding',
  'Wealth Holding Developments',
  'Wealth Holding Developments creates premium residential communities with a focus on long-term value, disciplined delivery, and campaign-ready buyer communication.',
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

SET @wealth_developer_id = (SELECT id FROM developers WHERE slug = 'wealth-holding');

-- Projects
INSERT INTO projects (
  slug,
  subdomain,
  title,
  subtitle,
  description,
  seoTitle,
  seoDescription,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  landingVisibility,
  formSettings,
  heroImage,
  heroImageMobile,
  aboutImage,
  masterplanImage,
  caption1,
  caption2,
  caption3,
  gallery,
  brochureUrl,
  mapEmbedUrl,
  locationImage,
  locationText,
  location,
  type,
  status
) VALUES
(
  'citra',
  'citra',
  'Citra',
  'The Heart of the Green, The Breath of the Land',
  'Citra Residence - New Zayed is Wealth Holding''s first villa residential development in West Cairo. Spanning over 30 acres with 85% dedicated to greenery and water features, Citra offers a calm, private, and well-balanced living environment. Inspired by the symbolism of citrine - the stone of the sun and wealth - Citra reflects a lifestyle where value is defined by space, light, serenity, and lasting legacy.',
  'Citra New Zayed Villas | Wealth Holding Developments',
  'Explore Citra Residence in New Zayed: a green villa community by Wealth Holding with campaign details, gallery, location, and inquiry form.',
  'Citra New Zayed Villas',
  'A dedicated campaign landing page for Citra Residence in New Zayed.',
  '/Citra/hero.jpg',
  'https://citra.wealthholding-eg.com/',
  'public',
  '{"preferredContactWay":"whatsapp","source":"citra-campaign"}',
  '/Citra/hero.jpg',
  '/Citra/heromob.jpg',
  '/Citra/about-bg.jpg',
  '/Citra/mplan.jpeg',
  'Immerse yourself in',
  'At the heart of green revolution',
  'Terraced outdoor experiences for F&B',
  '[{"url":"/Citra/stand alone FRONT ELEVATION WITH DOUBLE HEIGHT.jpg","alt":"Standalone villa front elevation"},{"url":"/Citra/town front elevation.jpg","alt":"Town villa front elevation"},{"url":"/Citra/twin FRONT ELEVATION WITH DOUBLE HEIGHT.jpg","alt":"Twin villa front elevation"}]',
  '',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34520.12345678901!2d30.987654!3d30.033333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840e49182c1df%3A0xabcd1234ef567890!2sSheikh%20Zayed%20City%2C%20Giza%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1700000000000',
  '/Citra/location.jpg',
  'New Zayed, West Cairo, Egypt',
  'New Zayed, West Cairo, Egypt',
  'Residential',
  'Launching'
),
(
  'nile-view-residence',
  NULL,
  'Nile View Residence',
  'Luxury Apartments with Stunning Nile Views',
  'Experience unparalleled luxury living with breathtaking views of the Nile River. Premium finishes, world-class amenities, and strategic location.',
  'Nile View Residence | Wealth Holding Developments',
  'Luxury apartments with Nile views, premium finishes, amenities, and lead capture.',
  'Nile View Residence',
  'Luxury apartments with stunning Nile views.',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
  NULL,
  'public',
  '{}',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop',
  'Panoramic terraces over the Nile',
  'Residences crafted for natural light',
  'Five-star hospitality services at home',
  '[{"url":"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop","alt":"Building Exterior"},{"url":"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop","alt":"Luxury Interior"},{"url":"https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop","alt":"Living Room"},{"url":"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop","alt":"Master Bedroom"}]',
  '',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.2456789!2d31.2233!3d30.0626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c0!2sZamalek%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1234567890',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop',
  'Zamalek, Cairo',
  'Zamalek, Cairo',
  'Residential',
  'Ready to Move'
),
(
  'alexandria-coastal-resort',
  NULL,
  'Alexandria Coastal Resort',
  'Beachfront Paradise on the Mediterranean',
  'A luxurious coastal resort featuring private beach access, recreational facilities, and stunning Mediterranean views. Perfect for vacation homes and investment.',
  'Alexandria Coastal Resort | Wealth Holding Developments',
  'A beachfront resort campaign landing page with private beach access and Mediterranean views.',
  'Alexandria Coastal Resort',
  'Beachfront resort homes on the Mediterranean.',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
  NULL,
  'public',
  '{}',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
  'Beachfront residences with private sand',
  'Clubhouse with lagoon-side dining',
  'Masterplanned resort circulation',
  '[{"url":"https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop","alt":"Beach View"},{"url":"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop","alt":"Resort Pool"},{"url":"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop","alt":"Beachfront Villas"},{"url":"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop","alt":"Coastal Dining"}]',
  '',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.123456!2d29.9!3d31.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c5!2sNorth%20Coast%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
  'North Coast, Alexandria',
  'North Coast, Alexandria',
  'Resort',
  'Under Construction'
)
ON DUPLICATE KEY UPDATE
  subdomain = VALUES(subdomain),
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  description = VALUES(description),
  seoTitle = VALUES(seoTitle),
  seoDescription = VALUES(seoDescription),
  ogTitle = VALUES(ogTitle),
  ogDescription = VALUES(ogDescription),
  ogImage = VALUES(ogImage),
  canonicalUrl = VALUES(canonicalUrl),
  landingVisibility = VALUES(landingVisibility),
  formSettings = VALUES(formSettings),
  heroImage = VALUES(heroImage),
  heroImageMobile = VALUES(heroImageMobile),
  aboutImage = VALUES(aboutImage),
  masterplanImage = VALUES(masterplanImage),
  caption1 = VALUES(caption1),
  caption2 = VALUES(caption2),
  caption3 = VALUES(caption3),
  gallery = VALUES(gallery),
  mapEmbedUrl = VALUES(mapEmbedUrl),
  locationImage = VALUES(locationImage),
  locationText = VALUES(locationText),
  location = VALUES(location),
  type = VALUES(type),
  status = VALUES(status);

UPDATE projects SET developerId = @wealth_developer_id WHERE developerId IS NULL;

SET @citra_id = (SELECT id FROM projects WHERE slug = 'citra');
SET @nile_id = (SELECT id FROM projects WHERE slug = 'nile-view-residence');
SET @alex_id = (SELECT id FROM projects WHERE slug = 'alexandria-coastal-resort');

-- Project videos (using the former static gallery entries)
DELETE FROM project_videos WHERE projectId IN (@citra_id, @nile_id, @alex_id);

INSERT INTO project_videos (projectId, title, category, thumbnailUrl, videoUrl, description, aspectRatio, sortOrder)
VALUES
(@citra_id, 'Citra', 'Film', 'https://drive.google.com/thumbnail?id=1H_QeJVTMSzfpnoDFhlXhYazXtuPiUbf2&sz=w1000', 'https://drive.google.com/file/d/1H_QeJVTMSzfpnoDFhlXhYazXtuPiUbf2/view?usp=sharing', 'Citra Residence - New Zayed is Wealth Holding''s first villa residential development in West Cairo.\nSpanning over 30 acres with 85% dedicated to greenery and water features, Citra offers a calm, private, and well-balanced living environment.', '16 / 9', 1);

DELETE FROM payment_plans WHERE projectId IN (@citra_id, @nile_id, @alex_id);
INSERT INTO payment_plans (projectId, title, downPayment, installments, years, deliveryDate, startingPrice, promotionalOffer, badge, sortOrder)
VALUES
(@citra_id, 'Launch Campaign Plan', '10%', 'Equal installments', 'Up to 10 years', 'By phase', 'Ask sales team', 'Limited launch availability', 'Launch offer', 1),
(@nile_id, 'Flexible Residence Plan', '15%', 'Quarterly installments', 'Up to 7 years', 'Ready to move', 'On request', NULL, 'Ready inventory', 1),
(@alex_id, 'Coastal Investment Plan', '10%', 'Seasonal installments', 'Up to 8 years', 'Under construction', 'On request', NULL, 'Investment', 1);

INSERT INTO amenities (slug, name, icon, category, description, isActive)
VALUES
('green-landscape', 'Green landscape', 'trees', 'Nature', 'Large green areas and water features designed for calm daily living.', 1),
('private-community', 'Private community', 'shield', 'Privacy', 'Low-density villa planning with controlled project circulation.', 1),
('west-cairo-access', 'West Cairo access', 'car', 'Location', 'Positioned for access to New Zayed and West Cairo destinations.', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  icon = VALUES(icon),
  category = VALUES(category),
  description = VALUES(description),
  isActive = VALUES(isActive);

DELETE FROM project_amenities WHERE projectId = @citra_id;
INSERT INTO project_amenities (projectId, amenityId, sortOrder)
SELECT @citra_id, id, CASE slug
  WHEN 'green-landscape' THEN 1
  WHEN 'private-community' THEN 2
  ELSE 3
END
FROM amenities
WHERE slug IN ('green-landscape', 'private-community', 'west-cairo-access');

DELETE FROM project_highlights WHERE projectId IN (@citra_id, @nile_id, @alex_id);
INSERT INTO project_highlights (projectId, label, value, icon, sortOrder)
VALUES
(@citra_id, 'Prime Location', 'New Zayed', 'map-pin', 1),
(@citra_id, 'Villa Community', 'Standalone, twin, and town villas', 'home', 2),
(@citra_id, 'Green Living', '85% greenery and water', 'trees', 3),
(@nile_id, 'Nile Views', 'Waterfront apartments', 'waves', 1),
(@nile_id, 'Connected Address', 'Downtown Cairo', 'map-pin', 2),
(@nile_id, 'Ready Lifestyle', 'Premium amenities', 'sparkles', 3),
(@alex_id, 'Coastal Living', 'Mediterranean resort', 'waves', 1),
(@alex_id, 'Family Escape', 'Serviced chalets and villas', 'family', 2),
(@alex_id, 'Resort Amenities', 'Beach, pools, and dining', 'sparkles', 3);

DELETE FROM media_assets WHERE projectId IN (@citra_id, @nile_id, @alex_id);
INSERT INTO media_assets (projectId, url, altText, title, type, category, sortOrder)
VALUES
(@citra_id, '/Citra/hero.jpg', 'Citra campaign hero visual', 'Hero', 'image', 'hero', 1),
(@citra_id, '/Citra/location.jpg', 'Citra location map visual', 'Location', 'image', 'location', 2),
(@citra_id, '/Citra/mplan.jpeg', 'Citra master plan', 'Master Plan', 'masterplan', 'masterplan', 3);
