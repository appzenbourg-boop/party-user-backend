import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // Must be 32 bytes
const IV_LENGTH = 16;
// Using a fixed IV for deterministic encryption to allow database searching (findOne({ phone }))
// WARNING: Deterministic encryption is slightly less secure but necessary for DB lookups.
const FIXED_IV = Buffer.alloc(IV_LENGTH, 0); 

export const encryptPII = (text) => {
    if (!text) return text;
    try {
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), FIXED_IV);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    } catch (e) {
        console.error('Encryption error:', e);
        return text;
    }
};

export const decryptPII = (text) => {
    if (!text) return text;
    // If it doesn't look like hex, it might not be encrypted
    if (!/^[0-9a-fA-F]+$/.test(text)) return text;
    try {
        const encryptedText = Buffer.from(text, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), FIXED_IV);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        // Return original on error (might not be encrypted)
        return text;
    }
};
