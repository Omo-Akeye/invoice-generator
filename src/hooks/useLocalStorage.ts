import { useState, useCallback, useEffect, useRef } from 'react';
import { encryptData, decryptData, isEncryptedData } from '../utils/crypto';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState(true);
    const initialValueRef = useRef(initialValue);

    // Load and decrypt data from localStorage on mount
    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const raw = window.localStorage.getItem(key);

                if (!raw) {
                    // No stored data — keep the initial value
                    return;
                }

                if (isEncryptedData(raw)) {
                    // Decrypt the encrypted data
                    const decrypted = await decryptData(raw);
                    if (!cancelled) setStoredValue(JSON.parse(decrypted));
                } else {
                    // Legacy plain JSON — parse it, then auto-migrate to encrypted
                    const parsed = JSON.parse(raw) as T;
                    if (!cancelled) setStoredValue(parsed);

                    // Migrate: re-save as encrypted in the background
                    const encrypted = await encryptData(JSON.stringify(parsed));
                    window.localStorage.setItem(key, encrypted);
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
                if (!cancelled) setStoredValue(initialValueRef.current);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadData();
        return () => { cancelled = true; };
    }, [key]);

    // Encrypt and write to localStorage on every update
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        setStoredValue((prevValue) => {
            const valueToStore = value instanceof Function ? value(prevValue) : value;

            // Encrypt asynchronously, then persist
            encryptData(JSON.stringify(valueToStore))
                .then((encrypted) => {
                    window.localStorage.setItem(key, encrypted);
                })
                .catch((error) => {
                    console.error('Encryption failed, falling back to plain storage:', error);
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                });

            return valueToStore;
        });
    }, [key]);

    return [storedValue, setValue, isLoading] as const;
}
