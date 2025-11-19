const fs = require('fs');
const path = require('path');

// --- مسارات الملفات ---
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const SEED_FILE = path.join(DIST_DIR, 'seed.js');

console.log('Nabdz Engine Build v2.2 - Started');
console.log('Source Directory: ' + SRC_DIR);
console.log('Distribution Directory: ' + DIST_DIR);

// --- التأكد من وجود مجلد التوزيع ---
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('Created distribution directory.');
}

// --- دالة آمنة لقراءة الملفات ---
function safeRead(filename) {
  const filePath = path.join(SRC_DIR, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  console.warn('Warning: ' + filename + ' not found, using placeholder.');
  return '// ' + filename + ' - NOT FOUND\n';
}

// --- قراءة المكونات ---
const modules = {
  core: safeRead('core-engine.js'),
  mood: safeRead('mood-detector.js'),
  game: safeRead('gamification.js')
};

// --- بناء ملف seed.js ---
const seedContent = '// Nabddz Engine v2.2\n' +
'// Generated: ' + new Date().toISOString() + '\n' +
'// Modules: core, mood, game\n' +
'// ==========================================\n\n' +
modules.core + '\n' +
modules.mood + '\n' +
modules.game + '\n\n' +
'// Auto-initialization\n' +
'(function() {\n' +
'  if (typeof window !== \'undefined\' && typeof document !== \'undefined\') {\n' +
'    // Wait for DOM to be ready\n' +
'    if (document.readyState === \'loading\') {\n' +
'      document.addEventListener(\'DOMContentLoaded\', function() {\n' +
'        window.NabdzCore && window.NabdzCore.init();\n' +
'        window.NabdzCore && window.NabdzCore.Gamification && window.NabdzCore.Gamification.init();\n' +
'      });\n' +
'    } else {\n' +
'      // DOM is already ready\n' +
'      window.NabdzCore && window.NabdzCore.init();\n' +
'      window.NabdzCore && window.NabdzCore.Gamification && window.NabdzCore.Gamification.init();\n' +
'    }\n' +
'  }\n' +
'})();\n';

// --- كتابة الملف النهائي ---
fs.writeFileSync(SEED_FILE, seedContent);
const stats = fs.statSync(SEED_FILE);
console.log('Build complete: ' + (stats.size / 1024).toFixed(2) + ' KB');
console.log('Seed file created at: ' + SEED_FILE);

process.exit(0);
