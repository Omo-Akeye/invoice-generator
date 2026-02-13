/**
 * Encryption utility for local storage data.
 *
 * Uses the Web Crypto API with AES-256-GCM for authenticated encryption.
 * The encryption key is generated once and stored in IndexedDB as a
 * non-extractable CryptoKey — meaning even JavaScript cannot read the
 * raw key material. The key can only be used for encrypt/decrypt operations.
 *
 * Each encryption operation generates a fresh 12-byte IV (initialization vector),
 * which is prepended to the ciphertext before base64-encoding the result.
 */

const DB_NAME = 'invoicepro-keystore';
const DB_VERSION = 1;
const STORE_NAME = 'encryption-keys';
const KEY_ID = 'master-encryption-key';

// ─── IndexedDB Key Store ─────────────────────────────────────────────

function openKeyStore(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
    });
}

async function getOrCreateKey(): Promise<CryptoKey> {
    const db = await openKeyStore();

    // Try to retrieve the existing key
    const existing = await new Promise<CryptoKey | undefined>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(KEY_ID);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result as CryptoKey | undefined);
    });

    if (existing) {
        db.close();
        return existing;
    }

    // Generate a new AES-256-GCM key (non-extractable)
    const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false, // non-extractable: raw key bytes cannot be read by JS
        ['encrypt', 'decrypt']
    );

    // Persist the key in IndexedDB
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(key, KEY_ID);
        tx.onerror = () => reject(tx.error);
        tx.oncomplete = () => resolve();
    });

    db.close();
    return key;
}

// ─── Base64 Helpers ──────────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string containing [12-byte IV | ciphertext].
 */
export async function encryptData(plaintext: string): Promise<string> {
    const key = await getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
    );

    // Combine IV + ciphertext into a single buffer
    const combined = new Uint8Array(iv.byteLength + new Uint8Array(ciphertext).byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.byteLength);

    return arrayBufferToBase64(combined.buffer);
}

/**
 * Decrypts an AES-256-GCM encrypted base64 string back to plaintext.
 * Expects the format produced by `encryptData`.
 */
export async function decryptData(encryptedBase64: string): Promise<string> {
    const key = await getOrCreateKey();
    const combined = new Uint8Array(base64ToArrayBuffer(encryptedBase64));

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}

/**
 * Checks whether a stored value is encrypted (base64) or plain JSON.
 * Used for backward-compatible migration of unencrypted legacy data.
 */
export function isEncryptedData(value: string): boolean {
    try {
        JSON.parse(value);
        return false; // Valid JSON = not encrypted
    } catch {
        return true; // Not valid JSON = likely encrypted base64
    }
}
