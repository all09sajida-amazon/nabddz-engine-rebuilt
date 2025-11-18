/**
 * ===================================================================
 * Nabdz Engine - Build Script
 * ===================================================================
 * This script automates the process of building the 'seed.js' file
 * from individual source modules in the 'src/' directory.
 * Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)
 * Version: 2.2.0
 */

const fs = require('fs');
const path = require('path');

// --- مسارات الملفات ---
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const SEED_FILE = path.join(DIST_DIR, 'seed.js');

console.log('🔨 Nabdz Engine Build Script Started...');
console.log(`📂 Source Directory: ${SRC_DIR}`);
console.log(`📦 Distribution Directory: ${DIST_DIR}`);

// --- التأكد من وجود مجلد التوزيع ---
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log('📁 Created distribution directory.');
}

// --- قراءة الملفات المصدرية ---
try {
  const core = fs.readFileSync(path.join(SRC_DIR, 'core-engine.js'), 'utf8');
  // mood-detector.js سيتم إنشاؤه لاحقًا بواسطة Chat.z.ai
  // const mood = fs.readFileSync(path.join(SRC_DIR, 'mood-detector.js'), 'utf8'); 

  // --- تجميع الملفات في ملف واحد ---
  const fullSeed = `// Nabddz Engine - Auto-generated at ${new Date().toISOString()}
// ===================================================================
// This is the main entry point for the Nabd Dz Engine.
// It combines all core modules into a single file for easy distribution.
// Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)
// ===================================================================

 ${core}

// Future modules will be concatenated here.
// For example:
// ${mood}
`;

  // --- كتابة الملف النهائي ---
  fs.writeFileSync(SEED_FILE, fullSeed);
  console.log('✅ Build successful!');
  console.log(`📦 Seed file created at: ${SEED_FILE}`);

} catch (error) {
  console.error('❌ Build failed. Error:', error.message);
  process.exit(1);
}
