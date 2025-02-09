'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; 
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

interface MapDialogProps {
  coordinates: [number, number];
}

const MapComponent = ({ coordinates }: { coordinates: [number, number] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      const instance = L.map(mapRef.current).setView(coordinates, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(instance);

      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      L.marker(coordinates, { icon: DefaultIcon }).addTo(instance);

      mapInstanceRef.current = instance;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  const showDirections = () => {
    if (mapInstanceRef.current && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoordinates = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          if (routingControlRef.current) {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.removeControl(routingControlRef.current);
            }
          }

          routingControlRef.current = L.Routing.control({
            waypoints: [
              L.latLng(userCoordinates as [number, number]),
              L.latLng(coordinates),
            ],
            routeWhileDragging: true,
            lineOptions: {
              styles: [{ color: 'blue', weight: 4 }],
            },
            createMarker: () => null,
            show: false, 
            addWaypoints: false,
          }).addTo(mapInstanceRef.current);

          const routingContainer = document.querySelector(
            '.leaflet-routing-container'
          ) as HTMLElement;
          if (routingContainer) {
            routingContainer.style.display = 'none';
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [mapInstanceRef.current]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-md border border-gray-200"
      />
      <div className="absolute top-4 left-4 z-50">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 shadow-md"
          onClick={showDirections}
        >
          Directions
        </Button>
      </div>
    </div>
  );
};

const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
      Loading map...
    </div>
  ),
});

const MapDialog: React.FC<MapDialogProps> = ({ coordinates }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-white">
          Show Map
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Location Map</DialogTitle>
          <DialogDescription>
            Interactive map showing the hospital location.
          </DialogDescription>
        </DialogHeader>
        <DynamicMap coordinates={coordinates} />
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;