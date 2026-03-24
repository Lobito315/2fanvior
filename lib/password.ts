/**
 * Password hashing using Web Crypto API (PBKDF2)
 * Compatible with Cloudflare Workers, Edge runtimes, and Node.js
 * No dependency on bcrypt/bcryptjs
 */

const ITERATIONS = 10000;
const KEY_LENGTH = 64; // bytes
const ALGORITHM = 'PBKDF2';
const HASH = 'SHA-512';

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

async function deriveKey(password: string, salt: ArrayBuffer): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: ALGORITHM },
    false,
    ['deriveBits']
  );

  return crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );
}

/**
 * Hash a password using PBKDF2 with a random salt
 * Returns a string in format: salt:hash (both hex-encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltArray = new Uint8Array(16);
  crypto.getRandomValues(saltArray);
  const salt = saltArray.buffer;

  const derivedBits = await deriveKey(password, salt);
  return `${bufferToHex(salt)}:${bufferToHex(derivedBits)}`;
}

/**
 * Verify a password against a stored hash
 * The stored hash should be in format: salt:hash (both hex-encoded)
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // If the hash doesn't contain ':', it's not our format (might be bcrypt)
  if (!storedHash.includes(':')) {
    return false;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return false;
  }

  const [saltHex, hashHex] = parts;
  const salt = hexToBuffer(saltHex);
  const derivedBits = await deriveKey(password, salt);
  const newHash = bufferToHex(derivedBits);

  // Constant-time comparison to prevent timing attacks
  if (newHash.length !== hashHex.length) return false;
  let result = 0;
  for (let i = 0; i < newHash.length; i++) {
    result |= newHash.charCodeAt(i) ^ hashHex.charCodeAt(i);
  }
  return result === 0;
}
