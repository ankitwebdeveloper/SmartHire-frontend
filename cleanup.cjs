const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content
        .replace(/bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded/g, 'btn-primary')
        .replace(/bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded/g, 'btn-secondary')
        .replace(/\btext-blue-600\b/g, 'text-primary')
        .replace(/\bbg-blue-600\b/g, 'bg-primary')
        .replace(/\bbg-blue-50(?!0)\b/g, 'bg-primary/10')
        .replace(/\bbg-blue-100\b/g, 'bg-primary/20')
        .replace(/\bborder-blue-600\b/g, 'border-primary')
        .replace(/\btext-blue-700\b/g, 'text-primary-dark');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Modified', file);
    }
});
