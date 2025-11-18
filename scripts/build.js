const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const SEED_FILE = path.join(DIST_DIR, 'seed.js');

console.log('🔨 Nabdz Engine Build v2.2 - Started');

// تأكد من dist
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// دالة آمنة
function safeRead(filename) {
  const filePath = path.join(SRC_DIR, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return `// ${filename} - NOT FOUND\n`;
}

// قراءة المكونات
const modules = {
  core: safeRead('core-engine.js'),
  mood: safeRead('mood-detector.js'),
  game: safeRead('gamification.js')
};

// بناء seed.js
const seedContent = `// Nabddz Engine v2.2
// Generated: ${new Date().toISOString()}
// Modules: core, mood, game
// ==========================================

${modules.core}
${modules.mood}
${modules.game}

// Auto-init
(function() {
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      window.Nabddz && window.Nabddz.init();
      window.Nabddz && window.Nabddz.Gamification && window.Nabddz.Gamification.init();
    });
  }
})();
`;

// كتابة الملف
fs.writeFileSync(SEED_FILE, seedContent);
const stats = fs.statSync(SEED_FILE);
console.log(`✅ Build complete: ${(stats.size / 1024).toFixed(2)} KB`);

process.exit(0);
