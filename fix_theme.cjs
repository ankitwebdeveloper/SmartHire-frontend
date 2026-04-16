const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('./src', (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Clear global old blue/indigo styles
  content = content.replace(/\bbg-blue-\d+\b/g, 'bg-primary');
  content = content.replace(/\btext-blue-\d+\b/g, 'text-primary');
  content = content.replace(/\bborder-blue-\d+\b/g, 'border-primary');
  
  content = content.replace(/\bbg-indigo-\d+\b/g, 'bg-primary');
  content = content.replace(/\btext-indigo-\d+\b/g, 'text-primary');
  content = content.replace(/\bborder-indigo-\d+\b/g, 'border-primary');

  // Find all buttons using bg-slate-* and replace with bg-primary
  content = content.replace(/(<button[^>]*?className=["'][^"']*?)\bbg-slate-\d+\b([^"']*?["'])/g, '$1bg-primary$2');

  // Hardcode Navbar colors
  if (filePath.includes('Navbar.jsx')) {
    content = content.replace(/bg-white border-b border-slate-200/g, 'bg-[#0F4C81] text-white border-b border-[#0F4C81]');
    content = content.replace(/\btext-slate-[456789]00\b/g, 'text-white');
    content = content.replace(/\bhover:text-slate-[456789]00\b/g, 'hover:text-[#2FAE66]');
    content = content.replace(/\bbg-white\b/g, 'bg-[#0F4C81]'); // For mobile menu background
    content = content.replace(/\btext-primary\b/g, 'text-white'); // Fix text-primary in Navbar which would be dark blue on dark blue background
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
  }
});

console.log("Theme overrides applied.");
