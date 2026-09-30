import { useSyncExternalStore } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

// Must match the key read by the inline script in index.html.
const STORAGE_KEY = 'invoicepro-theme';

// Browser chrome colour (mobile address bar, PWA title bar); matches --canvas.
const CHROME_COLORS: Record<ResolvedTheme, string> = { light: '#fafaf9', dark: '#0b0b0c' };

const readStored = (): ThemePreference => {
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
        return 'system';
    }
};

let preference: ThemePreference = typeof window === 'undefined' ? 'system' : readStored();
const listeners = new Set<() => void>();

const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

const resolve = (pref: ThemePreference): ResolvedTheme =>
    pref === 'system' ? (systemQuery().matches ? 'dark' : 'light') : pref;

const apply = () => {
    const root = document.documentElement;
    if (preference === 'system') delete root.dataset.theme;
    else root.dataset.theme = preference;

    const color = CHROME_COLORS[resolve(preference)];
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', color));
};

const commit = (next: ThemePreference) => {
    preference = next;
    try {
        if (next === 'system') window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
        // Private mode or blocked storage: the choice still applies for this visit.
    }
    apply();
    listeners.forEach((listener) => listener());
};

export const setTheme = (next: ThemePreference) => {
    if (next === preference) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colorsChange = resolve(next) !== resolve(preference);
    if (reduceMotion || !colorsChange) {
        commit(next);
        return;
    }

    if (typeof document.startViewTransition === 'function') {
        // Snapshot the old page, swap the theme, then crossfade (timing set in index.css).
        document.startViewTransition(() => commit(next));
        return;
    }

    const root = document.documentElement;
    root.classList.add('theme-transition');
    commit(next);
    window.setTimeout(() => root.classList.remove('theme-transition'), 360);
};

/** Call once at startup: syncs the browser chrome colour and follows OS changes in "system" mode. */
export const initTheme = () => {
    apply();
    systemQuery().addEventListener('change', () => {
        if (preference === 'system') {
            apply();
            listeners.forEach((listener) => listener());
        }
    });
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const useThemePreference = (): ThemePreference =>
    useSyncExternalStore(subscribe, () => preference, () => 'system');

/** The theme actually showing: the saved choice, or the system's when nothing is saved. */
export const useResolvedTheme = (): ResolvedTheme =>
    useSyncExternalStore(subscribe, () => resolve(preference), () => 'light');
