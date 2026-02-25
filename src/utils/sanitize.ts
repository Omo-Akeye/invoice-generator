export function sanitizeText(value: string, maxLength = 200): string {
    return value
        .replace(/[<>"'`]/g, '')
        .slice(0, maxLength);
}

export function sanitizeEmail(value: string): string {
    return value
        .replace(/[<>"'`\s]/g, '')
        .slice(0, 254);
}
