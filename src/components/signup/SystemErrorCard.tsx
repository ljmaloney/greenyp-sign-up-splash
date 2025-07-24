
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const SystemErrorCard = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-600" />
        </div>
        <CardTitle className="text-2xl text-red-800">System Error</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-gray-600">
          We're experiencing technical difficulties. Our team has been notified and is working to resolve this issue.
        </p>
        <p className="text-sm text-gray-500">
          Please try again in a few moments, or contact support if the problem persists.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetry} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 mt-6">
          Error Code: SYS-{Math.random().toString(36).substr(2, 8).toUpperCase()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemErrorCard;
