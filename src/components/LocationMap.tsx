
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ExternalLink, Navigation } from 'lucide-react';

interface LocationMapProps {
  latitude: string;
  longitude: string;
  businessName: string;
  width?: string;
  height?: string;
  showLinks?: boolean;
}

const LocationMap = ({ 
  latitude, 
  longitude, 
  businessName, 
  width = "w-80", 
  height = "h-60",
  showLinks = true 
}: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Initialize MapLibre map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/basic/style.json?key=gkmPj4sliSAhXjX94Anp', // Free MapLibre style
      center: [lng, lat],
      zoom: 14,
      attributionControl: false, // Disable default attribution
    });

    // Add minimal custom attribution
    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: '© MapTiler'
      }),
      'bottom-right'
    );

    // Add a marker for the business location
    new maplibregl.Marker({ color: '#059669' })
      .setLngLat([lng, lat])
      .setPopup(
        new maplibregl.Popup({ offset: 25 })
          .setHTML(`<h3>${businessName}</h3>`)
      )
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, businessName]);

  const handleShowLarger = () => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <div className={`${width} ${height} bg-gray-100 border border-gray-200 rounded-lg overflow-hidden relative`}>
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      
      {showLinks && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleShowLarger}
            className="flex items-center gap-1 text-sm text-greenyp-600 hover:text-greenyp-700 underline"
          >
            <ExternalLink className="w-3 h-3" />
            Show Larger
          </button>
          <button
            onClick={handleGetDirections}
            className="flex items-center gap-1 text-sm text-greenyp-600 hover:text-greenyp-700 underline"
          >
            <Navigation className="w-3 h-3" />
            Get Directions
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
