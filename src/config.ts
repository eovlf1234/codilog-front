export const IMAGE_BASE_URL = "http://localhost:8080";

export const getImageUrl = (imageUrl: string): string => {
    if(imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
    }

    return `${IMAGE_BASE_URL}${imageUrl}`
}