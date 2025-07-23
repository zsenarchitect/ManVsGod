// Simple QR code generator for GitHub Pages URL
const https = require('https');
const fs = require('fs');

// GitHub Pages URL for your repository
const websiteUrl = 'https://szhang.github.io/ManVsGod';

// QR Code API URL
const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(websiteUrl)}`;

// Download the QR code
https.get(qrApiUrl, (response) => {
  const file = fs.createWriteStream('qr-code.png');
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log('QR code generated successfully!');
    console.log('Website URL:', websiteUrl);
    console.log('QR code saved as: qr-code.png');
  });
}).on('error', (err) => {
  console.error('Error generating QR code:', err.message);
}); 