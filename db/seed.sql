-- Seed Data for Landing Platform (current live DB snapshot)
-- Run after importing schema.sql

-- Admin user (hash retained from live DB)
INSERT INTO admin_users (email, password_hash, role)
VALUES ('admin@wealthholding-eg.com', '$2b$10$ReUZC0wt.cVuMet3hWLGe.cXH6gf7G0A21DtFFVqUjnOuihJCt6PO', 'admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- Projects
INSERT INTO projects (
  slug,
  title,
  subtitle,
  description,
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
  location,
  type,
  status
) VALUES
(
  'citra',
  'Citra',
  'The Heart of the Green, The Breath of the Land',
  'Citra Residence – New Zayed is Wealth Holding’s first villa residential development in West Cairo. Spanning over 30 acres with 85% dedicated to greenery and water features, Citra offers a calm, private, and well-balanced living environment. Inspired by the symbolism of citrine — the stone of the sun and wealth — Citra reflects a lifestyle where value is defined by space, light, serenity, and lasting legacy.',
  '/Citra/CAMPAIGN-FINAL.jpg',
  '/Citra/heromob.jpg',
  '/Citra/about-bg.jpg',
  '/Citra/mplan.jpeg',
  'Immerse yourself in',
  'At the heart of green revolution',
  'Terraced outdoor experiences for F&B',
  '[{"url":"/Citra/std1.jpg","alt":"Standalone Villa"},{"url":"/Citra/std2.jpg","alt":"Standalone Villa"},{"url":"/Citra/twin.jpg","alt":"Twin Villa"}]',
  '',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34520.12345678901!2d30.987654!3d30.033333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840e49182c1df%3A0xabcd1234ef567890!2sSheikh%20Zayed%20City%2C%20Giza%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1700000000000',
  'New Zayed, West Cairo, Egypt',
  'Residential',
  'Launching'
),
(
  'nile-view-residence',
  'Nile View Residence',
  'Luxury Apartments with Stunning Nile Views',
  'Experience unparalleled luxury living with breathtaking views of the Nile River. Premium finishes, world-class amenities, and strategic location.',
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
  'Zamalek, Cairo',
  'Residential',
  'Ready to Move'
),
(
  'alexandria-coastal-resort',
  'Alexandria Coastal Resort',
  'Beachfront Paradise on the Mediterranean',
  'A luxurious coastal resort featuring private beach access, recreational facilities, and stunning Mediterranean views. Perfect for vacation homes and investment.',
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
  'North Coast, Alexandria',
  'Resort',
  'Under Construction'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  description = VALUES(description),
  heroImage = VALUES(heroImage),
  heroImageMobile = VALUES(heroImageMobile),
  aboutImage = VALUES(aboutImage),
  masterplanImage = VALUES(masterplanImage),
  caption1 = VALUES(caption1),
  caption2 = VALUES(caption2),
  caption3 = VALUES(caption3),
  gallery = VALUES(gallery),
  mapEmbedUrl = VALUES(mapEmbedUrl),
  location = VALUES(location),
  type = VALUES(type),
  status = VALUES(status);

-- Leads (matches live data). Clear existing to keep this snapshot idempotent.
DELETE FROM leads;

SET @citra_id = (SELECT id FROM projects WHERE slug = 'citra');
SET @nile_id = (SELECT id FROM projects WHERE slug = 'nile-view-residence');
SET @alex_id = (SELECT id FROM projects WHERE slug = 'alexandria-coastal-resort');

-- Project videos (using the former static gallery entries)
DELETE FROM project_videos;

INSERT INTO project_videos (projectId, title, category, thumbnailUrl, videoUrl, description, aspectRatio, sortOrder)
VALUES
(@citra_id, 'Cinematic Journey', 'film', 'https://img.freepik.com/premium-photo/professional-cinema-camera-recording-commercial-studio_237404-9535.jpg', 'https://www.youtube.com/embed/EngW7tLk6R8?si=JqVwUbeK03kWJPcE', 'A breathtaking visual narrative exploring the depths of human emotion through stunning cinematography and compelling storytelling.', '2.35 / 1', 1),
(@citra_id, 'Brand Vision', 'commercial', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop', 'https://www.youtube.com/embed/D0UnqGm_miA?si=0f0PwzfJNJ-CWQpq', 'A dynamic commercial piece that captures the essence of modern lifestyle and brand identity.', '16 / 9', 2),
(@citra_id, 'Documentary Truth', 'documentary', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'An intimate documentary exploring real stories and authentic human experiences.', '16 / 9', 3),
(@citra_id, 'Musical Harmony', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', 'https://www.youtube.com/embed/u_sIfs7Yom4?si=MOYOivOMl5mAc-wk', 'A vibrant music video that blends visual artistry with rhythmic storytelling.', '1 / 1', 4);

INSERT INTO leads (
  name,
  phone,
  email,
  job_title,
  preferred_contact_way,
  unit_type,
  message,
  projectId,
  status
) VALUES
('Ahmed Hassan', '+20 100 123 4567', 'ahmed.hassan@example.com', 'Business Owner', 'call', 'Retail Space', 'Interested in retail space options at Once Mall. Please contact me.', @citra_id, 'new'),
('Fatma Ali', '+20 101 234 5678', 'fatma.ali@example.com', 'Doctor', 'whatsapp', 'Apartment', 'Looking for a 3-bedroom apartment with Nile view.', @nile_id, 'qualified'),
('Mohamed Ibrahim', '+20 102 345 6789', 'mohamed.ibrahim@example.com', 'Investor', 'call', 'Villa', 'Interested in vacation home investment opportunities.', @alex_id, 'new'),
('Sara Mahmoud', '+20 106 456 7890', 'sara.mahmoud@example.com', 'Retail Manager', 'whatsapp', 'Shop / Retail Unit', 'Need information about shop availability, areas, and payment plans at Once Mall.', @citra_id, 'new'),
('Khaled Youssef', '+20 109 567 8901', NULL, 'CEO', 'whatsapp', 'Penthouse', 'Prefer to be contacted via WhatsApp. Interested in penthouse units.', @nile_id, 'qualified'),
('Layla Ahmed', '+20 103 888 9999', 'spam@example.com', 'Unknown', 'call', NULL, 'Testing 123... please ignore this inquiry.', NULL, 'spam');
