@echo off
echo 🔧 Fixing npm PATH issue for Man vs God project...
echo.

REM Check common Node.js installation paths
set "NODEJS_PATHS=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\nodejs;%USERPROFILE%\AppData\Roaming\npm"

REM Add Node.js paths to current session PATH
for %%p in (%NODEJS_PATHS%) do (
    if exist "%%p\npm.cmd" (
        echo ✅ Found npm at: %%p
        set "PATH=%%p;%PATH%"
    )
    if exist "%%p\node.exe" (
        echo ✅ Found node at: %%p
        set "PATH=%%p;%PATH%"
    )
)

echo.
echo 🧪 Testing npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm is working!
    npm --version
) else (
    echo ❌ npm still not found
)

echo.
echo 🧪 Testing node...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ node is working!
    node --version
) else (
    echo ❌ node still not found
)

echo.
echo 💡 To make this permanent, add the Node.js paths to your system environment variables.
echo.
echo 🚀 You can now run: npm run dev
echo.
pause 