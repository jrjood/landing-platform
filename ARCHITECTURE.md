# System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         React SPA (Vite)                           │    │
│  │                                                     │    │
│  │  Public Pages:         Admin Pages:                │    │
│  │  • /                   • /admin/login              │    │
│  │  • /proj-a             • /admin/leads              │    │
│  │  • /proj-b             • /admin/projects           │    │
│  │  • /proj-c                                         │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS/REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API SERVER                                │
│                  Express + TypeScript                        │
│                                                              │
│  Public Endpoints:              Admin Endpoints:             │
│  GET  /api/projects            POST  /api/admin/auth/login  │
│  GET  /api/projects/:slug      GET   /api/admin/leads       │
│  POST /api/leads               PATCH /api/admin/leads/:id   │
│                                GET   /api/admin/projects    │
│  Middleware:                   PUT   /api/admin/projects/:s │
│  • Rate Limiting                                             │
│  • CORS                        Security:                     │
│  • Helmet                      • JWT Authentication          │
│  • Body Parser                 • bcrypt Password Hashing    │
│                                • Zod Validation             │
└──────────────────────┬───────────────────────────────────────┘
                       │ MySQL Connection (mysql2)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                          │
│                                                              │
│  Tables:                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ admin_users  │  │   projects   │  │    leads     │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ id           │  │ id           │  │ id           │     │
│  │ email        │  │ slug  [UK]   │  │ project_slug │     │
│  │ password_hash│  │ name         │  │ name         │     │
│  │ role         │  │ tagline      │  │ phone        │     │
│  │ created_at   │  │ description  │  │ email        │     │
│  │ updated_at   │  │ location_text│  │ unit_type    │     │
│  └──────────────┘  │ delivery_date│  │ status       │     │
│                    │ highlights   │  │ notes        │     │
│                    │ gallery      │  │ created_at   │     │
│                    │ faqs         │  └──────────────┘     │
│                    │ created_at   │                        │
│                    └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Public User Flow - Lead Submission

```
User visits /proj-a
      │
      ▼
React Router loads ProjectPage component
      │
      ▼
useEffect fetches project data
      │
      ▼
API: GET /api/projects/proj-a
      │
      ▼
MySQL: SELECT * FROM projects WHERE slug = 'proj-a'
      │
      ▼
Return project data (JSON)
      │
      ▼
Page renders with project info
      │
      ▼
User fills lead form
      │
      ▼
Form validation (Zod + react-hook-form)
      │
      ▼
API: POST /api/leads
      │
      ├─→ Rate limit check (5 per hour)
      │
      ├─→ Honeypot check
      │
      ├─→ Server-side validation (Zod)
      │
      ▼
MySQL: INSERT INTO leads (...)
      │
      ▼
Return success response
      │
      ▼
Toast notification: "Success!"
```

### Admin Flow - View Leads

```
Admin visits /admin/leads
      │
      ▼
ProtectedRoute checks authentication
      │
      ├─→ No token? Redirect to /admin/login
      │
      ▼
Token exists, verify with JWT
      │
      ▼
Render AdminLeadsPage
      │
      ▼
API: GET /api/admin/leads?page=1&limit=20
      │
      ├─→ Check Authorization header
      │
      ├─→ Verify JWT token
      │
      ▼
MySQL: SELECT * FROM leads
       WHERE ... ORDER BY created_at DESC
       LIMIT 20 OFFSET 0
      │
      ▼
Return paginated leads + count
      │
      ▼
Render table with leads data
      │
      ▼
Admin clicks "View Details"
      │
      ▼
API: GET /api/admin/leads/:id
      │
      ▼
Open dialog with lead info
      │
      ▼
Admin updates status/notes
      │
      ▼
API: PATCH /api/admin/leads/:id
      │
      ▼
MySQL: UPDATE leads SET status = ?, notes = ?
       WHERE id = ?
      │
      ▼
Success toast, refresh table
```

## 🗂️ Frontend Architecture

```
src/
├── main.tsx                    # App entry, routing setup
│
├── pages/                      # Route components
│   ├── HomePage.tsx            # Projects grid
│   ├── ProjectPage.tsx         # Dynamic landing page
│   └── admin/
│       ├── AdminLoginPage.tsx  # Auth
│       ├── AdminLeadsPage.tsx  # Leads CRUD
│       └── AdminProjectsPage.tsx
│
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── LeadForm.tsx            # Lead capture
│   ├── Gallery.tsx             # Image lightbox
│   └── ProtectedRoute.tsx      # Auth guard
│
├── contexts/
│   └── AuthContext.tsx         # Global auth state
│
├── lib/
│   ├── api.ts                  # API client + types
│   └── utils.ts                # Helper functions
│
└── index.css                   # Global styles + Tailwind
```

## 🔧 Backend Architecture

```
src/
├── index.ts                    # Express app setup
│
├── config/
│   └── database.ts             # MySQL connection pool
│
├── middleware/
│   └── auth.ts                 # JWT verification
│
├── routes/
│   ├── projects.ts             # Public project endpoints
│   ├── leads.ts                # Public lead submission
│   └── admin/
│       ├── auth.ts             # Login
│       ├── leads.ts            # Leads management
│       └── projects.ts         # Projects management
│
├── schemas/
│   └── validation.ts           # Zod validation schemas
│
└── scripts/
    └── seed.ts                 # Database seeding
```

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                     LOGIN FLOW                           │
└──────────────────────────────────────────────────────────┘

User enters email/password
      │
      ▼
Frontend validation (Zod)
      │
      ▼
POST /api/admin/auth/login
      │
      ▼
Backend validation (Zod)
      │
      ▼
Query database for user
      │
      ├─→ User not found? Return 401
      │
      ▼
Compare password with bcrypt
      │
      ├─→ Invalid? Return 401
      │
      ▼
Generate JWT token
      │
      ▼
Return token + user info
      │
      ▼
Store token in localStorage
      │
      ▼
Store user in AuthContext
      │
      ▼
Redirect to /admin/leads


┌──────────────────────────────────────────────────────────┐
│              AUTHENTICATED REQUEST FLOW                  │
└──────────────────────────────────────────────────────────┘

User makes request to protected endpoint
      │
      ▼
axios interceptor adds token to header
Authorization: Bearer <token>
      │
      ▼
API receives request
      │
      ▼
authenticateToken middleware
      │
      ├─→ No token? Return 401
      │
      ▼
Verify JWT signature
      │
      ├─→ Invalid/expired? Return 403
      │
      ▼
Add user data to req.user
      │
      ▼
Continue to route handler
```

## 📊 Data Flow - Lead Submission

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. User fills form
       │
       ▼
┌─────────────┐
│ LeadForm.tsx│
└──────┬──────┘
       │ 2. react-hook-form + Zod validation
       │
       ▼
┌─────────────┐
│   api.ts    │
└──────┬──────┘
       │ 3. POST /api/leads
       │
       ▼
┌─────────────┐
│ Rate Limiter│ ─── 5 submissions/hour per IP
└──────┬──────┘
       │ 4. Check limit
       │
       ▼
┌─────────────┐
│ leads.ts    │
└──────┬──────┘
       │ 5. Honeypot check
       │ 6. Server Zod validation
       │
       ▼
┌─────────────┐
│   MySQL     │
└──────┬──────┘
       │ 7. INSERT INTO leads
       │
       ▼
┌─────────────┐
│  Response   │
└──────┬──────┘
       │ 8. { leadId, message }
       │
       ▼
┌─────────────┐
│   Toast     │ ─── "Success! We'll contact you soon"
└─────────────┘
```

## 🔒 Security Layers

```
┌────────────────────────────────────────────────────────┐
│                    Security Stack                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Layer 1: Transport Security                          │
│  • HTTPS/TLS encryption                               │
│                                                        │
│  Layer 2: Network Security                            │
│  • CORS restrictions                                  │
│  • Rate limiting (express-rate-limit)                 │
│                                                        │
│  Layer 3: Application Security                        │
│  • Helmet security headers                            │
│  • JWT authentication                                 │
│  • Input validation (Zod)                             │
│  • Prepared statements (SQL injection prevention)     │
│                                                        │
│  Layer 4: Authentication                              │
│  • bcrypt password hashing (10 rounds)                │
│  • JWT token expiry                                   │
│  • Secure token storage                               │
│                                                        │
│  Layer 5: Anti-Spam                                   │
│  • Honeypot fields                                    │
│  • Rate limiting per IP                               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

### Option 1: All-in-One cPanel

```
┌────────────────────────────────────────────┐
│           cPanel Hosting                   │
│                                            │
│  ┌──────────────────────────────────┐    │
│  │  sub.domain.com (Document Root)  │    │
│  │  • React SPA (static files)      │    │
│  │  • .htaccess (routing)           │    │
│  └──────────────────────────────────┘    │
│                                            │
│  ┌──────────────────────────────────┐    │
│  │  Node.js Application             │    │
│  │  • Express API                   │    │
│  │  • Port: 5000                    │    │
│  └──────────────────────────────────┘    │
│                                            │
│  ┌──────────────────────────────────┐    │
│  │  MySQL Database                  │    │
│  │  • landing_platform              │    │
│  └──────────────────────────────────┘    │
│                                            │
└────────────────────────────────────────────┘
```

### Option 2: Split Hosting

```
┌────────────────────┐         ┌──────────────────────┐
│   cPanel Hosting   │         │   Cloud Platform     │
│                    │         │   (Heroku/Railway)   │
│  ┌──────────────┐ │         │                      │
│  │ React SPA    │ │         │  ┌────────────────┐ │
│  │ Static Files │ │         │  │  Express API   │ │
│  └──────────────┘ │         │  │  Node.js       │ │
│                    │  HTTPS  │  └────────────────┘ │
│  sub.domain.com ───┼────────▶│  api.domain.com    │
│                    │         │                      │
└────────────────────┘         └──────────────────────┘
         │                              │
         │                              │
         └──────────┬───────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   MySQL Database     │
         │   (Cloud/cPanel)     │
         └──────────────────────┘
```

## 📈 Scalability Considerations

**Current Setup:** Good for 100-1000 users/day

**To Scale:**

1. Add Redis for session storage
2. Implement database read replicas
3. Add CDN for static assets
4. Load balancer for API
5. Horizontal scaling of API servers
6. Database sharding by project

---

**This architecture provides:**
✅ Separation of concerns
✅ Type safety (TypeScript)
✅ Security best practices
✅ Scalable structure
✅ Easy maintenance
✅ Clear data flow
