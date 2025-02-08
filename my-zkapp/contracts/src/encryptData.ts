import * as crypto from 'crypto';

export function encryptData(data: string, key: Buffer): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return { encrypted: encrypted.toString('base64'), iv: iv.toString('base64') };
}
