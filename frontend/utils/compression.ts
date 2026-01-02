import imageCompression from 'browser-image-compression';

/**
 * Compress image before upload
 * Target: Max 1MB, Max 1920x1920
 */
export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
    };

    try {
        if (file.size / 1024 / 1024 > 1) { // Only compress if > 1MB
            console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
            const compressedFile = await imageCompression(file, options);
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
            return compressedFile;
        }
        return file;
    } catch (error) {
        console.error("Image compression error:", error);
        return file; // Return original if compression fails
    }
}
