#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '../packages');

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
  console.log('🔍 Security Audit...\n');
  let allClear = true;
  
  fs.readdirSync(PACKAGES_DIR).forEach(pkg => {
    const pkgPath = path.join(PACKAGES_DIR, pkg, 'index.js');
    if (!fs.existsSync(pkgPath)) return;
    
    const code = fs.readFileSync(pkgPath, 'utf8');
    const issues = auditCode(code, pkgPath);
    if (issues.length > 0) {
      console.error(issues.join('\n'));
      allClear = false;
    }
  });
  
  if (!allClear) {
    console.error('\n❌ Audit failed. Fix before building.');
    process.exit(1);
  }
  console.log('✅ All packages secure.');
}

auditAll();
