/**
 * ===================================================================
 * Nabdz Engine - Build Script v2.2.0
 * ===================================================================
 * Golden Rule: This is the ONLY way to create dist/seed.js
 * Never edit dist/seed.js manually. Always run: node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

// إعدادات مضمونة
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const SEED_FILE = path.join(DIST_DIR, 'seed.js');

console.log('🔨 Nabdz Engine Build v2.2.0');

// تأكد من dist
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// دالة آمنة لقراءة أي ملف
function safeRead(filename) {
  const filePath = path.join(SRC_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ CRITICAL: Missing ${filename}`);
    return null; // إشارة فشل
  }
  return fs.readFileSync(filePath, 'utf8');
}

// قراءة المكونات الأساسية
const modules = {
  core: safeRead('core-engine.js'),
  mood: safeRead('mood-detector.js'),
  game: safeRead('gamification.js')
};

// التحقق من وجود كل المكونات
const missing = Object.entries(modules).filter(([_, code]) => code === null);
if (missing.length > 0) {
  console.error('❌ Build ABORTED - Missing modules:', missing.map(([name]) => name).join(', '));
  console.error('💡 Fix: Create the missing files in src/ then run again.');
  process.exit(1); // فشل صريح - لا نبني على خطأ
}

// بناء seed.js
const seedContent = `// Nabdz Engine v2.2.0
// Generated: ${new Date().toISOString()}
// Modules: core, mood, game
// WARNING: Auto-generated - DO NOT EDIT
// ==========================================

${modules.core}
${modules.mood}
${modules.game}

// Auto-initialization
(function() {
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      window.Nabddz && window.Nabddz.init();
      window.Nabddz && window.Nabddz.Gamification && window.Nabddz.Gamification.init();
      console.log('🚀 Nabddz v2.2.0 ready');
    });
  }
})();
`;

// الكتابة
fs.writeFileSync(SEED_FILE, seedContent);

// نتيجة ناجحة
const stats = fs.statSync(SEED_FILE);
console.log(`✅ Build SUCCESS: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`📦 Modules loaded: core, mood, game`);
console.log(`📄 Output: ${SEED_FILE}`);
process.exit(0);
