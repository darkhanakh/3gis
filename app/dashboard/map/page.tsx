'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { VehicleDetails } from '@/components/shared/vehicle-details';

// CSS for leaflet-routing-machine
const routingMachineStyle = `
.leaflet-routing-container {
  color: black;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}
.leaflet-routing-alt {
  max-height: 200px;
  overflow-y: auto;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.leaflet-routing-geocoders input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
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

const carIcon = new Icon({
  iconUrl: '/truck.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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
}: {
  startPoint: LatLngTuple;
  endPoint: LatLngTuple;
}) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    const addRoutingControl = () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [L.latLng(startPoint), L.latLng(endPoint)],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: '#6366F1', weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
      }).addTo(map);
    };

    // Use a short timeout to ensure the map is ready
    const timeoutId = setTimeout(addRoutingControl, 100);

    return () => {
      clearTimeout(timeoutId);
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, startPoint, endPoint]);

  return null;
}

export default function MapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPosition, setCurrentPosition] = useState<LatLngTuple>(
    vehicle.startPoint
  );
  const [routePoints, setRoutePoints] = useState<LatLngTuple[]>([]);
  const [progress, setProgress] = useState(0);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${vehicle.startPoint[1]},${vehicle.startPoint[0]};${vehicle.endPoint[1]},${vehicle.endPoint[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      const coordinates = data.routes[0].geometry.coordinates.map(
        (coord: number[]) => [coord[1], coord[0]] as LatLngTuple
      );
      setRoutePoints(coordinates);
    };

    fetchRoute();
  }, []);

  useEffect(() => {
    if (routePoints.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= routePoints.length - 1) {
          clearInterval(interval);
          return prevProgress;
        }
        const nextPosition = routePoints[prevProgress + 1];
        setCurrentPosition(nextPosition);
        return prevProgress + 1;
      });
    }, 1000); // Move every second

    return () => clearInterval(interval);
  }, [routePoints]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <style>{routingMachineStyle}</style>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Карта транспорта</h2>
        <div className="aspect-video bg-muted relative">
          <MapContainer
            center={[48.0196, 66.9237]} // Center of Kazakhstan
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
            />
            <Marker
              position={currentPosition}
              icon={carIcon}
              eventHandlers={{
                click: () => {
                  console.log('Vehicle clicked:', vehicle);
                  setSelectedVehicle(vehicle);
                },
              }}
            />
          </MapContainer>
          {selectedVehicle && (
            <VehicleDetails
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
