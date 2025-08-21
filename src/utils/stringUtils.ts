// Clean and validate business narrative (remove quotes)
export const cleanNarrative = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
        .replace(/"/g, '') // Remove all double quotes
        .replace(/[\n\r\t]/g, ' ') // Replace newlines and tabs with spaces
        .replace(/[\u0000-\u001F]/g, '') // Remove control characters
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .trim();
};

// Clean and validate keywords
export const cleanKeywords = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
        .replace(/[^a-zA-Z0-9,\s]/g, '') // Only allow a-z, A-Z, 0-9, space, comma
        .replace(/\s*,\s*/g, ', ') // Standardize comma+space separation
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .trim()
        .replace(/,\s*$/, ''); // Remove trailing comma if any
};