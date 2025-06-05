
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import ProfilePageLayout from './ProfilePageLayout';

const ProfileErrorState = () => {
  return (
    <ProfilePageLayout>
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
    </ProfilePageLayout>
  );
};

export default ProfileErrorState;
