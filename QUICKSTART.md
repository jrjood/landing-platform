# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# Install API dependencies
cd apps/api && npm install && cd ../..

# Install Web dependencies
cd apps/web && npm install && cd ../..
```

### 2. Setup Database

**Using phpMyAdmin:**

1. Create database: `landing_platform`
2. Import: `db/schema.sql`
3. Import: `db/seed.sql`

**Using MySQL CLI:**

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p landing_platform < db/seed.sql
```

### 3. Configure Environment

**API (.env in apps/api/):**

```bash
cd apps/api
cp .env.example .env
# Edit .env with your database credentials
```

**Web (.env in apps/web/):**

```bash
cd apps/web
cp .env.example .env
# Default values should work for local development
```

### 4. Start Development

**Terminal 1 - API:**

```bash
cd apps/api
npm run dev
```

**Terminal 2 - Web:**

```bash
cd apps/web
npm run dev
```

### 5. Access the App

- **Homepage**: http://localhost:5173
- **Project A**: http://localhost:5173/proj-a
- **Project B**: http://localhost:5173/proj-b
- **Project C**: http://localhost:5173/proj-c
- **Admin**: http://localhost:5173/admin/login
  - Email: `admin@landingplatform.com`
  - Password: `Admin@123456`

## 🎯 Testing the Application

### Test Public Features

1. Browse to http://localhost:5173
2. Click on a project card
3. Scroll through the landing page
4. Fill out the lead form
5. Submit and check for success toast

### Test Admin Features

1. Login at http://localhost:5173/admin/login
2. View leads in the dashboard
3. Use search and filters
4. Click on a lead to view details
5. Update status and add notes
6. Export leads to CSV
7. Navigate to Projects tab
8. Edit a project's content

## 📦 Production Build

### Build for Production

**API:**

```bash
cd apps/api
npm run build
# Output in dist/
```

**Web:**

```bash
cd apps/web
npm run build
# Output in dist/
```

## 🔧 Common Commands

```bash
# Development
npm run dev:api      # Start API dev server
npm run dev:web      # Start Web dev server

# Build
npm run build:api    # Build API
npm run build:web    # Build Web
npm run build        # Build both

# Seed database (after setting up .env)
cd apps/api
npm run seed
```

## 📝 Project URLs

When deployed to subdomain (e.g., sub.domain.com):

- `sub.domain.com/` - Homepage with project cards
- `sub.domain.com/proj-a` - Project A landing page
- `sub.domain.com/proj-b` - Project B landing page
- `sub.domain.com/proj-c` - Project C landing page
- `sub.domain.com/admin/login` - Admin login
- `sub.domain.com/admin/leads` - Leads management
- `sub.domain.com/admin/projects` - Projects management

## 🛟 Need Help?

Check the main README.md for:

- Detailed deployment instructions
- Troubleshooting guide
- API documentation
- Customization options
