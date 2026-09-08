export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
}

export const getCloudinaryConfig = (): CloudinaryConfig => {
  try {
    const stored = localStorage.getItem('akash_cloudinary_config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore error
  }
  return {
    cloudName: ((import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || '') as string,
    uploadPreset: ((import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '') as string,
    apiKey: ((import.meta as any).env?.VITE_CLOUDINARY_API_KEY || '') as string,
  };
};

export const saveCloudinaryConfig = (config: CloudinaryConfig) => {
  localStorage.setItem('akash_cloudinary_config', JSON.stringify(config));
};

export interface UploadResult {
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
}

export async function uploadToCloudinary(
  file: File | Blob,
  customConfig?: Partial<CloudinaryConfig>
): Promise<UploadResult> {
  const config = { ...getCloudinaryConfig(), ...customConfig };

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error(
      'Cloudinary configuration missing. Please configure your Cloud Name and Upload Preset in the Admin Settings.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errorMsg =
      errData?.error?.message ||
      `Cloudinary upload failed with status ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
    format: data.format,
    width: data.width,
    height: data.height,
  };
}
