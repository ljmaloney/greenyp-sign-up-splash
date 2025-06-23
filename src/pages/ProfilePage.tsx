
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SearchResultsLayout from '@/components/search/SearchResultsLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileAbout from '@/components/profile/ProfileAbout';
import ProfileProducts from '@/components/profile/ProfileProducts';
import ProfileServices from '@/components/profile/ProfileServices';
import ProfileContactInfo from '@/components/profile/ProfileContactInfo';
import ProfileBusinessHours from '@/components/profile/ProfileBusinessHours';
import type { ProducerProfileResponse, ProductsResponse, ServicesResponse } from '@/types/profile';

const ProfilePage = () => {
  const { producerId, producerLocationId } = useParams<{ producerId: string; producerLocationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<ProducerProfileResponse | null>(null);
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFeature = (featureName: string): boolean => {
    return true;
  };

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/search');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!producerId || !producerLocationId) return;

      setLoading(true);
      setError(null);

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
        setProfile(profileData);

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
              const productsData: ProductsResponse = await productsResponse.json();
              setProducts(productsData);
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
              const servicesData: ServicesResponse = await servicesResponse.json();
              setServices(servicesData);
            }
          } catch (err) {
            console.warn('Failed to fetch services:', err);
          }
        }

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [producerId, producerLocationId]);

  if (loading) {
    return (
      <SearchResultsLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenyp-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading profile...</p>
          </div>
        </div>
      </SearchResultsLayout>
    );
  }

  if (error || !profile) {
    return (
      <SearchResultsLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested profile could not be found.'}</p>
            <ProfileHeader 
              businessName="Profile Not Found"
              onBackClick={handleBackClick}
            />
          </div>
        </div>
      </SearchResultsLayout>
    );
  }

  const profileData = profile.response;

  return (
    <SearchResultsLayout>
      <div className="container mx-auto max-w-4xl px-4">
        <ProfileHeader 
          businessName={profileData.businessName}
          locationName={profileData.locationName}
          onBackClick={handleBackClick}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileAbout businessNarrative={profileData.businessNarrative} />
            <ProfileProducts products={products} hasFeature={hasFeature} />
            <ProfileServices services={services} hasFeature={hasFeature} />
          </div>

          {/* Right Column - Contact & Hours */}
          <div className="space-y-6">
            <ProfileContactInfo profile={profileData} />
            <ProfileBusinessHours locationHours={profileData.locationHours} />
          </div>
        </div>
      </div>
    </SearchResultsLayout>
  );
};

export default ProfilePage;
