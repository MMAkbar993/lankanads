const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function getImageUrl(item) {
    const imagePath =
        item?.image?.url ||
        item?.images?.[0]?.url ||
        item?.thumbnail?.url ||
        item?.thumbnail;

    if (!imagePath) {
        return null;
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    return `${API_BASE_URL || ""}${imagePath}`;
}
