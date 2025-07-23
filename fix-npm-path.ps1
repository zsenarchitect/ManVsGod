# Fix npm PATH issue for Man vs God project
# This script adds common Node.js installation paths to the current session

Write-Host "🔧 Fixing npm PATH issue..." -ForegroundColor Yellow

# Common Node.js installation paths
$possiblePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "$env:APPDATA\npm",
    "$env:LOCALAPPDATA\Programs\nodejs",
    "$env:USERPROFILE\AppData\Roaming\npm"
)

$addedPaths = @()

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        Write-Host "✅ Found Node.js at: $path" -ForegroundColor Green
        if ($env:PATH -notlike "*$path*") {
            $env:PATH = "$path;$env:PATH"
            $addedPaths += $path
            Write-Host "   Added to PATH" -ForegroundColor Green
        } else {
            Write-Host "   Already in PATH" -ForegroundColor Blue
        }
    }
}

if ($addedPaths.Count -gt 0) {
    Write-Host "`n🎉 Successfully added $($addedPaths.Count) paths to PATH" -ForegroundColor Green
    Write-Host "Added paths:" -ForegroundColor Cyan
    $addedPaths | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
} else {
    Write-Host "`nℹ️  No new paths were added (they may already be in PATH)" -ForegroundColor Blue
}

# Test npm
Write-Host "`n🧪 Testing npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ npm is working! Version: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm still not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ npm still not found" -ForegroundColor Red
}

# Test node
Write-Host "🧪 Testing node..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ node is working! Version: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ node still not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ node still not found" -ForegroundColor Red
}

Write-Host "`n💡 To make this permanent, run this script with administrator privileges" -ForegroundColor Cyan
Write-Host "   or add the paths manually to your system environment variables." -ForegroundColor Cyan

Write-Host "`n🚀 You can now run: npm run dev" -ForegroundColor Green 