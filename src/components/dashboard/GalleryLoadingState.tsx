
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GalleryLoadingState = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Photo Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading images...</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryLoadingState;
