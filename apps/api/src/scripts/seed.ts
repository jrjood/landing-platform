import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { pool } from '../config/database';

dotenv.config();

async function seed() {
  try {
    console.log('Starting database seed...');

    const email = 'admin@wealthholding-eg.com';
    const password = 'YourSecurePassword123!';

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin user
    await pool.query(
      `INSERT INTO admin_users (email, password_hash, role) 
       VALUES (?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [email, passwordHash]
    );

    console.log('✅ Database connected successfully');
    console.log('✅ Admin user seeded');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

    // Insert sample projects
    const projects = [
      {
        slug: 'cairo-business-plaza',
        title: 'Cairo Business Plaza',
        subtitle: 'Premium Commercial Complex in New Cairo',
        description:
          'A state-of-the-art commercial development featuring Grade-A office spaces, retail outlets, and premium amenities in the heart of New Cairo.',
        heroImage:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
        gallery: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
            alt: 'Exterior View',
          },
          {
            url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
            alt: 'Office Lobby',
          },
          {
            url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
            alt: 'Modern Office Space',
          },
          {
            url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop',
            alt: 'Commercial Area',
          },
        ]),
        videoUrl: '',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13815.594168939445!2d31.4945!3d30.0155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583d5f32e1d!2sNew%20Cairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1234567890',
        highlights: JSON.stringify([
          'Grade-A Office Spaces',
          'Modern Retail Outlets',
          'Premium Amenities',
          'Strategic Location',
          'Smart Building Technology',
          '24/7 Security',
        ]),
        location: 'New Cairo, Egypt',
        type: 'Commercial',
        status: 'Under Construction',
        phone: '+20 112 189 8883',
        whatsapp: '+20 110 008 2530',
        email: 'info@wealthholding-eg.com',
        faqs: JSON.stringify([]),
      },
      {
        slug: 'nile-view-residence',
        title: 'Nile View Residence',
        subtitle: 'Luxury Apartments with Stunning Nile Views',
        description:
          'Experience unparalleled luxury living with breathtaking views of the Nile River. Premium finishes, world-class amenities, and strategic location.',
        heroImage:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
        gallery: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
            alt: 'Building Exterior',
          },
          {
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
            alt: 'Luxury Interior',
          },
          {
            url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
            alt: 'Living Room',
          },
          {
            url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
            alt: 'Master Bedroom',
          },
        ]),
        videoUrl: '',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.2456789!2d31.2233!3d30.0626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c0!2sZamalek%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1234567890',
        highlights: JSON.stringify([
          'Panoramic Nile Views',
          'Premium Finishing',
          'World-Class Amenities',
          'Concierge Services',
          'Gym & Spa',
          'Rooftop Pool',
        ]),
        location: 'Zamalek, Cairo',
        type: 'Residential',
        status: 'Ready to Move',
        phone: '+20 112 189 8883',
        whatsapp: '+20 110 008 2530',
        email: 'info@wealthholding-eg.com',
        faqs: JSON.stringify([]),
      },
      {
        slug: 'alexandria-coastal-resort',
        title: 'Alexandria Coastal Resort',
        subtitle: 'Beachfront Paradise on the Mediterranean',
        description:
          'A luxurious coastal resort featuring private beach access, recreational facilities, and stunning Mediterranean views. Perfect for vacation homes and investment.',
        heroImage:
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
        gallery: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
            alt: 'Beach View',
          },
          {
            url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
            alt: 'Resort Pool',
          },
          {
            url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
            alt: 'Beachfront Villas',
          },
          {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            alt: 'Coastal Dining',
          },
        ]),
        videoUrl: '',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.123456!2d29.9!3d31.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c5!2sNorth%20Coast%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890',
        highlights: JSON.stringify([
          'Private Beach Access',
          'Mediterranean Views',
          'Recreational Facilities',
          'Resort Amenities',
          'Water Sports',
          'Beachfront Dining',
        ]),
        location: 'North Coast, Alexandria',
        type: 'Resort',
        status: 'Under Construction',
        phone: '+20 112 189 8883',
        whatsapp: '+20 110 008 2530',
        email: 'info@wealthholding-eg.com',
        faqs: JSON.stringify([]),
      },
    ];

    for (const project of projects) {
      await pool.query(
        `INSERT INTO projects (slug, title, subtitle, description, heroImage, gallery, videoUrl, mapEmbedUrl, highlights, location, type, status, phone, whatsapp, email, faqs)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
         status = VALUES(status)`,
        [
          project.slug,
          project.title,
          project.subtitle,
          project.description,
          project.heroImage,
          project.gallery,
          project.videoUrl,
          project.mapEmbedUrl,
          project.highlights,
          project.location,
          project.type,
          project.status,
          project.phone,
          project.whatsapp,
          project.email,
          project.faqs,
        ]
      );
    }

    console.log('✅ Projects seeded (3 projects)');

    // Fetch project IDs by slug
    const [projectRows] = await pool.query('SELECT id, slug FROM projects');
    const slugToId: Record<string, number> = {};
    for (const row of projectRows as any[]) {
      slugToId[row.slug] = row.id;
    }

    // Insert sample leads using projectSlug
    const leads = [
      {
        name: 'Ahmed Hassan',
        phone: '+20 100 123 4567',
        email: 'ahmed.hassan@example.com',
        job_title: 'Business Owner',
        preferred_contact_way: 'call',
        unit_type: 'Office Space',
        projectSlug: 'cairo-business-plaza',
        status: 'new',
        message: 'Interested in commercial office spaces. Please contact me.',
      },
      {
        name: 'Fatma Ali',
        phone: '+20 101 234 5678',
        email: 'fatma.ali@example.com',
        job_title: 'Doctor',
        preferred_contact_way: 'whatsapp',
        unit_type: 'Apartment',
        projectSlug: 'nile-view-residence',
        status: 'qualified',
        message: 'Looking for a 3-bedroom apartment with Nile view.',
      },
      {
        name: 'Mohamed Ibrahim',
        phone: '+20 102 345 6789',
        email: 'mohamed.ibrahim@example.com',
        job_title: 'Investor',
        preferred_contact_way: 'call',
        unit_type: 'Villa',
        projectSlug: 'alexandria-coastal-resort',
        status: 'new',
        message: 'Interested in vacation home investment opportunities.',
      },
      {
        name: 'Sara Mahmoud',
        phone: '+20 106 456 7890',
        email: 'sara.mahmoud@example.com',
        job_title: 'Retail Manager',
        preferred_contact_way: 'whatsapp',
        unit_type: 'Retail Space',
        projectSlug: 'cairo-business-plaza',
        status: 'new',
        message:
          'Need information about retail space availability and pricing.',
      },
      {
        name: 'Khaled Youssef',
        phone: '+20 109 567 8901',
        email: null,
        job_title: 'CEO',
        preferred_contact_way: 'whatsapp',
        unit_type: 'Penthouse',
        projectSlug: 'nile-view-residence',
        status: 'qualified',
        message:
          'Prefer to be contacted via WhatsApp. Interested in penthouse units.',
      },
      {
        name: 'Layla Ahmed',
        phone: '+20 103 888 9999',
        email: 'spam@example.com',
        job_title: 'Unknown',
        preferred_contact_way: 'call',
        unit_type: null,
        projectSlug: null,
        status: 'spam',
        message: 'Testing 123... please ignore this inquiry.',
      },
    ];

    for (const lead of leads) {
      const projectId = lead.projectSlug
        ? slugToId[lead.projectSlug] || null
        : null;
      await pool.query(
        `INSERT INTO leads (name, phone, email, job_title, preferred_contact_way, unit_type, message, projectId, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lead.name,
          lead.phone,
          lead.email,
          lead.job_title,
          lead.preferred_contact_way,
          lead.unit_type,
          lead.message,
          projectId,
          lead.status,
        ]
      );
    }

    console.log(`✅ Leads seeded (${leads.length} sample leads)`);
    console.log('\n✅ Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
