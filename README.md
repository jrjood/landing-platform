docker compose up -d --build

# Landing Platform - Subdomain Real Estate Projects

A complete production-ready monorepo for a subdomain landing platform with 3 project landing pages, lead capture, and an admin dashboard to manage leads and project content.

## 🏗️ Project Structure

```
landing-platform/
├── apps/
│   ├── api/          # Express + TypeScript backend
│   └── web/          # React + Vite frontend
├── db/               # Database schema and seeds
├── package.json      # Root workspace config
└── README.md
```

## 🚀 Features

### Public Features

- **Dynamic Landing Pages**: 3 separate project landing pages (proj-a, proj-b, proj-c)
- **Hero Section**: Eye-catching hero with project name, tagline, and CTA
- **Project Details**: Location, delivery date, payment plan, starting price
- **Image Gallery**: Lightbox/modal for project images
- **Google Maps Integration**: Embedded map for project location
- **FAQ Section**: Expandable FAQ accordion
- **Lead Capture Form**: Comprehensive form with validation

### Admin Dashboard

- **JWT Authentication**: Secure login with bcrypt password hashing
- **Leads Management**:
  - View all leads with pagination
  - Search by name/phone/email
  - Filter by project, unit type, and status
  - Update lead status and add notes
  - Export leads to CSV
- **Projects Management**:
  - Edit project content (text, images, FAQs)
  - Update project details
  - Manage gallery and highlights

### Technical Features

- **TypeScript**: Full type safety across frontend and backend
- **MySQL Database**: Production-ready schema with indexes
- **Rate Limiting**: Protection against abuse
- **Form Validation**: Zod schemas on both frontend and backend
- **Responsive Design**: Mobile-first with Tailwind CSS
- **SEO Optimized**: React Helmet for meta tags
- **Toast Notifications**: User feedback with Sonner

## 📋 Prerequisites

- Node.js 18+ and npm
- MySQL 5.7+ or MySQL 8.0
- phpMyAdmin (for database management)

## 🛠️ Local Development Setup

### 1. Clone and Install Dependencies

```bash
cd landing-platform
npm install
cd apps/api
npm install
cd ../web
npm install
cd ../..
```

### 2. Database Setup

#### Option A: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Create a new database named `landing_platform`
3. Import `db/schema.sql` to create tables
4. Import `db/seed.sql` to add sample data

#### Option B: Using MySQL CLI

```bash
mysql -u root -p
CREATE DATABASE landing_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE landing_platform;
SOURCE db/schema.sql;
SOURCE db/seed.sql;
```

### 3. Configure Environment Variables

#### API Environment (apps/api/.env)

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env`:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=landing_platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin (for seeding)
ADMIN_EMAIL=admin@landingplatform.com
ADMIN_PASSWORD=Admin@123456

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Web Environment (apps/web/.env)

```bash
cd apps/web
cp .env.example .env
```

Edit `apps/web/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Admin User (Optional)

If you want to create an admin user programmatically:

```bash
cd apps/api
npm run seed
```

This creates an admin user with credentials from your `.env` file.

### 5. Start Development Servers

Open two terminal windows:

**Terminal 1 - API Server:**

```bash
cd apps/api
npm run dev
```

API runs on http://localhost:5000

**Terminal 2 - Web Server:**

```bash
cd apps/web
npm run dev
```

Web runs on http://localhost:5173

### 6. Access the Application

- **Homepage**: http://localhost:5173
- **Project Pages**:
  - http://localhost:5173/proj-a
  - http://localhost:5173/proj-b
  - http://localhost:5173/proj-c
- **Admin Login**: http://localhost:5173/admin/login
  - Email: `admin@landingplatform.com`
  - Password: `Admin@123456`

## 🌐 Production Deployment (cPanel)

### Prerequisites

- cPanel hosting with Node.js support (or separate API hosting)
- MySQL database access
- FTP/File Manager access
- Custom subdomain configured (e.g., `sub.domain.com`)

### Step 1: Database Setup

1. **Create MySQL Database** in cPanel:

   - Go to MySQL Databases
   - Create database: `username_landing_platform`
   - Create user and grant all privileges
   - Note down: database name, username, password, host

2. **Import Schema** via phpMyAdmin:
   - Open phpMyAdmin from cPanel
   - Select your database
   - Click "Import" tab
   - Upload and execute `db/schema.sql`
   - Upload and execute `db/seed.sql`

### Step 2: Deploy Frontend (SPA)

1. **Build the React App**:

```bash
cd apps/web
# Update .env for production
echo "VITE_API_URL=https://yourdomain.com/api" > .env
npm run build
```

2. **Upload to cPanel**:

   - The build creates a `dist` folder
   - Upload all contents of `apps/web/dist/` to your subdomain's document root
   - Example: `/home/username/public_html/sub.domain.com/`

3. **Create `.htaccess`** in the document root:

Create file: `/home/username/public_html/sub.domain.com/.htaccess`

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### Step 3: Deploy Backend API

#### Option A: cPanel Node.js App (Recommended if available)

1. **Build the API**:

```bash
cd apps/api
npm run build
```

2. **Upload API Files**:

   - Upload entire `apps/api` folder to a directory like `/home/username/landing-api/`
   - Upload node_modules or run `npm install --production` on server

3. **Setup Node.js App in cPanel**:

   - Go to "Setup Node.js App"
   - Click "Create Application"
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `/home/username/landing-api`
   - Application URL: Choose subdomain or path
   - Application startup file: `dist/index.js`
   - Click "Create"

4. **Set Environment Variables** in cPanel Node.js interface:

```
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=username_dbuser
DB_PASSWORD=your_db_password
DB_NAME=username_landing_platform
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://sub.domain.com
```

5. **Start the Application** and note the port number

6. **Setup Reverse Proxy** (if needed):
   Create/edit `.htaccess` in web root to proxy `/api` requests:

```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:PORT/api/$1 [P,L]
```

#### Option B: External API Hosting

If cPanel doesn't support Node.js:

1. Deploy API to external service:

   - Heroku
   - Railway.app
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk
   - Google Cloud Run

2. Update frontend environment variable to point to external API:

```env
VITE_API_URL=https://your-api-service.herokuapp.com/api
```

3. Update CORS settings in API to allow your subdomain

### Step 4: Verify Deployment

1. **Test Frontend**:

   - Visit `https://sub.domain.com`
   - Navigate to project pages
   - Submit a test lead

2. **Test API**:

   - Visit `https://sub.domain.com/api/health` (or your API URL)
   - Should return `{"status":"ok","timestamp":"..."}`

3. **Test Admin**:
   - Visit `https://sub.domain.com/admin/login`
   - Login with admin credentials
   - Verify leads appear
   - Test CSV export

### Step 5: Post-Deployment

1. **Change Admin Password**:

   - Login to phpMyAdmin
   - Update password hash in `admin_users` table
   - Or use bcrypt online tool to generate new hash

2. **Update JWT Secret**:

   - Generate strong random secret
   - Update in API environment variables
   - Restart API application

3. **Enable HTTPS**:

   - Most cPanel includes free Let's Encrypt SSL
   - Go to SSL/TLS Status
   - Install certificate for subdomain

4. **Test from Multiple Devices**:
   - Mobile phones
   - Different browsers
   - Test lead submission

## 📊 Database Schema

### Tables

#### `admin_users`

- `id` - Primary key
- `email` - Unique admin email
- `password_hash` - Bcrypt hashed password
- `role` - User role (default: 'admin')
- `created_at`, `updated_at` - Timestamps

#### `projects`

- `id` - Primary key
- `slug` - Unique URL slug (e.g., 'proj-a')
- `name` - Project name
- `tagline` - Short tagline
- `description` - Full description
- `location_text` - Location name
- `map_embed_url` - Google Maps embed URL
- `delivery_date` - Expected delivery
- `payment_plan` - Payment plan details
- `starting_price` - Starting price
- `highlights` - JSON array of features
- `gallery` - JSON array of images
- `faqs` - JSON array of FAQs
- `created_at`, `updated_at` - Timestamps

#### `leads`

- `id` - Primary key
- `project_slug` - Related project
- `name` - Lead name (required)
- `phone` - Phone number (required)
- `email` - Email (optional)
- `job_title` - Job title (optional)
- `preferred_contact_way` - 'whatsapp' or 'call' (required)
- `unit_type` - Selected unit type (required)
- `status` - 'new', 'contacted', 'qualified', 'closed', 'spam'
- `notes` - Admin notes
- `source_url` - Page URL where lead submitted
- `created_at`, `updated_at` - Timestamps

## 🔐 API Endpoints

### Public Endpoints

- `GET /api/projects` - Get all projects
- `GET /api/projects/:slug` - Get project by slug
- `POST /api/leads` - Create new lead (rate limited)
- `GET /api/health` - Health check

### Admin Endpoints (JWT Required)

- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/leads` - Get leads with filters
- `GET /api/admin/leads/:id` - Get single lead
- `PATCH /api/admin/leads/:id` - Update lead
- `GET /api/admin/leads/export/csv` - Export CSV
- `GET /api/admin/projects` - Get all projects
- `PUT /api/admin/projects/:slug` - Update project

## 🎨 Customization

### Add New Unit Type

Edit `apps/web/src/components/LeadForm.tsx`:

```typescript
const UNIT_TYPES = [
  'Town House',
  'Twin House',
  'Standalone Villa',
  'Apartment',
  'Duplex',
  'Studio',
  'Penthouse', // Add new type
];
```

### Change Theme Colors

Edit `apps/web/src/index.css` - Update CSS variables in `:root`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change primary color */
  /* ... other colors ... */
}
```

### Add New Project

1. Insert into database via phpMyAdmin or SQL:

```sql
INSERT INTO projects (slug, name, tagline, ...) VALUES (...);
```

2. Or use admin dashboard to duplicate and edit existing project

## 🐛 Troubleshooting

### Database Connection Error

- Verify database credentials in `.env`
- Check if MySQL service is running
- Ensure database user has proper privileges
- Test connection: `mysql -h localhost -u username -p`

### CORS Errors

- Update `CORS_ORIGIN` in API `.env` to match frontend URL
- Ensure API server is running and accessible

### React Router 404 on Refresh

- Verify `.htaccess` is present in web document root
- Check Apache mod_rewrite is enabled
- Ensure RewriteBase is correct

### API Not Accessible

- Check API server is running
- Verify firewall allows traffic on API port
- Test API directly: `curl http://localhost:5000/api/health`

### Admin Login Fails

- Verify admin user exists in database
- Check password hash is correct
- Ensure JWT_SECRET is set in API environment

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For support, email your-support@email.com

---

**Built with ❤️ using React, TypeScript, Node.js, Express, and MySQL**
