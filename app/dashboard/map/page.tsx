// MapPage.jsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
import L, { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VehicleDetails } from '@/components/shared/vehicle-details';

const mapStyles = `
.custom-div-icon {
  background: none;
  border: none;
}
.navigation-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.speed-tooltip {
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  padding: 5px;
  font-size: 12px;
}
.start-icon {
  color: green;
}
.end-icon {
  color: red;
}
`;

interface Vehicle {
  id: string;
  position: LatLngTuple;
  fuelAmount: number;
  driver: string;
  startPoint: LatLngTuple;
  endPoint: LatLngTuple;
  status: string;
  speed: number;
  location: string;
  weather: {
    temperature: number;
    humidity: number;
    precipitation: number;
  };
  engineLoad: number;
  arrivalTime: string;
  route: LatLngTuple[];
  routeIndex: number;
  bearing: number;
}

const mockVehicles: Vehicle[] = [
  {
    id: '57432',
    position: [43.222, 76.8512],
    fuelAmount: 67,
    driver: 'Михаил Абай',
    startPoint: [43.222, 76.8512], // Almaty
    endPoint: [51.1605, 71.4704], // Astana
    status: 'В движении',
    speed: 64,
    location: 'Алматы',
    weather: {
      temperature: 30,
      humidity: 32,
      precipitation: 0,
    },
    engineLoad: 40,
    arrivalTime: '16:56',
    route: [],
    routeIndex: 0,
    bearing: 0,
  },
  {
    id: '57433',
    position: [53.2198, 63.6354],
    fuelAmount: 75,
    driver: 'Айдар Казбеков',
    startPoint: [53.2198, 63.6354], // Kostanay
    endPoint: [49.8028, 73.1021], // Karaganda
    status: 'В движении',
    speed: 72,
    location: 'Костанай',
    weather: {
      temperature: 28,
      humidity: 35,
      precipitation: 0,
    },
    engineLoad: 35,
    arrivalTime: '18:30',
    route: [],
    routeIndex: 0,
    bearing: 0,
  },
];

function VehicleMarker({
  vehicle,
  onClick,
  isSelected,
}: {
  vehicle: Vehicle;
  onClick: () => void;
  isSelected: boolean;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(vehicle.position);
    }
  }, [vehicle.position]);

  const customIcon = divIcon({
    className: 'custom-div-icon',
    html: `<img src="/navigation.svg" class="navigation-icon" style="transform: rotate(${vehicle.bearing}deg);" />`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <>
      <Marker
        position={vehicle.position}
        icon={customIcon}
        eventHandlers={{ click: onClick }}
        ref={markerRef}
      >
        <Tooltip
          permanent
          direction="top"
          offset={[0, -20]}
          className="speed-tooltip"
        >
          {vehicle.speed} км/ч
        </Tooltip>
      </Marker>
      {isSelected && (
        <>
          <Polyline positions={vehicle.route} color="#4CAF50" weight={4} />
          <DestinationMarker position={vehicle.startPoint} isStart={true} />
          <DestinationMarker position={vehicle.endPoint} isStart={false} />
        </>
      )}
    </>
  );
}

function DestinationMarker({
  position,
  isStart,
}: {
  position: LatLngTuple;
  isStart: boolean;
}) {
  const icon = divIcon({
    className: `custom-div-icon ${isStart ? 'start-icon' : 'end-icon'}`,
    html: isStart ? '🟢' : '🔴',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Marker position={position} icon={icon}>
      <Tooltip permanent direction="top" offset={[0, -20]}>
        {isStart ? 'Начало' : 'Конец'}
      </Tooltip>
    </Marker>
  );
}

function MapEventHandler({
  onDragEnd,
}: {
  onDragEnd: (center: LatLngTuple) => void;
}) {
  const map = useMapEvents({
    dragend: () => {
      const center = map.getCenter();
      onDragEnd([center.lat, center.lng]);
    },
  });
  return null;
}

export default function MapPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([48.0196, 66.9237]); // Center of Kazakhstan

  const calculateBearing = useCallback(
    (start: LatLngTuple, end: LatLngTuple) => {
      const toRad = (degree: number) => (degree * Math.PI) / 180;
      const toDeg = (radian: number) => (radian * 180) / Math.PI;

      const lat1 = toRad(start[0]);
      const lon1 = toRad(start[1]);
      const lat2 = toRad(end[0]);
      const lon2 = toRad(end[1]);

      const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      const bearing = toDeg(Math.atan2(y, x));

      return (bearing + 360) % 360;
    },
    []
  );

  // Generate routes for all vehicles on component mount
  useEffect(() => {
    vehicles.forEach((vehicle) => {
      fetchRoute(vehicle.startPoint, vehicle.endPoint, vehicle.id);
    });
  }, []);

  const fetchRoute = useCallback(
    async (start: LatLngTuple, end: LatLngTuple, vehicleId: string) => {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const coordinates = data.features[0].geometry.coordinates.map(
          (coord: number[]) => [coord[1], coord[0]] as LatLngTuple
        );
        handleRouteFound(coordinates, vehicleId);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    },
    []
  );

  const updateVehicles = useCallback(() => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => {
        if (
          vehicle.route.length < 2 ||
          vehicle.routeIndex >= vehicle.route.length - 1
        ) {
          return vehicle;
        }

        const nextIndex = vehicle.routeIndex + 1;
        const currentPoint = vehicle.route[vehicle.routeIndex];
        const nextPoint = vehicle.route[nextIndex];

        return {
          ...vehicle,
          position: nextPoint,
          routeIndex: nextIndex,
          bearing: calculateBearing(currentPoint, nextPoint),
          speed: Math.floor(Math.random() * 30) + 50, // Random speed between 50 and 80 km/h
        };
      })
    );
  }, [calculateBearing]);

  useEffect(() => {
    const intervalId = setInterval(updateVehicles, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [updateVehicles]);

  const handleRouteFound = useCallback(
    (route: LatLngTuple[], vehicleId: string) => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.id === vehicleId
            ? { ...vehicle, route, routeIndex: 0 }
            : vehicle
        )
      );
    },
    []
  );

  const handleVehicleClick = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleCloseVehicleDetails = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const handleMapDragEnd = useCallback((center: LatLngTuple) => {
    setMapCenter(center);
  }, []);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <style>{mapStyles}</style>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Карта транспорта</h2>
        <div className="aspect-video bg-muted relative">
          <MapContainer
            center={mapCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {vehicles.map((vehicle) => (
              <VehicleMarker
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => handleVehicleClick(vehicle)}
                isSelected={selectedVehicle?.id === vehicle.id}
              />
            ))}
            <MapEventHandler onDragEnd={handleMapDragEnd} />
          </MapContainer>
          {selectedVehicle && (
            <VehicleDetails
              vehicle={selectedVehicle}
              onClose={handleCloseVehicleDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
}
