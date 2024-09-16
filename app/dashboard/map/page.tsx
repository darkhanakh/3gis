'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
  Tooltip,
} from 'react-leaflet';
import L, { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { VehicleDetails } from '@/components/shared/vehicle-details';

const mapStyles = `
.leaflet-routing-container {
  display: none;
}
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
`;

export interface Vehicle {
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
}

const almaty: LatLngTuple = [43.222, 76.8512];
const astana: LatLngTuple = [51.1605, 71.4704];

const vehicle: Vehicle = {
  id: '57432',
  position: almaty,
  fuelAmount: 67,
  driver: 'Михаил Абай',
  startPoint: almaty,
  endPoint: astana,
  status: 'В движении',
  speed: 64,
  location: '45632 3243, Белое, Петропавловск',
  weather: {
    temperature: 30,
    humidity: 32,
    precipitation: 0,
  },
  engineLoad: 40,
  arrivalTime: '16:56',
};

function RoutingMachine({
  startPoint,
  endPoint,
  onRouteFound,
}: {
  startPoint: LatLngTuple;
  endPoint: LatLngTuple;
  onRouteFound: (route: LatLngTuple[]) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(startPoint), L.latLng(endPoint)],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#4CAF50', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const coordinates = routes[0].coordinates;
        onRouteFound(coordinates.map((coord) => [coord.lat, coord.lng]));
      }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, startPoint, endPoint, onRouteFound]);

  return null;
}

function VehicleMarker({
  position,
  bearing,
  speed,
  onClick,
}: {
  position: LatLngTuple;
  bearing: number;
  speed: number;
  onClick: () => void;
}) {
  const customIcon = divIcon({
    className: 'custom-div-icon',
    html: `<img src="/navigation.svg" class="navigation-icon" style="transform: rotate(${bearing}deg);" />`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{ click: onClick }}
    >
      <Tooltip
        permanent
        direction="top"
        offset={[0, -20]}
        className="speed-tooltip"
      >
        {speed} км/ч
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
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPosition, setCurrentPosition] = useState<LatLngTuple>(
    vehicle.startPoint
  );
  const [routePoints, setRoutePoints] = useState<LatLngTuple[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [speed, setSpeed] = useState(vehicle.speed);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([48.0196, 66.9237]); // Center of Kazakhstan
  const mapRef = useRef<L.Map | null>(null);

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

  useEffect(() => {
    if (routePoints.length < 2 || routeIndex >= routePoints.length - 1) return;

    const updateInterval = setInterval(() => {
      setRouteIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= routePoints.length - 1) {
          clearInterval(updateInterval);
          return prevIndex;
        }

        const currentPoint = routePoints[prevIndex];
        const nextPoint = routePoints[nextIndex];

        setCurrentPosition(nextPoint);
        setBearing(calculateBearing(currentPoint, nextPoint));

        return nextIndex;
      });
    }, 1000); // Update every second

    return () => clearInterval(updateInterval);
  }, [routePoints, routeIndex, calculateBearing]);

  useEffect(() => {
    const updateSpeed = () => {
      const newSpeed = Math.floor(Math.random() * 30) + 50;
      setSpeed(newSpeed);
    };

    const intervalId = setInterval(updateSpeed, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleRouteFound = useCallback((route: LatLngTuple[]) => {
    setRoutePoints(route);
    setRouteIndex(0);
  }, []);

  const handleVehicleClick = useCallback(() => {
    setSelectedVehicle(vehicle);
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
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <RoutingMachine
              startPoint={vehicle.startPoint}
              endPoint={vehicle.endPoint}
              onRouteFound={handleRouteFound}
            />
            <Polyline positions={routePoints} color="#4CAF50" weight={4} />
            <VehicleMarker
              position={currentPosition}
              bearing={bearing}
              speed={speed}
              onClick={handleVehicleClick}
            />
            <MapEventHandler onDragEnd={handleMapDragEnd} />
          </MapContainer>
          {selectedVehicle && (
            <VehicleDetails
              vehicle={{ ...selectedVehicle, speed, position: currentPosition }}
              onClose={() => setSelectedVehicle(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
