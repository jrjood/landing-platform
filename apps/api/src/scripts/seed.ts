import dotenv from 'dotenv';
import { pool } from '../config/database';

dotenv.config();

async function seed() {
  try {
    console.log('Starting database seed...');

    const adminUser = {
      email: 'admin@wealthholding-eg.com',
      passwordHash:
        '$2b$10$ReUZC0wt.cVuMet3hWLGe.cXH6gf7G0A21DtFFVqUjnOuihJCt6PO', // current live hash
    };

    await pool.query(
      `INSERT INTO admin_users (email, password_hash, role)
       VALUES (?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [adminUser.email, adminUser.passwordHash]
    );

    console.log('Database connected successfully');
    console.log('Admin user seeded');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: (hash from live DB preserved)');

    const projects = [
      {
        slug: 'citra',
        title: 'Citra',
        subtitle: 'The Heart of the Green, The Breath of the Land',
        description:
          "Citra Residence - New Zayed is Wealth Holding's first villa residential development in West Cairo. Spanning over 30 acres with 85% dedicated to greenery and water features, Citra offers a calm, private, and well-balanced living environment. Inspired by the symbolism of citrine - the stone of the sun and wealth - Citra reflects a lifestyle where value is defined by space, light, serenity, and lasting legacy.",
        heroImage: '/Citra/CAMPAIGN-FINAL.jpg',
        heroImageMobile: '/Citra/heromob.jpg',
        aboutImage: '/Citra/about-bg.jpg',
        masterplanImage: '/Citra/mplan.jpeg',
        caption1: 'Immerse yourself in',
        caption2: 'At the heart of green revolution',
        caption3: 'Terraced outdoor experiences for F&B',
        gallery: JSON.stringify([
          { url: '/Citra/std1.jpg', alt: 'Standalone Villa' },
          { url: '/Citra/std2.jpg', alt: 'Standalone Villa' },
          { url: '/Citra/twin.jpg', alt: 'Twin Villa' },
        ]),
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34520.12345678901!2d30.987654!3d30.033333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840e49182c1df%3A0xabcd1234ef567890!2sSheikh%20Zayed%20City%2C%20Giza%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1700000000000',
        location: 'New Zayed, West Cairo, Egypt',
        type: 'Residential',
        status: 'Launching',
      },
      {
        slug: 'nile-view-residence',
        title: 'Nile View Residence',
        subtitle: 'Luxury Apartments with Stunning Nile Views',
        description:
          'Experience unparalleled luxury living with breathtaking views of the Nile River. Premium finishes, world-class amenities, and strategic location.',
        heroImage:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
        heroImageMobile:
          'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=900&auto=format&fit=crop',
        aboutImage:
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop',
        masterplanImage:
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop',
        caption1: 'Panoramic terraces over the Nile',
        caption2: 'Residences crafted for natural light',
        caption3: 'Five-star hospitality services at home',
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
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.2456789!2d31.2233!3d30.0626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c0!2sZamalek%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1234567890',
        location: 'Zamalek, Cairo',
        type: 'Residential',
        status: 'Ready to Move',
      },
      {
        slug: 'alexandria-coastal-resort',
        title: 'Alexandria Coastal Resort',
        subtitle: 'Beachfront Paradise on the Mediterranean',
        description:
          'A luxurious coastal resort featuring private beach access, recreational facilities, and stunning Mediterranean views. Perfect for vacation homes and investment.',
        heroImage:
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
        heroImageMobile:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop',
        aboutImage:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
        masterplanImage:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
        caption1: 'Beachfront residences with private sand',
        caption2: 'Clubhouse with lagoon-side dining',
        caption3: 'Masterplanned resort circulation',
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
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.123456!2d29.9!3d31.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c5!2sNorth%20Coast%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890',
        location: 'North Coast, Alexandria',
        type: 'Resort',
        status: 'Under Construction',
      },
    ];

    for (const project of projects) {
      await pool.query(
        `INSERT INTO projects (slug, title, subtitle, description, heroImage, heroImageMobile, aboutImage, masterplanImage, caption1, caption2, caption3, gallery, mapEmbedUrl, location, type, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
         status = VALUES(status)`,
        [
          project.slug,
          project.title,
          project.subtitle,
          project.description,
          project.heroImage,
          project.heroImageMobile,
          project.aboutImage,
          project.masterplanImage,
          project.caption1,
          project.caption2,
          project.caption3,
          project.gallery,
          project.mapEmbedUrl,
          project.location,
          project.type,
          project.status,
        ]
      );
    }

    console.log('Projects seeded (3 projects)');

    const [projectRows] = await pool.query('SELECT id, slug FROM projects');
    const slugToId: Record<string, number> = {};
    for (const row of projectRows as any[]) {
      slugToId[row.slug] = row.id;
    }

    const videos = [
      {
        projectSlug: 'citra',
        title: 'Cinematic Journey',
        category: 'film',
        thumbnailUrl:
          'https://img.freepik.com/premium-photo/professional-cinema-camera-recording-commercial-studio_237404-9535.jpg',
        videoUrl: 'https://www.youtube.com/embed/EngW7tLk6R8?si=JqVwUbeK03kWJPcE',
        description:
          'A breathtaking visual narrative exploring the depths of human emotion through stunning cinematography and compelling storytelling.',
        aspectRatio: '2.35 / 1',
        sortOrder: 1,
      },
      {
        projectSlug: 'citra',
        title: 'Brand Vision',
        category: 'commercial',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/D0UnqGm_miA?si=0f0PwzfJNJ-CWQpq',
        description:
          'A dynamic commercial piece that captures the essence of modern lifestyle and brand identity.',
        aspectRatio: '16 / 9',
        sortOrder: 2,
      },
      {
        projectSlug: 'citra',
        title: 'Documentary Truth',
        category: 'documentary',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description:
          'An intimate documentary exploring real stories and authentic human experiences.',
        aspectRatio: '16 / 9',
        sortOrder: 3,
      },
      {
        projectSlug: 'citra',
        title: 'Musical Harmony',
        category: 'music',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/u_sIfs7Yom4?si=MOYOivOMl5mAc-wk',
        description:
          'A vibrant music video that blends visual artistry with rhythmic storytelling.',
        aspectRatio: '1 / 1',
        sortOrder: 4,
      },
    ];

    await pool.query('DELETE FROM project_videos');
    for (const video of videos) {
      const projectId = slugToId[video.projectSlug];
      if (!projectId) continue;

      await pool.query(
        `INSERT INTO project_videos (projectId, title, category, thumbnailUrl, videoUrl, description, aspectRatio, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          video.title,
          video.category || '',
          video.thumbnailUrl,
          video.videoUrl,
          video.description || '',
          video.aspectRatio || null,
          video.sortOrder ?? 0,
        ]
      );
    }

    const leads = [
      {
        name: 'Ahmed Hassan',
        phone: '+20 100 123 4567',
        email: 'ahmed.hassan@example.com',
        job_title: 'Business Owner',
        preferred_contact_way: 'call',
        unit_type: 'Retail Space',
        projectSlug: 'citra',
        status: 'new',
        message:
          'Interested in retail space options at Once Mall. Please contact me.',
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
        unit_type: 'Shop / Retail Unit',
        projectSlug: 'citra',
        status: 'new',
        message:
          'Need information about shop availability, areas, and payment plans at Once Mall.',
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

    console.log(`Leads seeded (${leads.length} sample leads)`);
    console.log('Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
