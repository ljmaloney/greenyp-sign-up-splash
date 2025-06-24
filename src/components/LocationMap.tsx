
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  latitude: string;
  longitude: string;
  businessName: string;
}

const LocationMap = ({ latitude, longitude, businessName }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Initialize MapLibre map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Free MapLibre style
      center: [lng, lat],
      zoom: 14,
    });

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

  const handleMapClick = () => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

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

export default LocationMap;
