
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfilePageLayout from './ProfilePageLayout';

interface ProfileErrorStateProps {
  error: Error;
}

const ProfileErrorState = ({ error }: ProfileErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <ProfilePageLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Profile Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error.message || 'The profile you are looking for could not be found.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfilePageLayout>
  );
};

export default ProfileErrorState;
