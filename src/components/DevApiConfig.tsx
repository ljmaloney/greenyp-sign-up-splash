
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_CONFIG, setApiHost, resetApiHost, setImageHost, resetImageHost, setUseLocalApi } from '../config/api';
import { Zap, Globe, Server, AlertCircle } from 'lucide-react';

const DevApiConfig = () => {
  const [customHost, setCustomHost] = useState('');
  const [customImageHost, setCustomImageHost] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isUsingLocalApi, setIsUsingLocalApi] = useState(false);

  // Check local storage on mount
  useEffect(() => {
    try {
      const storedHost = localStorage.getItem('API_HOST');
      const useLocalApi = localStorage.getItem('USE_LOCAL_API') === 'true';
      setIsUsingLocalApi(useLocalApi || (storedHost === 'http://localhost:8081'));
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }, []);

  const environments = [
    { name: 'Local', url: 'http://localhost:8081', imageUrl: 'http://localhost:8081' },
    { name: 'Production', url: 'https://services.greenyp.com', imageUrl: 'https://services.greenyp.com' }
  ];

  const handleSetEnvironment = (url: string, imageUrl: string) => {
    setApiHost(url);
    setImageHost(imageUrl);
    setIsUsingLocalApi(url === 'http://localhost:8081');
    console.log('API host updated to:', url);
    console.log('Image host updated to:', imageUrl);
    // Reload the page to use new configuration
    window.location.reload();
  };

  const handleSetLocalEnvironment = () => {
    setUseLocalApi(true);
    setIsUsingLocalApi(true);
    console.log('API set to local: http://localhost:8081');
  };

  const handleSetCustomHost = () => {
    if (customHost.trim()) {
      setApiHost(customHost.trim());
      setIsUsingLocalApi(customHost.trim() === 'http://localhost:8081');
      console.log('API host updated to:', customHost.trim());
      // Reload the page to use new configuration
      window.location.reload();
    }
  };

  const handleSetCustomImageHost = () => {
    if (customImageHost.trim()) {
      setImageHost(customImageHost.trim());
      console.log('Image host updated to:', customImageHost.trim());
      // Reload the page to use new configuration
      window.location.reload();
    }
  };

  const handleResetHost = () => {
    resetApiHost();
    resetImageHost();
    setIsUsingLocalApi(false);
    console.log('API and Image hosts reset to default');
    // Reload the page to use default configuration
    window.location.reload();
  };

  // Check if lovable should be hidden via environment variable
  const hideLovable = import.meta.env.VITE_HIDE_LOVABLE === 'true';
  
  // Debug logging to see environment variable value
  console.log('🔧 DevApiConfig Debug:', {
    VITE_HIDE_LOVABLE: import.meta.env.VITE_HIDE_LOVABLE,
    hideLovable,
    willShow: !hideLovable
  });
  
  if (hideLovable) {
    return null;
  }

  // Highlight if we're not using local API
  const isLocalApiRunning = false; // We don't know this yet, but could implement a check
  const showWarning = !isUsingLocalApi && isLocalApiRunning;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <div className="flex flex-col gap-2">
          {/* Quick Local API Toggle */}
          <Button 
            onClick={handleSetLocalEnvironment}
            className={`text-white text-xs px-3 py-1 flex items-center ${isUsingLocalApi ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            size="sm"
          >
            <Server className="w-4 h-4 mr-1" />
            {isUsingLocalApi ? 'Using Local API' : 'Switch to Local API'}
          </Button>
          
          {/* API Config Button */}
          <Button 
            onClick={() => setIsVisible(true)}
            className={`text-white text-xs px-3 py-1 ${showWarning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-700 hover:bg-gray-800'}`}
            size="sm"
          >
            {showWarning ? (
              <>
                <AlertCircle className="w-4 h-4 mr-1" />
                API Warning
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-1" />
                API Config
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg min-w-72">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              API Configuration
            </h3>
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
            <div className={`p-2 rounded ${isUsingLocalApi ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <strong>Current API:</strong> {API_CONFIG.BASE_URL}
              <div className="mt-1">
                <strong>Images:</strong> {API_CONFIG.IMAGE_BASE_URL}
              </div>
              {isUsingLocalApi && (
                <div className="mt-1 text-green-600 flex items-center">
                  <Server className="w-3 h-3 mr-1" />
                  Using Local API
                </div>
              )}
            </div>
            
            <div>
              <strong>Quick Select:</strong>
              <div className="flex gap-1 mt-1">
                {environments.map((env) => (
                  <Button
                    key={env.name}
                    onClick={() => handleSetEnvironment(env.url, env.imageUrl)}
                    size="sm"
                    variant={API_CONFIG.BASE_URL === env.url ? "default" : "outline"}
                    className={`text-xs px-2 h-7 flex-1 ${API_CONFIG.BASE_URL === env.url ? (env.name === 'Local' ? 'bg-green-600 hover:bg-green-700' : '') : ''}`}
                  >
                    {env.name === 'Local' && <Server className="w-3 h-3 mr-1" />}
                    {env.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <strong>Custom API URL:</strong>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="http://localhost:8081"
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

            <div>
              <strong>Custom Image URL:</strong>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="http://localhost:8081"
                  value={customImageHost}
                  onChange={(e) => setCustomImageHost(e.target.value)}
                  className="text-xs h-8"
                />
                <Button 
                  onClick={handleSetCustomImageHost}
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
