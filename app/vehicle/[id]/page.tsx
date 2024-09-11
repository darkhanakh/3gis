"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngTuple } from 'leaflet';  // Импортируем LatLngTuple для координат
import { useRouter} from 'next/navigation';
import PocketBase from 'pocketbase';
import { LineChart } from '@/components/shared/line-chart-steal';



const carIcon = new Icon({
  iconUrl: '/truck.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Типы для данных OBD
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
  gps_coordinates: LatLngTuple; // Координаты с типом LatLngTuple
  altitude: number;
  heading: number;
  distance_traveled: number;
};

// Пример данных OBD
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
  diagnostic_trouble_code: ["P0100", "P0200", "P0300"],
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
  gps_coordinates: [48.0196, 66.9237], // Широта и долгота
  altitude: 150.0,
  heading: 85.0,
  distance_traveled: 200.0,
};

// Translation map (English to Russian)
const translationMap = {
  engine_rpm: "Обороты двигателя",
  vehicle_speed: "Скорость автомобиля",
  throttle_position: "Положение дросселя",
  fuel_level: "Уровень топлива",
  engine_load: "Нагрузка двигателя",
  intake_air_temperature: "Температура всасываемого воздуха",
  mass_air_flow: "Расход воздуха",
  fuel_pressure: "Давление топлива",
  fuel_consumption_rate: "Расход топлива",
  engine_coolant_temperature: "Температура охлаждающей жидкости",
  oxygen_sensor_reading: "Датчик кислорода",
  catalyst_temperature: "Температура катализатора",
  evap_emission_control_pressure: "Давление в системе контроля испарений",
  diagnostic_trouble_code: "Коды неисправностей",
  battery_voltage: "Напряжение батареи",
  transmission_fluid_temperature: "Температура трансмиссионной жидкости",
  oil_temperature: "Температура масла",
  oil_pressure: "Давление масла",
  brake_pedal_position: "Положение педали тормоза",
  steering_angle: "Угол поворота руля",
  accelerator_pedal_position: "Положение педали акселератора",
  abs_status: "Статус ABS",
  airbag_deployment_status: "Статус подушек безопасности",
  tire_pressure: "Давление в шинах",
  gps_coordinates: "GPS координаты",
  altitude: "Высота",
  heading: "Курс",
  distance_traveled: "Пройденное расстояние",
};

const tripData = [
  {
    id: 1,
    driver: "Jane Cooper",
    company: "Microsoft",
    phone: "(225) 555-0118",
    email: "jane@microsoft.com",
    country: "United States",
  },
  // Add more if necessary
];

// Описание ошибок DTC
const dtcDescriptions: { [key: string]: string } = {
  P0100: "Ошибка массового расхода воздуха",
  P0200: "Ошибка в цепи форсунки",
  P0300: "Пропуски зажигания",
};

const pb = new PocketBase('https://huge-wealth.pockethost.io');

const Dashboard = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinates, setCoordinates] = useState<LatLngTuple>(obdData.gps_coordinates);
  const router = useRouter();
  

  // Массив с переводами данных OBD
  const translatedObdData = Object.entries(obdData).map(([key, value]) => {
    const label = translationMap[key as keyof typeof translationMap] || key;
    return { label, value: Array.isArray(value) ? value.join(", ") : value };
  });

  useEffect(() => {

    const authenticate = async () => {
      try {
        const authData = await pb.admins.authWithPassword('adeke.2006@mail.ru', '12345678910');
        console.log('Authenticated:', authData);
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };

    authenticate();

    // Обновление координат через 5 секунд
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
    <div className="dark min-h-screen text-gray-100 p-8">
      <div className="grid grid-cols-3 gap-8 h-screen">
        {/* Левая колонка */}
        <div className="col-span-1 flex flex-col space-y-8">
          <div className="col-span-1 flex flex-col space-y-8">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="bg-gray-700 p-2 rounded-lg text-white"
            >
              ← Назад
            </button>
          </div>
          {/* Vehicle Details */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Детали автомобиля</h2>
            <p className="flex justify-between mb-1">
              <span>Модель:</span> <span>Камаз Model B</span>
            </p>
            <p className="flex justify-between mb-1">
              <span>Тип:</span> <span>Дизель</span>
            </p>
            <p className="flex justify-between mb-1">
              <span>Номерной знак:</span> <span>B213NBD</span>
            </p>
            <p className="flex justify-between mb-1">
              <span>VIN:</span> <span>5YJ3E1EA7MF123456</span>
            </p>
            <p className="flex justify-between mb-1">
              <span>Пробег:</span> <span>10000км</span>
            </p>
          </div>
          {/* Карта с координатами */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-bold mb-4">Карта</h2>
            <MapContainer
              center={coordinates}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={coordinates}
                icon={carIcon}
              />
            </MapContainer>
            <div className="mt-4">
              <p>Широта: {coordinates[0]}</p>
              <p>Долгота: {coordinates[1]}</p>
            </div>
          </div>
          {/* Данные OBD */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Данные OBD</h2>
            {translatedObdData
              .filter(item => item.label !== 'Коды неисправностей')
              .filter(item => item.label !== 'GPS координаты')
              .map((item, index) => (
                <p key={index} className="mb-4 border-b border-gray-700">
                  {item.label}:{" "}
                  <span className="float-right">{item.value}</span>
                </p>
              ))}
          </div>
        </div>

        {/* Правая колонка */}
        <div className="col-span-2 flex flex-col gap-8 h-full">

          {/* Коды неисправностей */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Коды неисправностей</h2>
            <ul>
              {obdData.diagnostic_trouble_code.map((code) => (
                <li key={code} className="border-b border-gray-700 p-3">
                  {code}:{" "}
                  <span className="float-right">
                    {dtcDescriptions[code] || "Описание отсутствует"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">История поездок</h2>
            <input
              type="text"
              placeholder="Поиск по имени водителя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <table className="table-auto w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Водитель</th>
                  <th className="text-left p-2">Компания</th>
                  <th className="text-left p-2">Телефон</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Страна</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-700">
                    <td className="p-2">{trip.driver}</td>
                    <td className="p-2">{trip.company}</td>
                    <td className="p-2">{trip.phone}</td>
                    <td className="p-2">{trip.email}</td>
                    <td className="p-2">{trip.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <LineChart/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
