const DB_NAME = 'invoicepro-keystore';
const DB_VERSION = 1;
const STORE_NAME = 'encryption-keys';
const KEY_ID = 'master-encryption-key';

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

    const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );

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

export async function encryptData(plaintext: string): Promise<string> {
    const key = await getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
    );

    const combined = new Uint8Array(iv.byteLength + new Uint8Array(ciphertext).byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.byteLength);

    return arrayBufferToBase64(combined.buffer);
}

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

export function isEncryptedData(value: string): boolean {
    try {
        JSON.parse(value);
        return false;
    } catch {
        return true;
    }
}
