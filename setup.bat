@echo off
echo ========================================
echo Landing Platform - Windows Setup Script
echo ========================================
echo.

echo [1/5] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Installing API dependencies...
cd apps\api
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install API dependencies
    pause
    exit /b 1
)
cd ..\..

echo.
echo [3/5] Installing Web dependencies...
cd apps\web
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Web dependencies
    pause
    exit /b 1
)
cd ..\..

echo.
echo [4/5] Creating environment files...
if not exist "apps\api\.env" (
    copy "apps\api\.env.example" "apps\api\.env"
    echo Created apps\api\.env from template
) else (
    echo apps\api\.env already exists, skipping...
)

if not exist "apps\web\.env" (
    copy "apps\web\.env.example" "apps\web\.env"
    echo Created apps\web\.env from template
) else (
    echo apps\web\.env already exists, skipping...
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Setup MySQL database:
echo    - Create database: landing_platform
echo    - Import: db\schema.sql
echo    - Import: db\seed.sql
echo.
echo 2. Configure environment:
echo    - Edit apps\api\.env with your database credentials
echo    - Edit apps\web\.env if needed (default is OK for local dev)
echo.
echo 3. Start development servers:
echo    Terminal 1: cd apps\api   then   npm run dev
echo    Terminal 2: cd apps\web   then   npm run dev
echo.
echo 4. Open browser:
echo    http://localhost:5173
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
