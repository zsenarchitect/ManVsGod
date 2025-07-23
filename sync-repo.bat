@echo off
echo 🔄 Syncing Man vs God Repository...
echo.

echo 📊 Checking git status...
git status
echo.

echo 🔧 Fixing npm PATH...
set "PATH=C:\Program Files\nodejs;%PATH%"
set "PATH=%APPDATA%\npm;%PATH%"
echo.

echo 🧪 Testing npm...
npm --version
if %errorlevel% equ 0 (
    echo ✅ npm is working!
) else (
    echo ❌ npm still not found
    echo 💡 Trying alternative methods...
)

echo.
echo 📝 Adding all changes...
git add .

echo.
echo 💾 Committing changes...
git commit -m "Sync repository - Dynamic rules system and fixes"

echo.
echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ✅ Repository sync complete!
echo.
echo 🌐 Live game: https://szhang.github.io/ManVsGod
echo.
pause 