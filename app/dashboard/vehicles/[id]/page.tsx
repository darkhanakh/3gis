'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngTuple } from 'leaflet';
import { useRouter } from 'next/navigation';
import { LineChart } from '@/components/shared/line-chart-steal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  AlertTriangle,
  Truck,
  MapPin,
  Database,
} from 'lucide-react';

const carIcon = new Icon({
  iconUrl: '/truck.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

type OBDData = {
  engine_rpm: number;
  vehicle_speed: number;
  throttle_position: number;
  fuel_level: number;
  engine_load: number;
  intake_air_temperature: number;
  mass_air_flow: number;
  fuel_pressure: number;
  fuel_consumption_rate: number;
  engine_coolant_temperature: number;
  oxygen_sensor_reading: number;
  catalyst_temperature: number;
  evap_emission_control_pressure: number;
  diagnostic_trouble_code: string[];
  battery_voltage: number;
  transmission_fluid_temperature: number;
  oil_temperature: number;
  oil_pressure: number;
  brake_pedal_position: number;
  steering_angle: number;
  accelerator_pedal_position: number;
  abs_status: boolean;
  airbag_deployment_status: boolean;
  tire_pressure: number;
  gps_coordinates: LatLngTuple;
  altitude: number;
  heading: number;
  distance_traveled: number;
};

const obdData: OBDData = {
  engine_rpm: 3000,
  vehicle_speed: 80,
  throttle_position: 45.3,
  fuel_level: 60.5,
  engine_load: 50.0,
  intake_air_temperature: 35.0,
  mass_air_flow: 25.6,
  fuel_pressure: 4.8,
  fuel_consumption_rate: 10.0,
  engine_coolant_temperature: 90.0,
  oxygen_sensor_reading: 0.75,
  catalyst_temperature: 600.0,
  evap_emission_control_pressure: 2.0,
  diagnostic_trouble_code: ['P0100', 'P0200', 'P0300'],
  battery_voltage: 12.6,
  transmission_fluid_temperature: 80.0,
  oil_temperature: 95.0,
  oil_pressure: 4.5,
  brake_pedal_position: 12.3,
  steering_angle: 5.6,
  accelerator_pedal_position: 70.0,
  abs_status: true,
  airbag_deployment_status: false,
  tire_pressure: 32.0,
  gps_coordinates: [48.0196, 66.9237],
  altitude: 150.0,
  heading: 85.0,
  distance_traveled: 200.0,
};

const translationMap = {
  engine_rpm: 'Обороты двигателя',
  vehicle_speed: 'Скорость автомобиля',
  throttle_position: 'Положение дросселя',
  fuel_level: 'Уровень топлива',
  engine_load: 'Нагрузка двигателя',
  intake_air_temperature: 'Температура всасываемого воздуха',
  mass_air_flow: 'Расход воздуха',
  fuel_pressure: 'Давление топлива',
  fuel_consumption_rate: 'Расход топлива',
  engine_coolant_temperature: 'Температура охлаждающей жидкости',
  oxygen_sensor_reading: 'Датчик кислорода',
  catalyst_temperature: 'Температура катализатора',
  evap_emission_control_pressure: 'Давление в системе контроля испарений',
  diagnostic_trouble_code: 'Коды неисправностей',
  battery_voltage: 'Напряжение батареи',
  transmission_fluid_temperature: 'Температура трансмиссионной жидкости',
  oil_temperature: 'Температура масла',
  oil_pressure: 'Давление масла',
  brake_pedal_position: 'Положение педали тормоза',
  steering_angle: 'Угол поворота руля',
  accelerator_pedal_position: 'Положение педали акселератора',
  abs_status: 'Статус ABS',
  airbag_deployment_status: 'Статус подушек безопасности',
  tire_pressure: 'Давление в шинах',
  gps_coordinates: 'GPS координаты',
  altitude: 'Высота',
  heading: 'Курс',
  distance_traveled: 'Пройденное расстояние',
};

const tripData = [
  {
    id: 1,
    driver: 'Jane Cooper',
    company: 'Microsoft',
    phone: '(225) 555-0118',
    email: 'jane@microsoft.com',
    country: 'United States',
  },
  {
    id: 2,
    driver: 'John Doe',
    company: 'Apple',
    phone: '(555) 123-4567',
    email: 'john@apple.com',
    country: 'Canada',
  },
  {
    id: 3,
    driver: 'Alice Smith',
    company: 'Google',
    phone: '(555) 987-6543',
    email: 'alice@google.com',
    country: 'United Kingdom',
  },
];

const dtcDescriptions: { [key: string]: string } = {
  P0100: 'Ошибка массового расхода воздуха',
  P0200: 'Ошибка в цепи форсунки',
  P0300: 'Пропуски зажигания',
};

const VehiclePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [coordinates, setCoordinates] = useState<LatLngTuple>(
    obdData.gps_coordinates
  );
  const router = useRouter();

  const translatedObdData = Object.entries(obdData).map(([key, value]) => {
    const label = translationMap[key as keyof typeof translationMap] || key;
    return { label, value: Array.isArray(value) ? value.join(', ') : value };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newLat = coordinates[0] + Math.random() * 0.001;
      const newLon = coordinates[1] + Math.random() * 0.001;
      setCoordinates([newLat, newLon]);
    }, 5000);
    return () => clearInterval(interval);
  }, [coordinates]);

  const filteredData = tripData.filter((trip) =>
    trip.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => router.back()}
          className="mb-8"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Назад
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2" />
                  Детали автомобиля
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt>Модель:</dt>
                    <dd>Камаз Model B</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Тип:</dt>
                    <dd>Дизель</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Номерной знак:</dt>
                    <dd>B213NBD</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>VIN:</dt>
                    <dd>5YJ3E1EA7MF123456</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Пробег:</dt>
                    <dd>10000км</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" />
                  Карта
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-md overflow-hidden mb-4">
                  <MapContainer
                    center={coordinates}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={coordinates} icon={carIcon} />
                  </MapContainer>
                </div>
                <div className="text-sm">
                  <p>Широта: {coordinates[0].toFixed(6)}</p>
                  <p>Долгота: {coordinates[1].toFixed(6)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2" />
                  Данные OBD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {translatedObdData
                    .filter(
                      (item) =>
                        item.label !== 'Коды неисправностей' &&
                        item.label !== 'GPS координаты'
                    )
                    .map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <dt>{item.label}:</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                </dl>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2" />
                  Коды неисправностей
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {obdData.diagnostic_trouble_code.map((code) => (
                    <li
                      key={code}
                      className="flex justify-between items-center p-2 dark:bg-[#0A0A0A] rounded border dark:border-gray-800"
                    >
                      <span className="font-semibold">{code}</span>
                      <span>
                        {dtcDescriptions[code] || 'Описание отсутствует'}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История поездок</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Поиск по имени водителя..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Водитель</TableHead>
                      <TableHead>Компания</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Страна</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell>{trip.driver}</TableCell>
                        <TableCell>{trip.company}</TableCell>
                        <TableCell>{trip.phone}</TableCell>
                        <TableCell>{trip.email}</TableCell>
                        <TableCell>{trip.country}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>График данных</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePage;
