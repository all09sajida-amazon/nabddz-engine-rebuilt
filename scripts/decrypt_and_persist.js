// scripts/decrypt_and_persist.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PRIVATE_KEY = process.env.NABDZ_PRIVATE_KEY;

if (!PRIVATE_KEY) {
    console.error('NABDZ_PRIVATE_KEY environment variable is required.');
    process.exit(1);
}

const payloadPath = process.argv[2];
if (!payloadPath || !fs.existsSync(payloadPath)) {
    console.error('Error: Payload file not provided or not found.');
    process.exit(1);
}

const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_IV_LENGTH = 16;
const ENCRYPTION_TAG_LENGTH = 16;
const ENCRYPTION_SALT_LENGTH = 64;
const ENCRYPTION_KEY_ITERATIONS = 100000;

function decrypt(encryptedText) {
    if (!encryptedText || typeof encryptedText !== 'string') {
        throw new Error('Invalid encrypted text provided.');
    }
    const buffer = Buffer.from(encryptedText, 'base64');

    const salt = buffer.subarray(0, ENCRYPTION_SALT_LENGTH);
    const iv = buffer.subarray(ENCRYPTION_SALT_LENGTH, ENCRYPTION_SALT_LENGTH + ENCRYPTION_IV_LENGTH);
    const tag = buffer.subarray(ENCRYPTION_SALT_LENGTH + ENCRYPTION_IV_LENGTH, ENCRYPTION_SALT_LENGTH + ENCRYPTION_IV_LENGTH + ENCRYPTION_TAG_LENGTH);
    const encryptedData = buffer.subarray(ENCRYPTION_SALT_LENGTH + ENCRYPTION_IV_LENGTH + ENCRYPTION_TAG_LENGTH);

    const key = crypto.pbkdf2Sync(PRIVATE_KEY, salt, ENCRYPTION_KEY_ITERATIONS, 32, 'sha512');
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}

function persistPayload(data) {
    if (!data || !Array.isArray(data.logs)) {
        console.error('Invalid payload structure: missing logs array.');
        return;
    }

    const baseDir = path.join('data', 'logs', new Date().toISOString().split('T')[0]);
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }

    for (const logEntry of data.logs) {
        if (!logEntry.id || !logEntry.data) continue;
        const filePath = path.join(baseDir, `${logEntry.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(logEntry.data, null, 2));
    }
}

try {
    const encryptedPayload = fs.readFileSync(payloadPath, 'utf8');
    const decryptedJson = decrypt(encryptedPayload);
    const data = JSON.parse(decryptedJson);
    persistPayload(data);
    fs.unlinkSync(payloadPath);
    console.log('Payload decrypted and persisted successfully.');
} catch (error) {
    console.error('Decryption or persistence failed:', error.message);
    process.exit(1);
}
