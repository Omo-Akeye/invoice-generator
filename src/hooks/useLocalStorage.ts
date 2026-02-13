import { useState, useCallback, useEffect, useRef } from 'react';
import { encryptData, decryptData, isEncryptedData } from '../utils/crypto';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState(true);
    const initialValueRef = useRef(initialValue);

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const raw = window.localStorage.getItem(key);

                if (!raw) {
                    return;
                }

                if (isEncryptedData(raw)) {
                    const decrypted = await decryptData(raw);
                    if (!cancelled) setStoredValue(JSON.parse(decrypted));
                } else {
                    const parsed = JSON.parse(raw) as T;
                    if (!cancelled) setStoredValue(parsed);

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

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        setStoredValue((prevValue) => {
            const valueToStore = value instanceof Function ? value(prevValue) : value;

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
