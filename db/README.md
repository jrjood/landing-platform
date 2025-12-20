# Database Setup Instructions

## Option 1: Using phpMyAdmin (Recommended for cPanel)

### Step 1: Create Database

1. Login to cPanel
2. Click on **MySQL Databases**
3. Create a new database:
   - Database Name: `landing_platform` (or `username_landing_platform` on shared hosting)
   - Click **Create Database**

### Step 2: Create Database User

1. In the same MySQL Databases page, scroll to **MySQL Users**
2. Create a new user:
   - Username: `landing_user` (or your preferred name)
   - Password: Generate a strong password
   - Click **Create User**

### Step 3: Add User to Database

1. Scroll to **Add User to Database**
2. Select the user you created
3. Select the database you created
4. Click **Add**
5. In the privileges screen, select **ALL PRIVILEGES**
6. Click **Make Changes**

### Step 4: Import Schema

1. Open **phpMyAdmin** from cPanel
2. Select your database from the left sidebar
3. Click the **Import** tab
4. Click **Choose File** and select `db/schema.sql`
5. Click **Go** at the bottom
6. Wait for success message

### Step 5: Import Seed Data

1. Stay in phpMyAdmin with your database selected
2. Click the **Import** tab again
3. Click **Choose File** and select `db/seed.sql`
4. Click **Go**
5. Wait for success message

### Step 6: Verify Installation

1. Click on **Browse** tab
2. You should see 3 tables:
   - `admin_users` (1 row)
   - `projects` (3 rows)
   - `leads` (3 sample rows)

### Step 7: Note Database Credentials

Write down these details for your `.env` file:

- **DB_HOST**: Usually `localhost` (check cPanel)
- **DB_NAME**: Your database name (e.g., `username_landing_platform`)
- **DB_USER**: Your database user (e.g., `username_landing_user`)
- **DB_PASSWORD**: The password you set
- **DB_PORT**: Usually `3306`

---

## Option 2: Using MySQL Command Line

### Prerequisites

- MySQL installed locally
- Access to MySQL command line
- MySQL running

### Step 1: Login to MySQL

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

### Step 2: Create Database

```sql
CREATE DATABASE landing_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Create User (Optional but recommended)

```sql
CREATE USER 'landing_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON landing_platform.* TO 'landing_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 4: Exit MySQL

```sql
EXIT;
```

### Step 5: Import Schema

From the `landing-platform` directory:

```bash
mysql -u root -p landing_platform < db/schema.sql
```

Or if using the created user:

```bash
mysql -u landing_user -p landing_platform < db/schema.sql
```

### Step 6: Import Seed Data

```bash
mysql -u root -p landing_platform < db/seed.sql
```

### Step 7: Verify Installation

Login to MySQL again and verify:

```bash
mysql -u root -p landing_platform
```

```sql
SHOW TABLES;
SELECT COUNT(*) FROM admin_users;  -- Should return 1
SELECT COUNT(*) FROM projects;     -- Should return 3
SELECT COUNT(*) FROM leads;        -- Should return 3
EXIT;
```

---

## Option 3: Using MySQL Workbench

### Step 1: Connect to MySQL Server

1. Open MySQL Workbench
2. Click on your local connection or create a new one
3. Enter your MySQL credentials

### Step 2: Create Database

1. Click on **Create Schema** button (database icon)
2. Schema Name: `landing_platform`
3. Charset: `utf8mb4`
4. Collation: `utf8mb4_unicode_ci`
5. Click **Apply**

### Step 3: Import Schema

1. Select your `landing_platform` database in the left panel
2. Go to **Server** → **Data Import**
3. Select **Import from Self-Contained File**
4. Browse and select `db/schema.sql`
5. Under **Default Target Schema**, select `landing_platform`
6. Click **Start Import**

### Step 4: Import Seed Data

1. Go to **Server** → **Data Import** again
2. Select **Import from Self-Contained File**
3. Browse and select `db/seed.sql`
4. Under **Default Target Schema**, select `landing_platform`
5. Click **Start Import**

### Step 5: Verify

1. In the left panel, expand `landing_platform`
2. Expand **Tables**
3. Right-click each table and select **Select Rows**
4. Verify data is present

---

## Environment Configuration

After setting up the database, update your API environment file:

**File:** `apps/api/.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=landing_user
DB_PASSWORD=your_secure_password
DB_NAME=landing_platform
```

### For cPanel Deployment

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=username_landing_user
DB_PASSWORD=your_cpanel_db_password
DB_NAME=username_landing_platform
```

---

## Troubleshooting

### Error: Access Denied

**Problem:** `Access denied for user 'username'@'localhost'`

**Solution:**

- Verify username and password are correct
- Check user has privileges: `SHOW GRANTS FOR 'username'@'localhost';`
- Re-grant privileges if needed

### Error: Database Does Not Exist

**Problem:** `Unknown database 'landing_platform'`

**Solution:**

- Verify database was created: `SHOW DATABASES;`
- Check database name spelling in `.env`
- Recreate database if needed

### Error: Table Already Exists

**Problem:** `Table 'projects' already exists`

**Solution:**

- Drop existing tables first:
  ```sql
  DROP TABLE IF EXISTS leads;
  DROP TABLE IF EXISTS projects;
  DROP TABLE IF EXISTS admin_users;
  ```
- Re-import schema.sql

### Error: Cannot Connect to MySQL

**Problem:** Cannot connect to MySQL server

**Solution:**

- Verify MySQL service is running
- Check firewall isn't blocking port 3306
- Verify host is correct (usually `localhost` or `127.0.0.1`)
- For remote connections, ensure MySQL accepts remote connections

---

## Default Admin Credentials

After successful import, you can login with:

- **Email:** admin@landingplatform.com
- **Password:** Admin@123456

**⚠️ IMPORTANT:** Change these credentials in production!

To generate a new password hash:

```bash
cd apps/api
npm install
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourNewPassword', 10, (e,h) => console.log(h));"
```

Then update in phpMyAdmin:

```sql
UPDATE admin_users SET password_hash = 'new_hash_here' WHERE email = 'admin@landingplatform.com';
```

---

## Next Steps

After database setup:

1. Configure API `.env` file
2. Test API connection: `cd apps/api && npm run dev`
3. If successful, you'll see "✅ Database connected successfully"
4. Start building/deploying your application

For more help, see the main README.md file.
