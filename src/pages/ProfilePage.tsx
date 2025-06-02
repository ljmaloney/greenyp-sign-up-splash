
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Globe, Clock, ArrowLeft } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileData } from '@/types/profile';

// Mock profile data based on the providers from CategoryPage
const getMockProfileData = (producerId: string): ProfileData => {
  const mockProfiles: Record<string, ProfileData> = {
    'producer-001': {
      producerId: 'producer-001',
      businessName: 'Green Thumb Landscaping',
      narrative: 'We are a family-owned landscaping business with over 15 years of experience in creating beautiful outdoor spaces. Our team specializes in custom landscape design, installation, and maintenance services for both residential and commercial properties. We pride ourselves on using sustainable practices and native plants to create environmentally friendly landscapes that thrive in the Arizona climate.',
      locationName: 'Phoenix Main Office',
      locationType: 'OFFICE',
      locationDisplayType: 'BUSINESS_ADDRESS',
      active: true,
      addressLine1: '1234 Main Street',
      addressLine2: 'Suite 100',
      addressLine3: '',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85001',
      latitude: '33.4484',
      longitude: '-112.0740',
      websiteUrl: 'https://greenthumblandscaping.com',
      contactName: 'John Smith',
      phoneNumber: '(602) 555-1234',
      cellPhoneNumber: '(602) 555-5678',
      locationHours: [
        { dayOfWeek: 'MONDAY', openTime: '7:00 AM', closeTime: '6:00 PM' },
        { dayOfWeek: 'TUESDAY', openTime: '7:00 AM', closeTime: '6:00 PM' },
        { dayOfWeek: 'WEDNESDAY', openTime: '7:00 AM', closeTime: '6:00 PM' },
        { dayOfWeek: 'THURSDAY', openTime: '7:00 AM', closeTime: '6:00 PM' },
        { dayOfWeek: 'FRIDAY', openTime: '7:00 AM', closeTime: '6:00 PM' },
        { dayOfWeek: 'SATURDAY', openTime: '8:00 AM', closeTime: '4:00 PM' },
        { dayOfWeek: 'SUNDAY', openTime: '', closeTime: '' }
      ]
    },
    'producer-002': {
      producerId: 'producer-002',
      businessName: "Nature's Design",
      narrative: "At Nature's Design, we believe that every outdoor space has the potential to become a personal oasis. Our award-winning design team works closely with clients to create stunning landscapes that reflect their unique style and complement their home's architecture. From drought-resistant gardens to lush entertainment areas, we bring your vision to life.",
      locationName: "Scottsdale Design Center",
      locationType: 'SHOWROOM',
      locationDisplayType: 'BUSINESS_ADDRESS',
      active: true,
      addressLine1: '5678 Desert View Road',
      addressLine2: '',
      addressLine3: '',
      city: 'Scottsdale',
      state: 'AZ',
      postalCode: '85260',
      latitude: '33.5092',
      longitude: '-111.8906',
      websiteUrl: 'https://naturesdesignaz.com',
      contactName: 'Sarah Johnson',
      phoneNumber: '(480) 555-5678',
      cellPhoneNumber: '(480) 555-9012',
      locationHours: [
        { dayOfWeek: 'MONDAY', openTime: '8:00 AM', closeTime: '5:00 PM' },
        { dayOfWeek: 'TUESDAY', openTime: '8:00 AM', closeTime: '5:00 PM' },
        { dayOfWeek: 'WEDNESDAY', openTime: '8:00 AM', closeTime: '5:00 PM' },
        { dayOfWeek: 'THURSDAY', openTime: '8:00 AM', closeTime: '5:00 PM' },
        { dayOfWeek: 'FRIDAY', openTime: '8:00 AM', closeTime: '5:00 PM' },
        { dayOfWeek: 'SATURDAY', openTime: '9:00 AM', closeTime: '3:00 PM' },
        { dayOfWeek: 'SUNDAY', openTime: '', closeTime: '' }
      ]
    },
    'producer-003': {
      producerId: 'producer-003',
      businessName: 'Outdoor Creations',
      narrative: 'Outdoor Creations specializes in transforming ordinary backyards into extraordinary outdoor living spaces. Our comprehensive services include landscape design, hardscaping, outdoor kitchens, fire features, and water elements. With a focus on craftsmanship and attention to detail, we create outdoor environments that enhance your lifestyle and increase your property value.',
      locationName: 'Mesa Service Center',
      locationType: 'WAREHOUSE',
      locationDisplayType: 'BUSINESS_ADDRESS',
      active: true,
      addressLine1: '9012 Industrial Blvd',
      addressLine2: 'Building C',
      addressLine3: '',
      city: 'Mesa',
      state: 'AZ',
      postalCode: '85210',
      latitude: '33.4152',
      longitude: '-111.8315',
      websiteUrl: 'https://outdoorcreationsaz.com',
      contactName: 'Mike Rodriguez',
      phoneNumber: '(480) 555-9012',
      cellPhoneNumber: '(480) 555-3456',
      locationHours: [
        { dayOfWeek: 'MONDAY', openTime: '6:00 AM', closeTime: '7:00 PM' },
        { dayOfWeek: 'TUESDAY', openTime: '6:00 AM', closeTime: '7:00 PM' },
        { dayOfWeek: 'WEDNESDAY', openTime: '6:00 AM', closeTime: '7:00 PM' },
        { dayOfWeek: 'THURSDAY', openTime: '6:00 AM', closeTime: '7:00 PM' },
        { dayOfWeek: 'FRIDAY', openTime: '6:00 AM', closeTime: '7:00 PM' },
        { dayOfWeek: 'SATURDAY', openTime: '7:00 AM', closeTime: '5:00 PM' },
        { dayOfWeek: 'SUNDAY', openTime: '8:00 AM', closeTime: '4:00 PM' }
      ]
    }
  };

  return mockProfiles[producerId] || mockProfiles['producer-001'];
};

const ProfilePage = () => {
  const { producerId } = useParams<{ producerId: string }>();
  
  const { data: profileResponse, isLoading, error } = useProfile(producerId || '');
  
  // Use mock data if API fails or for testing
  const profile = profileResponse?.response || getMockProfileData(producerId || 'producer-001');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Profile...</h1>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error && !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="mb-8">We couldn't find the profile you're looking for.</p>
          <Link to="/categories">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formatAddress = () => {
    const parts = [
      profile.addressLine1,
      profile.addressLine2,
      profile.addressLine3,
      `${profile.city}, ${profile.state} ${profile.postalCode}`
    ].filter(Boolean);
    return parts.join(', ');
  };

  const formatHours = () => {
    const dayOrder = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayNames = {
      'SUNDAY': 'Sunday',
      'MONDAY': 'Monday', 
      'TUESDAY': 'Tuesday',
      'WEDNESDAY': 'Wednesday',
      'THURSDAY': 'Thursday',
      'FRIDAY': 'Friday',
      'SATURDAY': 'Saturday'
    };
    
    return dayOrder.map(day => {
      const hours = profile.locationHours.find(h => h.dayOfWeek === day);
      return {
        day: dayNames[day as keyof typeof dayNames],
        hours: hours && hours.openTime && hours.closeTime ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Navigation */}
        <section className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <Link to="/categories" className="inline-flex items-center text-greenyp-600 hover:text-greenyp-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Link>
          </div>
        </section>

        {/* Profile Header */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{profile.businessName}</h1>
              
              {profile.narrative && (
                <div className="bg-greenyp-50 p-6 rounded-lg border border-greenyp-200 mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed">{profile.narrative}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-greenyp-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.contactName && (
                      <div>
                        <span className="font-medium text-gray-700">Contact: </span>
                        <span className="text-gray-600">{profile.contactName}</span>
                      </div>
                    )}
                    {profile.phoneNumber && (
                      <div>
                        <span className="font-medium text-gray-700">Phone: </span>
                        <a href={`tel:${profile.phoneNumber}`} className="text-greenyp-600 hover:underline">
                          {profile.phoneNumber}
                        </a>
                      </div>
                    )}
                    {profile.cellPhoneNumber && (
                      <div>
                        <span className="font-medium text-gray-700">Cell: </span>
                        <a href={`tel:${profile.cellPhoneNumber}`} className="text-greenyp-600 hover:underline">
                          {profile.cellPhoneNumber}
                        </a>
                      </div>
                    )}
                    {profile.websiteUrl && (
                      <div>
                        <span className="font-medium text-gray-700">Website: </span>
                        <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-greenyp-600 hover:underline inline-flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.locationName && (
                      <div className="mb-3">
                        <span className="font-medium text-gray-700">Location Name: </span>
                        <span className="text-gray-600">{profile.locationName}</span>
                      </div>
                    )}
                    <div className="text-gray-600">
                      {formatAddress()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Business Hours */}
              {profile.locationHours.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-greenyp-600" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formatHours().map((dayHours, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium text-gray-700">{dayHours.day}:</span>
                          <span className="text-gray-600">{dayHours.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
                  Get Quote
                </Button>
                <Button variant="outline" className="border-greenyp-600 text-greenyp-700">
                  Save to Favorites
                </Button>
                {profile.phoneNumber && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${profile.phoneNumber}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
