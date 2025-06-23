
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ProfilePageLayout from './ProfilePageLayout';

const ProfileLoadingState = () => {
  return (
    <ProfilePageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Skeleton className="w-16 h-16 mr-4 rounded-lg" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full md:col-span-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-20 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProfilePageLayout>
  );
};

export default ProfileLoadingState;
