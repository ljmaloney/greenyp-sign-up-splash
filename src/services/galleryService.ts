
import { getApiUrl } from '@/config/api';
import { APIResponse } from '@/types/responseBody';

export interface GalleryImage {
  imageName: string;
  description: string;
  url: string;
}

export interface UploadImageResponse {
  success: boolean;
  message?: string;
}

export const uploadGalleryImage = async (
  producerId: string, 
  file: File, 
  description: string = ''
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const url = getApiUrl(`/producer/${producerId}/gallery`);
  const params = new URLSearchParams({
    imageFilename: file.name,
    imageDescription: description
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.status}`);
  }

  return { success: true };
};

export const uploadProducerLogo = async (
  producerId: string, 
  file: File
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('logo', file);

  const url = getApiUrl(`/producer/${producerId}/logo`);
  const params = new URLSearchParams({
    logoFilename: file.name
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload logo: ${response.status}`);
  }

  return { success: true };
};

export const fetchGalleryImages = async (producerId: string): Promise<GalleryImage[]> => {
  const url = getApiUrl(`/producer/${producerId}/gallery`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch gallery images: ${response.status}`);
  }

  const data: APIResponse<GalleryImage[]> = await response.json();
  return data.response || [];
};
