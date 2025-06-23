
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileAboutProps {
  businessNarrative: string;
}

const ProfileAbout = ({ businessNarrative }: ProfileAboutProps) => {
  if (!businessNarrative) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{businessNarrative}</p>
      </CardContent>
    </Card>
  );
};

export default ProfileAbout;
