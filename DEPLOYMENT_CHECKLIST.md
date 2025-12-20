# Production Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### ✅ Database

- [ ] MySQL database created
- [ ] Database user created with proper privileges
- [ ] schema.sql imported successfully
- [ ] seed.sql imported successfully
- [ ] Database credentials documented securely

### ✅ Environment Variables

- [ ] API `.env` file configured for production
- [ ] JWT_SECRET changed from default
- [ ] Strong admin password set
- [ ] CORS_ORIGIN set to production URL
- [ ] NODE_ENV set to `production`
- [ ] Web VITE_API_URL points to production API

### ✅ Security

- [ ] Admin password changed from default
- [ ] JWT_SECRET is strong and unique
- [ ] Database password is strong
- [ ] No sensitive data in git repository
- [ ] Rate limiting configured
- [ ] HTTPS enabled

### ✅ Code

- [ ] All tests passing (if applicable)
- [ ] No console.log statements in production code
- [ ] Build runs without errors
- [ ] TypeScript compilation successful

## Deployment Steps

### 🗄️ Database Deployment

- [ ] Database created on production server
- [ ] Tables created (schema.sql imported)
- [ ] Sample data or production data imported
- [ ] Database connection tested from API server

### 🔧 API Deployment

- [ ] API code uploaded to server
- [ ] Dependencies installed (`npm install --production`)
- [ ] Environment variables configured
- [ ] API built successfully (`npm run build`)
- [ ] API server started
- [ ] API health endpoint responding (`/api/health`)
- [ ] Database connection verified

### 🌐 Frontend Deployment

- [ ] Production build created (`npm run build`)
- [ ] Build files uploaded to subdomain root
- [ ] `.htaccess` file in place
- [ ] Static assets accessible
- [ ] React Router working (no 404 on refresh)
- [ ] API calls working (check network tab)

### 🔗 Integration Testing

- [ ] Homepage loads correctly
- [ ] All 3 project pages load
- [ ] Project data displays correctly
- [ ] Images load properly
- [ ] Google Maps embed works
- [ ] Lead form submission works
- [ ] Success toast appears after submission
- [ ] Lead appears in database

### 👤 Admin Testing

- [ ] Admin login page accessible
- [ ] Can login with admin credentials
- [ ] Leads dashboard loads
- [ ] Can view lead details
- [ ] Can update lead status
- [ ] Can add notes to leads
- [ ] Search functionality works
- [ ] Filters work (project, status, unit type)
- [ ] Pagination works
- [ ] CSV export works
- [ ] Projects dashboard loads
- [ ] Can edit project content
- [ ] Project updates save correctly

### 📱 Cross-Browser Testing

- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

### 📲 Mobile Responsiveness

- [ ] Homepage responsive on mobile
- [ ] Project pages responsive
- [ ] Lead form usable on mobile
- [ ] Admin dashboard usable on tablet
- [ ] Touch interactions work
- [ ] No horizontal scrolling

## Post-Deployment

### 🔐 Security Hardening

- [ ] Changed default admin credentials
- [ ] Generated new JWT secret
- [ ] Reviewed and limited database user privileges
- [ ] HTTPS certificate installed and working
- [ ] Security headers verified (check browser dev tools)
- [ ] Rate limiting tested

### 📊 Monitoring Setup

- [ ] Error logging configured
- [ ] API uptime monitoring
- [ ] Database backup scheduled
- [ ] Disk space monitoring
- [ ] SSL certificate expiry monitoring

### 📝 Documentation

- [ ] Deployment notes documented
- [ ] Admin credentials stored securely
- [ ] Database credentials stored securely
- [ ] Server access details documented
- [ ] Domain/subdomain configuration documented

### 🧪 Smoke Tests (Production)

- [ ] Submit a real test lead
- [ ] Verify lead appears in admin
- [ ] Test email notifications (if implemented)
- [ ] Test all contact methods
- [ ] Verify all 3 projects accessible
- [ ] Check all external links work

### 📧 Stakeholder Communication

- [ ] Notify team of deployment
- [ ] Share admin credentials securely
- [ ] Provide user guide/training
- [ ] Share monitoring dashboard access
- [ ] Document support procedures

## Performance Optimization

### ⚡ Frontend

- [ ] Images optimized (compressed, proper formats)
- [ ] Lazy loading implemented where appropriate
- [ ] Gzip/Brotli compression enabled
- [ ] Browser caching configured (.htaccess)
- [ ] No unused dependencies in bundle
- [ ] Bundle size acceptable (<500KB initial)

### ⚡ Backend

- [ ] Database queries optimized
- [ ] Indexes on frequently queried columns
- [ ] Connection pooling configured
- [ ] Response time acceptable (<200ms average)
- [ ] No memory leaks
- [ ] PM2 or similar process manager (if applicable)

### ⚡ Database

- [ ] Proper indexes on leads table
- [ ] Query performance tested
- [ ] Regular cleanup of old data planned
- [ ] Backup strategy implemented

## Maintenance Plan

### 📅 Regular Tasks

- [ ] Weekly: Check error logs
- [ ] Weekly: Review new leads
- [ ] Monthly: Database backup
- [ ] Monthly: Check SSL certificate
- [ ] Monthly: Review server resources
- [ ] Quarterly: Update dependencies
- [ ] Quarterly: Security audit

### 🆘 Emergency Contacts

- [ ] Hosting provider support
- [ ] Database administrator
- [ ] Developer contact
- [ ] Domain registrar support

## Rollback Plan

In case of issues:

1. **Frontend Issues:**

   - [ ] Keep backup of previous `dist/` folder
   - [ ] Can quickly re-upload old version
   - [ ] Document rollback procedure

2. **API Issues:**

   - [ ] Keep previous API version
   - [ ] Document quick restart procedure
   - [ ] Have database backup ready

3. **Database Issues:**
   - [ ] Recent backup available
   - [ ] Restore procedure documented
   - [ ] Test restore process before deployment

## Sign-Off

**Deployed By:** ************\_\_\_************

**Deployment Date:** ************\_\_\_************

**Verified By:** ************\_\_\_************

**Verification Date:** ************\_\_\_************

**Production URL:** ************\_\_\_************

**Admin Access:** ************\_\_\_************

---

## Common Issues & Solutions

### Issue: API returning CORS errors

**Solution:** Update CORS_ORIGIN in API .env to match frontend URL

### Issue: 404 on page refresh

**Solution:** Verify .htaccess is present and mod_rewrite is enabled

### Issue: Images not loading

**Solution:** Check image URLs are absolute, verify CORS headers

### Issue: Admin login fails

**Solution:** Check JWT_SECRET matches, verify database connection

### Issue: Leads not submitting

**Solution:** Check API logs, verify rate limiting not blocking, test API endpoint directly

### Issue: Database connection failed

**Solution:** Verify DB credentials, check if MySQL is running, test connection from server

---

**Remember:** Always test on a staging environment before deploying to production!
