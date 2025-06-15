
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_CONFIG, setApiHost, resetApiHost } from '../config/api';

const DevApiConfig = () => {
  const [customHost, setCustomHost] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const environments = [
    { name: 'Local', url: 'http://localhost:8081' },
    { name: 'Production', url: 'https://services.greenyp.com' }
  ];

  const handleSetEnvironment = (url: string) => {
    setApiHost(url);
    console.log('API host updated to:', url);
    // Reload the page to use new configuration
    window.location.reload();
  };

  const handleSetCustomHost = () => {
    if (customHost.trim()) {
      setApiHost(customHost.trim());
      console.log('API host updated to:', customHost.trim());
      // Reload the page to use new configuration
      window.location.reload();
    }
  };

  const handleResetHost = () => {
    resetApiHost();
    console.log('API host reset to default');
    // Reload the page to use default configuration
    window.location.reload();
  };

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button 
          onClick={() => setIsVisible(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1"
          size="sm"
        >
          API Config
        </Button>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg min-w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">API Configuration</h3>
            <Button 
              onClick={() => setIsVisible(false)}
              variant="ghost" 
              size="sm"
              className="text-xs px-2 py-1"
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-3 text-xs">
            <div>
              <strong>Current:</strong> {API_CONFIG.BASE_URL}
            </div>
            
            <div>
              <strong>Quick Select:</strong>
              <div className="flex gap-1 mt-1">
                {environments.map((env) => (
                  <Button
                    key={env.name}
                    onClick={() => handleSetEnvironment(env.url)}
                    size="sm"
                    variant={API_CONFIG.BASE_URL === env.url ? "default" : "outline"}
                    className="text-xs px-2 h-7 flex-1"
                  >
                    {env.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <strong>Custom URL:</strong>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="http://localhost:3000"
                  value={customHost}
                  onChange={(e) => setCustomHost(e.target.value)}
                  className="text-xs h-8"
                />
                <Button 
                  onClick={handleSetCustomHost}
                  size="sm"
                  className="text-xs px-2 h-8"
                >
                  Set
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleResetHost}
              variant="outline"
              size="sm" 
              className="w-full text-xs h-8"
            >
              Reset to Default
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevApiConfig;
