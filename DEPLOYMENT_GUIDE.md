# cPanel Deployment Guide for Landing Platform

## 📋 Pre-Deployment Checklist

✅ Frontend built: `apps/web/dist/`
✅ Backend built: `apps/api/dist/`
✅ Production .env configured: `apps/api/.env`
✅ Database credentials verified for cPanel MySQL

## 🎯 Deployment Overview

**Domain**: new.wealthholding-eg.com
**Frontend**: Static React app in subdomain root
**Backend**: Node.js app running on cPanel

---

## Part 1: Deploy Frontend (React App)

### Step 1: Access cPanel

1. Log into your cPanel hosting account
2. Navigate to **File Manager**

### Step 2: Upload Frontend Files

1. Go to `public_html/new.wealthholding-eg.com/` (or create this directory)
2. Upload ALL files from `apps/web/dist/` folder:
   - `index.html`
   - `assets/` folder (contains all CSS and JS)
3. Create `.htaccess` file in the same directory with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**Purpose**: This enables React Router to work correctly (all routes go to index.html)

---

## Part 2: Deploy Backend (Node.js API)

### Step 3: Setup Node.js Application in cPanel

1. In cPanel, find **Setup Node.js App** (or similar, depending on your host)
2. Click **Create Application**
3. Configure:
   - **Node.js version**: Select latest available (16+ recommended)
   - **Application mode**: Production
   - **Application root**: `landing_api` (create this folder in your home directory)
   - **Application URL**: Choose subdomain or path like `/api`
   - **Application startup file**: `dist/index.js`

### Step 4: Upload Backend Files

1. Using File Manager or FTP, navigate to the `landing_api` folder you created
2. Upload these files/folders:
   - `apps/api/dist/` → Upload entire folder
   - `apps/api/package.json` → Upload file
   - `apps/api/.env` → Upload file (IMPORTANT!)
   - `apps/api/node_modules/` → Optional (or install on server)

### Step 5: Install Dependencies on Server

1. In cPanel Node.js App Manager, find your application
2. Click on the application name or "Enter to virtual environment"
3. This opens a terminal. Run:

```bash
npm install --production
```

### Step 6: Configure Environment Variables (Alternative Method)

If cPanel has an Environment Variables section:

1. Add all variables from your `.env` file manually:
   - PORT=3001
   - NODE_ENV=production
   - DB_HOST=localhost
   - DB_USER=wealthholdingeg_landing_user
   - DB_PASSWORD=Select_Wealth-12345\*/
   - DB_NAME=wealthholdingeg_landing_platform
   - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-RANDOM
   - CORS_ORIGIN=https://new.wealthholding-eg.com

### Step 7: Start the Application

1. In Node.js App Manager, click **Start** or **Restart**
2. Note the port number assigned (might be different from 3001)

---

## Part 3: Setup Database

### Step 8: Import Database Schema

1. Go to **phpMyAdmin** in cPanel
2. Select database: `wealthholdingeg_landing_platform`
3. Click **Import** tab
4. Upload `db/schema.sql` file
5. Click **Go** to execute

### Step 9: Seed Initial Data

Option A - Using cPanel Terminal:

```bash
cd ~/landing_api
npm run seed
```

Option B - Manual SQL:
Run the seed queries from `apps/api/src/scripts/seed.ts` manually in phpMyAdmin

---

## Part 4: Configure Reverse Proxy (API Access)

### Step 10: Setup .htaccess for API Routing

In `public_html/new.wealthholding-eg.com/.htaccess`, add BEFORE the existing rules:

```apache
# Proxy API requests to Node.js backend
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Proxy /api requests to Node.js app
  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

  # React Router handling (existing rules)
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**Note**: Replace `3001` with the actual port your Node.js app is running on.

---

## 🔍 Verification Steps

1. **Test Frontend**:

   - Visit: `https://new.wealthholding-eg.com`
   - Should load homepage

2. **Test API**:

   - Visit: `https://new.wealthholding-eg.com/api/projects`
   - Should return JSON with projects

3. **Test Admin Login**:

   - Visit: `https://new.wealthholding-eg.com/admin`
   - Login with:
     - Email: `admin@wealthholding-eg.com`
     - Password: `YourSecurePassword123!`

4. **Test Lead Submission**:
   - Go to homepage
   - Fill and submit contact form
   - Check admin panel for new lead

---

## 🚨 Troubleshooting

### Frontend shows blank page:

- Check browser console for errors
- Verify `.htaccess` exists and is correct
- Ensure all `dist/assets/` files uploaded

### API not responding:

- Check Node.js app is running in cPanel
- Verify `.env` file uploaded with correct credentials
- Check error logs in cPanel Node.js App Manager
- Test direct API access: `https://new.wealthholding-eg.com:3001/api/projects` (if port exposed)

### Database connection fails:

- Verify database credentials in `.env`
- Ensure database user has permissions
- Check DB_HOST (should be `localhost` on cPanel)

### CORS errors:

- Verify CORS_ORIGIN in `.env` matches exactly: `https://new.wealthholding-eg.com`
- No trailing slash in URL

---

## 📁 File Structure on cPanel

```
~/public_html/new.wealthholding-eg.com/
├── index.html
├── assets/
│   ├── index-DF9QgLD6.js
│   └── index-C98B55lQ.css
└── .htaccess

~/landing_api/
├── dist/
│   ├── index.js
│   ├── config/
│   ├── routes/
│   └── ...
├── package.json
├── .env
└── node_modules/ (after npm install)
```

---

## 🔐 Security Notes

1. **Never expose .env file** - Add to .htaccess:

```apache
<Files ".env">
  Order allow,deny
  Deny from all
</Files>
```

2. **Change default admin password** after first login

3. **Use strong JWT_SECRET** in production

4. **Enable HTTPS** (should be automatic with cPanel SSL)

---

## 🔄 Future Updates

To update the application:

**Frontend**:

1. Run `npm run build` locally
2. Upload new `dist/` contents to cPanel
3. Clear browser cache

**Backend**:

1. Run `npm run build` locally
2. Upload new `dist/` folder to cPanel
3. Restart Node.js app in cPanel

---

## ✅ Deployment Complete!

Your application should now be live at:

- **Frontend**: https://new.wealthholding-eg.com
- **Admin Panel**: https://new.wealthholding-eg.com/admin
- **API**: https://new.wealthholding-eg.com/api
