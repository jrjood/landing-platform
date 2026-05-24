import dotenv from 'dotenv';
import { pool } from '../config/database';
import { projectService } from '../services/projectService';

dotenv.config();

async function seed() {
  try {
    console.log('Starting database seed...');

    const adminUser = {
      email: 'admin@wealthholding-eg.com',
      passwordHash:
        '$2b$10$b3lLhGHzpB5.J.0HHybTb.4NgSgh8L2.jqSZruKD89.VPnTjGn49y', // current live hash
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

    await pool.query(
      `INSERT INTO developers (
        slug, name, description, headline, logoUrl, showcaseImageUrl,
        yearsOfExperience, projectsDelivered, happyFamilies, brandColor,
        contactEmail, contactPhone, websiteUrl, socialLinks, seoTitle, seoDescription
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
       contactEmail = VALUES(contactEmail),
       contactPhone = VALUES(contactPhone),
       websiteUrl = VALUES(websiteUrl),
       socialLinks = VALUES(socialLinks),
       seoTitle = VALUES(seoTitle),
       seoDescription = VALUES(seoDescription)`,
      [
        'wealth-holding',
        'Wealth Holding Developments',
        'Wealth Holding Developments creates premium residential communities with an emphasis on green planning, clear sales journeys, and long-term asset value.',
        'Built on Trust. Driven by Excellence.',
        '/logo-black.png',
        '/Citra/about-bg.jpg',
        '25+',
        '50+',
        '20,000+',
        '#9B6D2C',
        'sales@wealthholding-eg.com',
        '19640',
        'https://wealthholding-eg.com',
        JSON.stringify({
          facebook: 'https://www.facebook.com/WealthHolding/',
          instagram: 'https://www.instagram.com/wealthholding/',
          linkedin: 'https://www.linkedin.com/company/wealth-holding-developments/',
        }),
        'Wealth Holding Developments',
        'Premium real-estate developer behind Citra Residence and campaign-ready residential communities.',
      ]
    );

    const [developerRows] = await pool.query<any[]>(
      'SELECT id FROM developers WHERE slug = ? LIMIT 1',
      ['wealth-holding']
    );
    const wealthDeveloperId = developerRows[0]?.id || null;

    const projects = [
      {
        slug: 'citra',
        subdomain: 'citra',
        title: 'Citra',
        subtitle: 'The Heart of the Green, The Breath of the Land',
        description:
          "Citra Residence - New Zayed is Wealth Holding's first villa residential development in West Cairo. Spanning over 30 acres with 85% dedicated to greenery and water features, Citra offers a calm, private, and well-balanced living environment. Inspired by the symbolism of citrine - the stone of the sun and wealth - Citra reflects a lifestyle where value is defined by space, light, serenity, and lasting legacy.",
        seoTitle: 'Citra New Zayed Villas | Wealth Holding Developments',
        seoDescription:
          'Explore Citra Residence in New Zayed: a green villa community by Wealth Holding with campaign details, gallery, location, and inquiry form.',
        ogTitle: 'Citra New Zayed Villas',
        ogDescription:
          'A dedicated campaign landing page for Citra Residence in New Zayed.',
        ogImage: '/Citra/hero.jpg',
        canonicalUrl: 'https://citra.wealthholding-eg.com/',
        landingVisibility: 'public',
        formSettings: JSON.stringify({
          preferredContactWay: 'whatsapp',
          source: 'citra-campaign',
        }),
        heroImage: '/Citra/hero.jpg',
        heroImageMobile: '/Citra/heromob.jpg',
        aboutImage: '/Citra/about-bg.jpg',
        masterplanImage: '/Citra/mplan.jpeg',
        caption1: 'Immerse yourself in',
        caption2: 'At the heart of green revolution',
        caption3: 'Terraced outdoor experiences for F&B',
        gallery: JSON.stringify([
          { url: '/Citra/stand alone FRONT ELEVATION WITH DOUBLE HEIGHT.jpg', alt: 'StandAlone Villa, FRONT ELEVATION WITH DOUBLE HEIGHT' },
          { url: '/Citra/stand alone BACK ELEVATION.jpg', alt: 'StandAlone Villa, BACK ELEVATION' },
          { url: '/Citra/stand alone FRONT ELEVATION WITHOUT DOUBLE HEIGHT.jpg', alt: 'StandAlone Villa, FRONT ELEVATION WITHOUT DOUBLE HEIGHT' },
          { url: '/Citra/twin FRONT ELEVATION WITH DOUBLE HEIGHT.jpg', alt: 'Twin Villa, FRONT ELEVATION WITH DOUBLE HEIGHT' },
          { url: '/Citra/twin BACK ELEVATION.jpg', alt: 'Twin Villa, BACK ELEVATION' },
          { url: '/Citra/twin FRONT ELEVATION WITHOUT DOUBLE HEIGHT.jpg', alt: 'Twin Villa, FRONT ELEVATION WITHOUT DOUBLE HEIGHT' },
          { url: '/Citra/town front elevation.jpg', alt: 'Town Villa, FRONT ELEVATION' },
          { url: '/Citra/town back elevation.jpg', alt: 'Town Villa, BACK ELEVATION' },
        ]),
        brochureUrl: '/Citra Brochure.pdf',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34520.12345678901!2d30.987654!3d30.033333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840e49182c1df%3A0xabcd1234ef567890!2sSheikh%20Zayed%20City%2C%20Giza%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1700000000000',
        locationImage: '/Citra/location.jpg',
        locationText: 'New Zayed, West Cairo, Egypt',
        location: 'New Zayed, West Cairo, Egypt',
        type: 'Residential',
        status: 'Launching',
      },
      {
        slug: 'nile-view-residence',
        subdomain: null,
        title: 'Nile View Residence',
        subtitle: 'Luxury Apartments with Stunning Nile Views',
        description:
          'Experience unparalleled luxury living with breathtaking views of the Nile River. Premium finishes, world-class amenities, and strategic location.',
        seoTitle: 'Nile View Residence | Wealth Holding Developments',
        seoDescription:
          'Luxury apartments with Nile views, premium finishes, amenities, and lead capture.',
        ogTitle: 'Nile View Residence',
        ogDescription: 'Luxury apartments with stunning Nile views.',
        ogImage:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
        canonicalUrl: null,
        landingVisibility: 'public',
        formSettings: '{}',
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
        brochureUrl: '',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.2456789!2d31.2233!3d30.0626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c0!2sZamalek%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1234567890',
        locationImage:
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop',
        locationText: 'Zamalek, Cairo',
        location: 'Zamalek, Cairo',
        type: 'Residential',
        status: 'Ready to Move',
      },
      {
        slug: 'alexandria-coastal-resort',
        subdomain: null,
        title: 'Alexandria Coastal Resort',
        subtitle: 'Beachfront Paradise on the Mediterranean',
        description:
          'A luxurious coastal resort featuring private beach access, recreational facilities, and stunning Mediterranean views. Perfect for vacation homes and investment.',
        seoTitle: 'Alexandria Coastal Resort | Wealth Holding Developments',
        seoDescription:
          'A beachfront resort campaign landing page with private beach access and Mediterranean views.',
        ogTitle: 'Alexandria Coastal Resort',
        ogDescription: 'Beachfront resort homes on the Mediterranean.',
        ogImage:
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
        canonicalUrl: null,
        landingVisibility: 'public',
        formSettings: '{}',
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
        brochureUrl: '',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.123456!2d29.9!3d31.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c5!2sNorth%20Coast%2C%20Egypt!5e0!3m2!1sen!2seg!4v1234567890',
        locationImage:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
        locationText: 'North Coast, Alexandria',
        location: 'North Coast, Alexandria',
        type: 'Resort',
        status: 'Under Construction',
      },
    ];

    for (const project of projects) {
      await pool.query(
        `INSERT INTO projects (slug, subdomain, developerId, title, subtitle, description, seoTitle, seoDescription, ogTitle, ogDescription, ogImage, canonicalUrl, landingVisibility, formSettings, heroImage, heroImageMobile, aboutImage, masterplanImage, caption1, caption2, caption3, gallery, brochureUrl, mapEmbedUrl, locationImage, locationText, location, type, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         subdomain = VALUES(subdomain),
         developerId = VALUES(developerId),
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
         brochureUrl = VALUES(brochureUrl),
         mapEmbedUrl = VALUES(mapEmbedUrl),
         locationImage = VALUES(locationImage),
         locationText = VALUES(locationText),
         location = VALUES(location),
         type = VALUES(type),
         status = VALUES(status)`,
        [
          project.slug,
          project.subdomain,
          wealthDeveloperId,
          project.title,
          project.subtitle,
          project.description,
          project.seoTitle,
          project.seoDescription,
          project.ogTitle,
          project.ogDescription,
          project.ogImage,
          project.canonicalUrl,
          project.landingVisibility,
          project.formSettings,
          project.heroImage,
          project.heroImageMobile,
          project.aboutImage,
          project.masterplanImage,
          project.caption1,
          project.caption2,
          project.caption3,
          project.gallery,
          project.brochureUrl,
          project.mapEmbedUrl,
          project.locationImage,
          project.locationText,
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

    const projectTestData: Record<string, any> = {
      citra: {
        highlights: [
          {
            label: 'Prime Location',
            value: 'New Zayed',
            icon: 'map-pin',
            sortOrder: 1,
          },
          {
            label: 'Villa Community',
            value: 'Standalone, twin, and town villas',
            icon: 'home',
            sortOrder: 2,
          },
          {
            label: 'Green Living',
            value: '85% greenery and water',
            icon: 'trees',
            sortOrder: 3,
          },
        ],
        amenities: [
          {
            slug: 'citra-gated-villa-community',
            name: 'Gated villa community',
            icon: 'shield',
            category: 'Security',
            description: 'Controlled entries and quieter residential clusters.',
            sortOrder: 1,
          },
          {
            slug: 'citra-85-greenery',
            name: '85% greenery and water',
            icon: 'trees',
            category: 'Landscape',
            description: 'Large open spaces, green corridors, and water features.',
            sortOrder: 2,
          },
          {
            slug: 'citra-family-parks',
            name: 'Family parks',
            icon: 'family',
            category: 'Lifestyle',
            description: 'Outdoor spaces planned for children and family gatherings.',
            sortOrder: 3,
          },
          {
            slug: 'citra-clubhouse',
            name: 'Clubhouse',
            icon: 'coffee',
            category: 'Lifestyle',
            description: 'A social hub for residents, casual meetings, and daily services.',
            sortOrder: 4,
          },
          {
            slug: 'citra-fitness-track',
            name: 'Fitness and jogging track',
            icon: 'dumbbell',
            category: 'Wellness',
            description: 'Active routes and wellness zones across the compound.',
            sortOrder: 5,
          },
          {
            slug: 'citra-bike-lanes',
            name: 'Cycling lanes',
            icon: 'bike',
            category: 'Wellness',
            description: 'Safe internal movement for bikes and light mobility.',
            sortOrder: 6,
          },
          {
            slug: 'citra-retail-strip',
            name: 'Boutique retail strip',
            icon: 'shopping',
            category: 'Convenience',
            description: 'Daily essentials and selected F&B close to home.',
            sortOrder: 7,
          },
          {
            slug: 'citra-smart-connectivity',
            name: 'Smart connectivity',
            icon: 'wifi',
            category: 'Convenience',
            description: 'Modern infrastructure for connected home services.',
            sortOrder: 8,
          },
        ],
        paymentPlans: [
          {
            title: 'Launch Plan',
            downPayment: '10%',
            installments: 'Equal quarterly installments',
            years: '8 years',
            deliveryDate: '2029',
            startingPrice: 'EGP 18.5M',
            promotionalOffer: 'Limited launch allocation',
            badge: 'Most flexible',
            sortOrder: 1,
          },
        ],
        media: [
          {
            url: '/Citra/hero.jpg',
            thumbnailUrl: '/Citra/hero.jpg',
            altText: 'Citra hero view',
            title: 'Hero View',
            type: 'image',
            category: 'hero',
            width: 1600,
            height: 900,
            sortOrder: 1,
          },
          {
            url: '/Citra/mplan.jpeg',
            thumbnailUrl: '/Citra/mplan.jpeg',
            altText: 'Citra master plan',
            title: 'Master Plan',
            type: 'masterplan',
            category: 'masterplan',
            width: 1600,
            height: 1200,
            sortOrder: 2,
          },
          {
            url: '/Citra Brochure.pdf',
            altText: 'Citra brochure',
            title: 'Citra Brochure',
            type: 'brochure',
            category: 'brochure',
            mimeType: 'application/pdf',
            sortOrder: 3,
          },
          {
            url: '/Citra/twin FRONT ELEVATION WITH DOUBLE HEIGHT.jpg',
            thumbnailUrl: '/Citra/twin FRONT ELEVATION WITH DOUBLE HEIGHT.jpg',
            altText: 'Twin villa front elevation',
            title: 'Twin Villa Front',
            type: 'image',
            category: 'gallery',
            width: 1400,
            height: 900,
            sortOrder: 4,
          },
        ],
      },
      'nile-view-residence': {
        highlights: [
          {
            label: 'Nile Views',
            value: 'Waterfront apartments',
            icon: 'waves',
            sortOrder: 1,
          },
          {
            label: 'Connected Address',
            value: 'Downtown Cairo',
            icon: 'map-pin',
            sortOrder: 2,
          },
          {
            label: 'Ready Lifestyle',
            value: 'Premium amenities',
            icon: 'sparkles',
            sortOrder: 3,
          },
        ],
        amenities: [
          {
            slug: 'nile-river-views',
            name: 'Panoramic Nile views',
            icon: 'waves',
            category: 'Views',
            description: 'Wide river-facing terraces and bright living areas.',
            sortOrder: 1,
          },
          {
            slug: 'nile-concierge',
            name: 'Concierge service',
            icon: 'sparkles',
            category: 'Services',
            description: 'Resident support for daily comfort and guest arrivals.',
            sortOrder: 2,
          },
          {
            slug: 'nile-secure-entry',
            name: 'Secure entry',
            icon: 'shield',
            category: 'Security',
            description: 'Controlled access and monitored common areas.',
            sortOrder: 3,
          },
          {
            slug: 'nile-lounge',
            name: 'Resident lounge',
            icon: 'coffee',
            category: 'Lifestyle',
            description: 'Shared spaces for work, meetings, and hosting.',
            sortOrder: 4,
          },
        ],
        paymentPlans: [
          {
            title: 'City Residence Plan',
            downPayment: '15%',
            installments: 'Monthly installments',
            years: '5 years',
            deliveryDate: 'Ready to move',
            startingPrice: 'EGP 12.8M',
            promotionalOffer: 'Immediate inspection available',
            badge: 'Ready',
            sortOrder: 1,
          },
        ],
        media: [
          {
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
            altText: 'Nile View Residence exterior',
            title: 'Exterior',
            type: 'image',
            category: 'gallery',
            width: 1200,
            height: 800,
            sortOrder: 1,
          },
        ],
      },
      'alexandria-coastal-resort': {
        highlights: [
          {
            label: 'Coastal Living',
            value: 'Mediterranean resort',
            icon: 'waves',
            sortOrder: 1,
          },
          {
            label: 'Family Escape',
            value: 'Serviced chalets and villas',
            icon: 'family',
            sortOrder: 2,
          },
          {
            label: 'Resort Amenities',
            value: 'Beach, pools, and dining',
            icon: 'sparkles',
            sortOrder: 3,
          },
        ],
        amenities: [
          {
            slug: 'alex-private-beach',
            name: 'Private beach',
            icon: 'waves',
            category: 'Beach',
            description: 'Direct access to a managed family beach.',
            sortOrder: 1,
          },
          {
            slug: 'alex-landscape-lagoon',
            name: 'Lagoon landscape',
            icon: 'flower',
            category: 'Landscape',
            description: 'Water features and planted resort promenades.',
            sortOrder: 2,
          },
          {
            slug: 'alex-resort-dining',
            name: 'Resort dining',
            icon: 'utensils',
            category: 'Lifestyle',
            description: 'Outdoor dining and clubhouse hospitality.',
            sortOrder: 3,
          },
          {
            slug: 'alex-parking',
            name: 'Resident parking',
            icon: 'car',
            category: 'Convenience',
            description: 'Organized parking close to residential clusters.',
            sortOrder: 4,
          },
        ],
        paymentPlans: [
          {
            title: 'Vacation Home Plan',
            downPayment: '12%',
            installments: 'Quarterly installments',
            years: '7 years',
            deliveryDate: '2027',
            startingPrice: 'EGP 9.6M',
            promotionalOffer: 'Seasonal launch offer',
            badge: 'Resort',
            sortOrder: 1,
          },
        ],
        media: [
          {
            url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop',
            altText: 'Alexandria Coastal Resort beach',
            title: 'Beachfront',
            type: 'image',
            category: 'gallery',
            width: 1200,
            height: 800,
            sortOrder: 1,
          },
        ],
      },
    };

    for (const [slug, relationData] of Object.entries(projectTestData)) {
      const projectId = slugToId[slug];
      if (!projectId) continue;
      await projectService.persistRelations(projectId, relationData);
    }

    console.log('Project relation test data seeded');

    const videos = [
      {
        projectSlug: 'citra',
        title: 'Citra Launch Film',
        category: 'Film',
        thumbnailUrl:
          'https://drive.google.com/thumbnail?id=1H_QeJVTMSzfpnoDFhlXhYazXtuPiUbf2&sz=w1000',
        videoUrl:
          'https://drive.google.com/file/d/1H_QeJVTMSzfpnoDFhlXhYazXtuPiUbf2/view?usp=sharing',
        description:
          'Citra Residence - New Zayed is Wealth Holding\'s first villa residential development in West Cairo.\nSpanning over 30 acres with 85% dedicated to greenery and water features, Citra offers a calm, private, and well-balanced living environment.',
        aspectRatio: '16 / 9',
        sortOrder: 1,
      },
      {
        projectSlug: 'citra',
        title: 'Citra Villa Walkthrough',
        category: 'Walkthrough',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description:
          'A placeholder walkthrough video for testing multiple video cards and active video states.',
        aspectRatio: '16 / 9',
        sortOrder: 2,
      },
      {
        projectSlug: 'nile-view-residence',
        title: 'Nile View Residence Preview',
        category: 'Preview',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description:
          'Seeded video row for checking the media panel on non-Citra projects.',
        aspectRatio: '16 / 9',
        sortOrder: 1,
      },
      {
        projectSlug: 'alexandria-coastal-resort',
        title: 'Coastal Resort Teaser',
        category: 'Teaser',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description:
          'Seeded teaser video for checking resort media content.',
        aspectRatio: '16 / 9',
        sortOrder: 1,
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
        name: 'Asiya Hosny',
        phone: '01013559895',
        email: 'Asiahosny4@gmail.com',
        job_title: null,
        preferred_contact_way: 'whatsapp',
        unit_type: 'Twin Villa',
        projectSlug: 'citra',
        status: 'qualified',
        message: null,
        campaign: 'citra-launch',
        utm_source: 'facebook',
        utm_medium: 'paid-social',
        utm_campaign: 'citra-new-zayed',
        source_url: 'https://citra.wealthholding-eg.com/?utm_source=facebook',
        landing_host: 'citra.wealthholding-eg.com',
      },
      {
        name: 'Youssif Emad',
        phone: '01105063763',
        email: 'youssifbebo@gmail.com',
        job_title: null,
        preferred_contact_way: 'whatsapp',
        unit_type: null,
        projectSlug: 'citra',
        status: 'new',
        message: null,
        campaign: 'citra-launch',
        utm_source: 'google',
        utm_medium: 'search',
        utm_campaign: 'new-zayed-villas',
        source_url: 'https://citra.wealthholding-eg.com/?utm_source=google',
        landing_host: 'citra.wealthholding-eg.com',
      },
      {
        name: 'Mariam Adel',
        phone: '01000000003',
        email: 'mariam.test@example.com',
        job_title: 'Interior Designer',
        preferred_contact_way: 'call',
        unit_type: 'Standalone Villa',
        projectSlug: 'citra',
        status: 'contacted',
        message: 'Interested in the launch phase and available corner plots.',
        campaign: 'citra-launch',
        utm_source: 'instagram',
        utm_medium: 'paid-social',
        utm_campaign: 'villa-leads',
        source_url: 'https://citra.wealthholding-eg.com/gallery',
        landing_host: 'citra.wealthholding-eg.com',
      },
      {
        name: 'Omar Nabil',
        phone: '01000000004',
        email: 'omar.test@example.com',
        job_title: 'Investor',
        preferred_contact_way: 'whatsapp',
        unit_type: 'Apartment',
        projectSlug: 'nile-view-residence',
        status: 'closed',
        message: 'Requested ready-to-move payment details.',
        campaign: 'nile-ready-to-move',
        utm_source: 'newsletter',
        utm_medium: 'email',
        utm_campaign: 'ready-units',
        source_url: 'https://wealthholding-eg.com/projects/nile-view-residence',
        landing_host: 'wealthholding-eg.com',
      },
    ];

    await pool.query('DELETE FROM leads WHERE email IN (?)', [
      leads.map((lead) => lead.email),
    ]);

    for (const lead of leads) {
      const projectId = lead.projectSlug
        ? slugToId[lead.projectSlug] || null
        : null;
      await pool.query(
        `INSERT INTO leads (name, phone, email, job_title, preferred_contact_way, unit_type, message, projectId, status, campaign, utm_source, utm_medium, utm_campaign, source_url, landing_host)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          lead.campaign,
          lead.utm_source,
          lead.utm_medium,
          lead.utm_campaign,
          lead.source_url,
          lead.landing_host,
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
