# 📚 Landing Platform - Documentation Index

Welcome to the Landing Platform! This index will help you find the right documentation for your needs.

## 🚀 Getting Started (Pick Your Path)

### I want to run this locally right now

👉 **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide

### I want to understand the project first

👉 **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete overview of features

### I want to deploy to production

👉 **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment guide

### I want to understand the architecture

👉 **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flow

### I want detailed documentation

👉 **[README.md](README.md)** - Complete documentation with all details

## 📂 Directory Guide

### `/apps/api/` - Backend Application

**Tech:** Node.js + Express + TypeScript + MySQL

**Key Files:**

- `src/index.ts` - Express server setup
- `src/config/database.ts` - MySQL connection
- `src/middleware/auth.ts` - JWT authentication
- `src/routes/` - API endpoints
- `src/schemas/validation.ts` - Zod validation schemas
- `.env.example` - Environment template

**Documentation:**

- Setup: [README.md](README.md#api-environment)
- Endpoints: [README.md](README.md#api-endpoints)

### `/apps/web/` - Frontend Application

**Tech:** React + TypeScript + Vite + Tailwind CSS

**Key Files:**

- `src/main.tsx` - App entry point
- `src/pages/` - Route components
- `src/components/` - Reusable components
- `src/lib/api.ts` - API client
- `.env.example` - Environment template

**Documentation:**

- Setup: [README.md](README.md#web-environment)
- Customization: [README.md](README.md#customization)

### `/db/` - Database Files

**Files:**

- `schema.sql` - Database structure (import first)
- `seed.sql` - Sample data (import second)
- `README.md` - Database setup instructions

**Documentation:**

- Setup: [db/README.md](db/README.md)
- Schema: [README.md](README.md#database-schema)

## 🛠️ Common Tasks

### First Time Setup

1. Run `setup.bat` (Windows) or `./setup.sh` (Mac/Linux)
2. Follow [db/README.md](db/README.md) for database
3. Configure `.env` files
4. Start dev servers

### Development

```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Web
cd apps/web
npm run dev
```

### Building for Production

```bash
# API
cd apps/api
npm run build

# Web
cd apps/web
npm run build
```

### Adding a New Project

1. Option A: Use admin dashboard at `/admin/projects`
2. Option B: Insert into `projects` table via phpMyAdmin

### Adding a Unit Type

Edit: `apps/web/src/components/LeadForm.tsx`

```typescript
const UNIT_TYPES = [
  'Town House',
  'Twin House',
  // Add your type here
];
```

### Changing Theme Colors

Edit: `apps/web/src/index.css` (CSS variables in `:root`)

### Exporting Leads

Admin Dashboard → Leads → Export CSV button

## 🔍 Finding Specific Information

### Security

- JWT Setup: [README.md](README.md#authentication-flow)
- Password Hashing: [ARCHITECTURE.md](ARCHITECTURE.md#security-layers)
- Rate Limiting: `apps/api/src/index.ts`

### Database

- Schema: [db/schema.sql](db/schema.sql)
- Setup: [db/README.md](db/README.md)
- Seed Data: [db/seed.sql](db/seed.sql)

### API Endpoints

- List: [README.md](README.md#api-endpoints)
- Public: `apps/api/src/routes/projects.ts`, `leads.ts`
- Admin: `apps/api/src/routes/admin/`

### Forms & Validation

- Lead Form: `apps/web/src/components/LeadForm.tsx`
- Validation Schemas: `apps/api/src/schemas/validation.ts`
- Unit Types: `apps/web/src/components/LeadForm.tsx`

### UI Components

- Location: `apps/web/src/components/ui/`
- Based on: shadcn/ui patterns
- Styling: Tailwind CSS

### Authentication

- Context: `apps/web/src/contexts/AuthContext.tsx`
- Protected Routes: `apps/web/src/components/ProtectedRoute.tsx`
- Login: `apps/web/src/pages/admin/AdminLoginPage.tsx`

## 📋 Checklists

### Pre-Development Checklist

- [ ] Node.js 18+ installed
- [ ] MySQL installed and running
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)

### Development Checklist

- [ ] Dependencies installed (`setup.bat` or `setup.sh`)
- [ ] Database created and seeded
- [ ] `.env` files configured
- [ ] API server running (http://localhost:5000)
- [ ] Web server running (http://localhost:5173)
- [ ] Can login to admin dashboard

### Deployment Checklist

👉 See **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)**

## 🆘 Troubleshooting

### Common Issues

**Database connection failed**

- See: [README.md](README.md#database-connection-error)
- Check: `apps/api/.env` credentials

**CORS errors**

- See: [README.md](README.md#cors-errors)
- Check: `CORS_ORIGIN` in `apps/api/.env`

**404 on page refresh**

- See: [README.md](README.md#react-router-404-on-refresh)
- Check: `.htaccess` file present

**Admin login fails**

- See: [db/README.md](db/README.md#default-admin-credentials)
- Default: admin@landingplatform.com / Admin@123456

**API not accessible**

- See: [README.md](README.md#api-not-accessible)
- Check: API server running on port 5000

## 📞 Support Resources

### Documentation Files

- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick setup
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Feature overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Production deployment
- [db/README.md](db/README.md) - Database setup

### External Resources

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Express: https://expressjs.com
- Tailwind CSS: https://tailwindcss.com
- MySQL: https://dev.mysql.com/doc/

## 📊 Project Stats

**Lines of Code:** ~5,000+
**Files:** 50+
**Components:** 20+
**API Endpoints:** 12
**Database Tables:** 3

## ✅ Feature Checklist

### Public Features

- [x] Homepage with project cards
- [x] 3 Dynamic landing pages
- [x] Hero sections
- [x] Project details display
- [x] Image gallery with lightbox
- [x] Google Maps integration
- [x] FAQ accordions
- [x] Lead capture form
- [x] Form validation
- [x] Toast notifications
- [x] Responsive design
- [x] SEO optimization

### Admin Features

- [x] Secure login
- [x] Leads dashboard
- [x] Search functionality
- [x] Filter by project/status/unit type
- [x] Pagination
- [x] Lead details view
- [x] Status updates
- [x] Notes functionality
- [x] CSV export
- [x] Projects management
- [x] Content editing

### Technical Features

- [x] TypeScript (full coverage)
- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] Rate limiting
- [x] CORS configuration
- [x] Input validation (frontend + backend)
- [x] SQL injection prevention
- [x] Security headers
- [x] Clean architecture
- [x] Monorepo structure

## 🎯 Quick Links

**Local Development:**

- Frontend: http://localhost:5173
- API: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Admin: http://localhost:5173/admin/login

**Sample Projects:**

- Project A: http://localhost:5173/proj-a
- Project B: http://localhost:5173/proj-b
- Project C: http://localhost:5173/proj-c

## 🔄 Version Information

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** December 2024
**Node Version Required:** 18+
**MySQL Version Required:** 5.7+

---

## 💡 Where to Start?

1. **New to the project?** → [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
2. **Want to run locally?** → [QUICKSTART.md](QUICKSTART.md)
3. **Need detailed info?** → [README.md](README.md)
4. **Ready to deploy?** → [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
5. **Want to customize?** → [README.md](README.md#customization)

**Happy coding! 🚀**
