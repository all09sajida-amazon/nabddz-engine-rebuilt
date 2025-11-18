#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '../packages');

// --- إضافة رسائل تشخيص ---
console.log('🔍 Security Audit Started...');
console.log(`📂 Looking for packages in: ${PACKAGES_DIR}`);

// تحقق مما إذا كان مجلد الحزم موجودًا
if (!fs.existsSync(PACKAGES_DIR)) {
  console.error(`❌ ERROR: Packages directory not found at ${PACKAGES_DIR}`);
  console.error('🔧 Please ensure the directory exists and contains sub-folders for each package.');
  process.exit(1); // إنهاء السكربت برمز خطأ
}

function auditCode(code, filePath) {
  const issues = [];
  if (code.includes('innerHTML') && !code.includes('Security.sanitize')) {
    issues.push(`❌ XSS: innerHTML in ${filePath}`);
  }
  if (code.includes('eval(')) {
    issues.push(`❌ Injection: eval() in ${filePath}`);
  }
  return issues;
}

function auditAll() {
  console.log('📋 Reading package directories...');
  let allClear = true;
  
  try {
    const packageFolders = fs.readdirSync(PACKAGES_DIR);
    console.log(`📦 Found packages: ${packageFolders.join(', ')}`);

    packageFolders.forEach(pkg => {
      const pkgPath = path.join(PACKAGES_DIR, pkg, 'index.js');
      if (!fs.existsSync(pkgPath)) {
        console.warn(`⚠️ Warning: index.js not found for package '${pkg}' at ${pkgPath}`);
        return;
      }
      
      console.log(`🔍 Auditing package: ${pkg}`);
      const code = fs.readFileSync(pkgPath, 'utf8');
      const issues = auditCode(code, pkgPath);
      if (issues.length > 0) {
        console.error(issues.join('\n'));
        allClear = false;
      }
    });
  } catch (err) {
    console.error(`❌ FATAL ERROR: Could not read packages directory. Error: ${err.message}`);
    process.exit(1);
  }
  
  if (!allClear) {
    console.error('\n❌ Audit failed. Fix before building.');
    process.exit(1);
  }
  console.log('✅ All packages secure.');
}

auditAll();
