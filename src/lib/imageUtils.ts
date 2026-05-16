export function getFirstImageUrl(imagesData: unknown): string {
  if (!imagesData) return "/placeholder-tree.svg";
  if (Array.isArray(imagesData)) {
    return imagesData.length > 0 ? imagesData[0] : "/placeholder-tree.svg";
  }
  if (typeof imagesData === "string") {
    try {
      const parsed = JSON.parse(imagesData);
      return Array.isArray(parsed)
        ? parsed[0] || "/placeholder-tree.svg"
        : parsed;
    } catch {
      return imagesData; // Return as-is if it's already a URL string
    }
  }
  return "/placeholder-tree.svg";
}

export function getAllImageUrls(imagesData: unknown): string[] {
  if (!imagesData) return [];
  if (Array.isArray(imagesData)) return imagesData;
  if (typeof imagesData === "string") {
    try {
      const parsed = JSON.parse(imagesData);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      if (imagesData.startsWith("http") || imagesData.startsWith("/")) {
        return [imagesData];
      }
      return [];
    }
  }
  return [];
}

export const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Default to image/jpeg if it's not a transparent png
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
