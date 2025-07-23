# 🛠️ Troubleshooting Guide

## Issue #1: npm Command Not Found

### Problem
```
npm : The term 'npm' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

### Quick Fix Solutions

#### Option 1: Use the Fix Scripts
Run one of these scripts in your project directory:

**PowerShell:**
```powershell
.\fix-npm-path.ps1
```

**Command Prompt:**
```cmd
fix-npm-path.bat
```

#### Option 2: Manual PATH Fix
1. **Find Node.js installation:**
   ```powershell
   Get-ChildItem -Path "C:\Program Files" -Name "*node*" -Directory
   Get-ChildItem -Path "C:\Program Files (x86)" -Name "*node*" -Directory
   ```

2. **Add to PATH temporarily:**
   ```powershell
   $env:PATH = "C:\Program Files\nodejs;$env:PATH"
   ```

3. **Test:**
   ```powershell
   npm --version
   ```

#### Option 3: Use Direct Paths
```powershell
# Use npm from node_modules
.\node_modules\.bin\npm.cmd run dev

# Or use npx
npx next dev
```

### Permanent Fix

#### Windows System Environment Variables
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "System Variables", find "Path" and click "Edit"
4. Add these paths:
   - `C:\Program Files\nodejs`
   - `%APPDATA%\npm`
5. Click OK and restart your terminal

#### Alternative Installation Methods
```powershell
# Using Chocolatey
choco install nodejs

# Using Scoop
scoop install nodejs

# Using winget
winget install OpenJS.NodeJS
```

## Issue #2: Development Server Won't Start

### Problem
The development server fails to start or shows errors.

### Solutions

#### Check Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Check Port Conflicts
```bash
# Kill processes on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Clear Next.js Cache
```bash
# Remove .next folder
rm -rf .next
npm run dev
```

## Issue #3: Build Errors

### Problem
The project fails to build or deploy.

### Solutions

#### Check TypeScript Errors
```bash
npx tsc --noEmit
```

#### Check ESLint
```bash
npx eslint . --ext .ts,.tsx
```

#### Fix Import Issues
```bash
# Clear module cache
npm run build -- --no-cache
```

## Issue #4: Google Form Integration Issues

### Problem
Data is not being submitted to Google Forms.

### Solutions

#### Check Form URL
1. Verify the Google Form URL is correct
2. Ensure the form is set to accept responses
3. Check if the form field IDs match

#### Test Form Submission
```javascript
// Test in browser console
fetch('YOUR_FORM_URL', {
  method: 'POST',
  body: new FormData(form)
})
```

#### Check CORS Issues
- Ensure the form allows cross-origin requests
- Check browser console for CORS errors

## Issue #5: Chess API Issues

### Problem
Chess positions are not loading or moves are invalid.

### Solutions

#### Check API Limits
- Lichess API has rate limits
- Implement caching for API responses

#### Validate FEN Strings
```javascript
// Test FEN validation
const isValidFEN = (fen) => {
  // Add validation logic
}
```

#### Fallback to Local Data
- Use local chess positions if API fails
- Implement offline mode

## Issue #6: Mobile Responsiveness

### Problem
Game doesn't work properly on mobile devices.

### Solutions

#### Check Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### Test Touch Events
```javascript
// Add touch event handlers
element.addEventListener('touchstart', handleTouch);
```

#### Optimize for Mobile
- Reduce image sizes
- Simplify UI for small screens
- Test on actual devices

## Issue #7: Performance Issues

### Problem
Game is slow or unresponsive.

### Solutions

#### Optimize Images
```bash
# Use Next.js Image optimization
import Image from 'next/image'
```

#### Implement Lazy Loading
```javascript
// Lazy load components
const LazyComponent = dynamic(() => import('./Component'))
```

#### Check Bundle Size
```bash
npm run build
# Check the build output for large files
```

## Issue #8: Error Logging Issues

### Problem
Errors are not being logged properly.

### Solutions

#### Check Error Handler
```javascript
// Verify error handler is working
console.log('Error handler test');
```

#### Test Google Form Submission
- Check if error form URL is correct
- Verify form field IDs

#### Check Network Requests
- Open browser DevTools
- Check Network tab for failed requests

## Getting Help

### Debug Information
When reporting issues, include:
- Operating System
- Node.js version
- npm version
- Browser type and version
- Error messages
- Steps to reproduce

### Useful Commands
```bash
# System info
node --version
npm --version
git --version

# Project info
npm list
npm outdated

# Build info
npm run build
npm run lint
```

### Contact
- Check the GitHub issues page
- Review the documentation
- Test with the provided fix scripts 