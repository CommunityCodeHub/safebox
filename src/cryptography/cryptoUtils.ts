import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Recommended for GCM
const KEY_LENGTH = 32; // 256 bits

export class StrongCrypto {
  private key: Buffer;

  constructor(secret: string) {
    // Derive a 256-bit key from the secret using SHA-256
    this.key = crypto.createHash('sha256').update(secret).digest();
  }

  encrypt(plainText: string): { cipherText: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const tag = cipher.getAuthTag();
    return {
      cipherText: encrypted,
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
    };
  }

  decrypt(cipherText: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
