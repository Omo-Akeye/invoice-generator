// Small colour helpers for the invoice brand colour. Everything works on "#rrggbb" strings.

type Rgb = [number, number, number];

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Returns "#rrggbb" (lower case) for a valid 3- or 6-digit hex with or without "#", otherwise undefined.
 * Saved invoices are untrusted input, so every colour passes through here before it reaches a style attribute.
 */
export const normalizeHex = (value: unknown): string | undefined => {
    if (typeof value !== 'string') return undefined;
    const match = HEX.exec(value.trim());
    if (!match) return undefined;
    const digits = match[1].length === 3 ? [...match[1]].map((d) => d + d).join('') : match[1];
    return `#${digits.toLowerCase()}`;
};

const toRgb = (hex: string): Rgb => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = ([r, g, b]: Rgb) => `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

/** Blends `a` toward `b`; amount 0 = a, 1 = b. */
export const mix = (a: string, b: string, amount: number): string => {
    const ca = toRgb(a);
    const cb = toRgb(b);
    return toHex([0, 1, 2].map((i) => ca[i] + (cb[i] - ca[i]) * amount) as Rgb);
};

/** WCAG relative luminance. */
const luminance = (hex: string) => {
    const [r, g, b] = toRgb(hex).map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio, 1 to 21. */
export const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
};

/** Darkens `hex` toward black in small steps until it reaches `ratio` against `background`. */
export const darkenTo = (hex: string, ratio: number, background = '#ffffff'): string => {
    for (let amount = 0; amount <= 1; amount += 0.04) {
        const candidate = mix(hex, '#000000', amount);
        if (contrast(candidate, background) >= ratio) return candidate;
    }
    return '#000000';
};

/** Near-black or white, whichever reads better on `background`. */
export const readableOn = (background: string, dark = '#111111', light = '#ffffff') =>
    contrast(dark, background) >= contrast(light, background) ? dark : light;
