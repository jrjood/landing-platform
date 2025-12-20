-- Seed Data for Landing Platform
-- Run this after importing schema.sql

-- Insert Admin User
-- Password: YourSecurePassword123!
-- Hash generated with bcrypt rounds=10
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('admin@wealthholding-eg.com', '$2b$10$K28aVn8GPqJWfTv512aEDuTM97VSRhf28E.tOgjux5FDT2e6sthOq', 'admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- Insert Projects
INSERT INTO projects (slug, title, subtitle, description, heroImage, gallery, videoUrl, mapEmbedUrl, highlights, location, type, status, phone, whatsapp, email, faqs)
VALUES 
(
  'cairo-business-plaza',
  'Cairo Business Plaza',
  'Premium Commercial Complex in New Cairo',
  'A state-of-the-art commercial development featuring Grade-A office spaces, retail outlets, and premium amenities in the heart of New Cairo.',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
  '[{"url":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop","alt":"Exterior View"},{"url":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop","alt":"Office Lobby"},{"url":"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop","alt":"Modern Office Space"},{"url":"https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop","alt":"Commercial Area"}]',
  '',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13815.594168939445!2d31.4945!3d30.0155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583d5f32e1d!2sNew%20Cairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1234567890',
  '["Grade-A Office Spaces","Modern Retail Outlets","Premium Amenities","Strategic Location","Smart Building Technology","24/7 Security"]',
  'New Cairo, Egypt',
  'Commercial',
  'Under Construction',
  '+20 112 189 8883',
  '+20 110 008 2530',
  'info@wealthholding-eg.com',
  '[]'
),
(
  'nile-view-residence',
  'Nile View Residence',
  'Luxury Apartments with Stunning Nile Views',
  'Experience unparalleled luxury living with breathtaking views of the Nile River. Premium finishes, world-class amenities, and strategic location.',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
  '[{"url":"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop","alt":"Building Exterior"},{"url":"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop","alt":"Luxury Interior"},{"url":"https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop","alt":"Living Room"},{"url":"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop","alt":"Master Bedroom"}]',
  '',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.2456789!2d31.2233!3d30.0626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c0!2sZamalek%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1234567890',
  '["Panoramic Nile Views","Premium Finishing","World-Class Amenities","Concierge Services","Gym & Spa","Rooftop Pool"]',
  'Zamalek, Cairo',
  'Residential',
  'Ready to Move',
  '+20 112 189 8883',
  '+20 110 008 2530',
  'info@wealthholding-eg.com',
  '[]'
),
(
  'alexandria-coastal-resort',
  'Alexandria Coastal Resort',
  'Beachfront Paradise on the Mediterranean',
  'A luxurious coastal resort featuring private beach access, recreational facilities, and stunning Mediterranean views. Perfect for vacation homes and investment.',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
  '[{"url":"https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop","alt":"Beach View"},{"url":"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop","alt":"Resort Pool"},{"url":"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop","alt":"Beachfront Villas"},{"url":"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop","alt":"Coastal Dining"}]',
  '',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.123456!2d29.9!3d31.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c5!2sNorth%20Coast%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890',
  '["Private Beach Access","Mediterranean Views","Recreational Facilities","Resort Amenities","Water Sports","Beachfront Dining"]',
  'North Coast, Alexandria',
  'Resort',
  'Under Construction',
  '+20 112 189 8883',
  '+20 110 008 2530',
  'info@wealthholding-eg.com',
  '[]'
)
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  description = VALUES(description),
  heroImage = VALUES(heroImage),
  gallery = VALUES(gallery),
  mapEmbedUrl = VALUES(mapEmbedUrl),
  highlights = VALUES(highlights),
  location = VALUES(location),
  type = VALUES(type),
  status = VALUES(status);
