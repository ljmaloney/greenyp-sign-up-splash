
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapProps {
  latitude: string;
  longitude: string;
  businessName: string;
}

const Map = ({ latitude, longitude, businessName }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

  useEffect(() => {
    // Check if we have a token in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !latitude || !longitude) return;

    try {
      // Set the access token
      mapboxgl.accessToken = mapboxToken;
      
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [lng, lat],
        zoom: 14,
      });

      // Add a marker for the business location
      new mapboxgl.Marker({ color: '#059669' })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${businessName}</h3>`)
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, businessName, mapboxToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const token = formData.get('token') as string;
    
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
      setShowTokenInput(false);
    }
  };

  const handleMapClick = () => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  if (showTokenInput) {
    return (
      <div className="w-64 h-48 bg-gray-100 border border-gray-200 rounded-lg p-4 flex flex-col justify-center">
        <div className="text-center mb-4">
          <MapPin className="w-8 h-8 text-greenyp-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Enter your Mapbox token to view the map</p>
        </div>
        <form onSubmit={handleTokenSubmit} className="space-y-2">
          <input
            type="text"
            name="token"
            placeholder="Mapbox public token"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full px-2 py-1 text-xs bg-greenyp-600 text-white rounded hover:bg-greenyp-700"
          >
            Load Map
          </button>
        </form>
        <button
          onClick={handleMapClick}
          className="mt-2 text-xs text-greenyp-600 hover:text-greenyp-700 underline"
        >
          View on Google Maps
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 h-48 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden relative">
      <div ref={mapContainer} className="absolute inset-0" />
      <button
        onClick={handleMapClick}
        className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded shadow text-xs text-gray-700"
        title="Open in Google Maps"
      >
        <MapPin className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Map;
