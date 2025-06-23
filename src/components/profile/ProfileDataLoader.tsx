
import React, { useEffect, useState } from 'react';
import type { ProducerProfileResponse, ProductsResponse, ServicesResponse } from '@/types/profile';

interface ProfileDataLoaderProps {
  producerId: string;
  producerLocationId: string;
  onDataLoaded: (data: {
    profile: ProducerProfileResponse;
    products: ProductsResponse | null;
    services: ServicesResponse | null;
  }) => void;
  onError: (error: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

const ProfileDataLoader = ({ 
  producerId, 
  producerLocationId, 
  onDataLoaded, 
  onError, 
  onLoadingChange 
}: ProfileDataLoaderProps) => {
  const hasFeature = (featureName: string): boolean => {
    return true;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      onLoadingChange(true);
      onError('');

      try {
        const profileUrl = `http://localhost:8081/profile/${producerId}/location/${producerLocationId}`;
        console.log('Fetching profile from:', profileUrl);
        
        const profileResponse = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }
        
        const profileData: ProducerProfileResponse = await profileResponse.json();
        console.log('Profile data received:', profileData);

        let productsData: ProductsResponse | null = null;
        let servicesData: ServicesResponse | null = null;

        if (hasFeature('products')) {
          try {
            const productsUrl = `http://localhost:8081/producer/${producerId}/location/${producerLocationId}/products`;
            console.log('Fetching products from:', productsUrl);
            
            const productsResponse = await fetch(productsUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (productsResponse.ok) {
              productsData = await productsResponse.json();
            }
          } catch (err) {
            console.warn('Failed to fetch products:', err);
          }
        }

        if (hasFeature('services')) {
          try {
            const servicesUrl = `http://localhost:8081/producer/${producerId}/location/${producerLocationId}/services`;
            console.log('Fetching services from:', servicesUrl);
            
            const servicesResponse = await fetch(servicesUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (servicesResponse.ok) {
              servicesData = await servicesResponse.json();
            }
          } catch (err) {
            console.warn('Failed to fetch services:', err);
          }
        }

        onDataLoaded({
          profile: profileData,
          products: productsData,
          services: servicesData
        });

      } catch (err) {
        console.error('Error fetching profile data:', err);
        onError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        onLoadingChange(false);
      }
    };

    if (producerId && producerLocationId) {
      fetchProfileData();
    }
  }, [producerId, producerLocationId, onDataLoaded, onError, onLoadingChange]);

  return null; // This component doesn't render anything
};

export default ProfileDataLoader;
