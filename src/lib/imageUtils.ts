export function getFirstImageUrl(imagesData: unknown): string {
    if (!imagesData) return '/placeholder-tree.svg';
    if (Array.isArray(imagesData)) {
        return imagesData.length > 0 ? imagesData[0] : '/placeholder-tree.svg';
    }
    if (typeof imagesData === 'string') {
        try {
            const parsed = JSON.parse(imagesData);
            return Array.isArray(parsed) ? (parsed[0] || '/placeholder-tree.svg') : parsed;
        } catch {
            return imagesData; // Return as-is if it's already a URL string
        }
    }
    return '/placeholder-tree.svg';
}

export function getAllImageUrls(imagesData: unknown): string[] {
    if (!imagesData) return [];
    if (Array.isArray(imagesData)) return imagesData;
    if (typeof imagesData === 'string') {
        try {
            const parsed = JSON.parse(imagesData);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            if (imagesData.startsWith('http') || imagesData.startsWith('/')) {
                return [imagesData];
            }
            return [];
        }
    }
    return [];
}
