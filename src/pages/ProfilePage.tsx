
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SearchResultsLayout from '@/components/search/SearchResultsLayout';
import ProfileDataLoader from '@/components/profile/ProfileDataLoader';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';
import type { ProducerProfileResponse, ProductsResponse, ServicesResponse } from '@/types/profile';

const ProfilePage = () => {
  const { producerId, producerLocationId } = useParams<{ producerId: string; producerLocationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<ProducerProfileResponse | null>(null);
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/search');
    }
  };

  const handleDataLoaded = (data: {
    profile: ProducerProfileResponse;
    products: ProductsResponse | null;
    services: ServicesResponse | null;
  }) => {
    setProfile(data.profile);
    setProducts(data.products);
    setServices(data.services);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  if (!producerId || !producerLocationId) {
    return (
      <SearchResultsLayout>
        <ProfileErrorState 
          error="Invalid profile parameters"
          onBackClick={handleBackClick}
        />
      </SearchResultsLayout>
    );
  }

  return (
    <SearchResultsLayout>
      <ProfileDataLoader
        producerId={producerId}
        producerLocationId={producerLocationId}
        onDataLoaded={handleDataLoaded}
        onError={handleError}
        onLoadingChange={handleLoadingChange}
      />
      
      {loading && <ProfileLoadingState />}
      
      {error && !loading && (
        <ProfileErrorState 
          error={error}
          onBackClick={handleBackClick}
        />
      )}
      
      {!loading && !error && profile && (
        <ProfileLayout
          profileData={profile.response}
          products={products}
          services={services}
          onBackClick={handleBackClick}
        />
      )}
    </SearchResultsLayout>
  );
};

export default ProfilePage;
