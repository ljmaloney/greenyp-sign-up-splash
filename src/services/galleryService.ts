
import { getApiUrl } from '@/config/api';
import { APIResponse } from '@/types/responseBody';
import { apiClient } from '@/utils/apiClient';

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
  formData.append('file', file);

  const endpoint = `/producer/${producerId}/gallery`;
  const params = new URLSearchParams({
    imageFilename: file.name,
    imageDescription: description
  });

  try {
    const fullEndpoint = `${endpoint}?${params.toString()}`;
    console.log('Uploading gallery image with authentication:', { endpoint: fullEndpoint });
    
    // Use apiClient with FormData - no need for Content-Type header
    const response = await apiClient.request(fullEndpoint, {
      method: 'POST',
      body: formData,
      requireAuth: true
    });
    
    if (!response.success) {
      throw new Error(`Failed to upload image: ${response.status}`);
    }
    
    return { success: true, message: 'Image uploaded successfully' };
  } catch (error) {
    console.error('Gallery image upload failed:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (
  producerId: string, 
  imageFilename: string
): Promise<UploadImageResponse> => {
  const endpoint = `/producer/${producerId}/gallery`;
  const params = new URLSearchParams({
    imageFilename: imageFilename
  });

  try {
    const fullEndpoint = `${endpoint}?${params.toString()}`;
    console.log('Deleting gallery image with authentication:', { endpoint: fullEndpoint });
    
    const response = await apiClient.request(fullEndpoint, {
      method: 'DELETE',
      requireAuth: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.success) {
      throw new Error(`Failed to delete image: ${response.status}`);
    }
    
    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Gallery image deletion failed:', error);
    throw error;
  }
};

export const uploadProducerLogo = async (
  producerId: string, 
  file: File
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint = `/producer/${producerId}/logo`;
  const params = new URLSearchParams({
    logoFilename: file.name
  });

  try {
    const fullEndpoint = `${endpoint}?${params.toString()}`;
    console.log('Uploading producer logo with authentication:', { endpoint: fullEndpoint });
    
    // Use apiClient with FormData - no need for Content-Type header
    const response = await apiClient.request(fullEndpoint, {
      method: 'POST',
      body: formData,
      requireAuth: true
    });
    
    if (!response.success) {
      throw new Error(`Failed to upload logo: ${response.status}`);
    }
    
    return { success: true, message: 'Logo uploaded successfully' };
  } catch (error) {
    console.error('Logo upload failed:', error);
    throw error;
  }
};

export const deleteProducerLogo = async (
  producerId: string
): Promise<UploadImageResponse> => {
  const endpoint = `/producer/${producerId}/logo`;

  try {
    console.log('Deleting producer logo with authentication:', { endpoint });
    
    const response = await apiClient.request(endpoint, {
      method: 'DELETE',
      requireAuth: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.success) {
      throw new Error(`Failed to delete logo: ${response.status}`);
    }
    
    return { success: true, message: 'Logo deleted successfully' };
  } catch (error) {
    console.error('Logo deletion failed:', error);
    throw error;
  }
};

export const fetchGalleryImages = async (producerId: string): Promise<GalleryImage[]> => {
  const endpoint = `/producer/${producerId}/gallery`;
  
  try {
    console.log('Fetching gallery images with authentication:', { endpoint });
    
    const response = await apiClient.get<GalleryImage[]>(endpoint, {
      requireAuth: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.success) {
      throw new Error(`Failed to fetch images: ${response.status}`);
    }
    
    return response.response || [];
  } catch (error) {
    console.error('Fetching gallery images failed:', error);
    throw error;
  }
};

export interface LogoResponse {
  logoUrl: string;
}

export const fetchProducerLogo = async (producerId: string): Promise<string | null> => {
  const endpoint = `/producer/${producerId}/logo`;
  
  try {
    console.log('Fetching producer logo with authentication:', { endpoint });
    
    const response = await apiClient.get<LogoResponse>(endpoint, {
      requireAuth: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.success) {
      throw new Error(`Failed to fetch logo: ${response.status}`);
    }
    
    return response.response?.logoUrl || null;
  } catch (error) {
    console.error('Fetching producer logo failed:', error);
    throw error;
  }
};
