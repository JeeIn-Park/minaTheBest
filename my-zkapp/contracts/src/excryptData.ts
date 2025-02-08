import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

export function encryptData(data: string, key: Buffer): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
  };
}
