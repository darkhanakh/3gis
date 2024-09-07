'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface Vehicle {
  id: string;
  driver: string;
  phoneNumber: string;
  currentMission: string;
  location: string;
  speed: number;
  malfunctions: number;
  vehicleType: string;
  status: 'active' | 'inactive';
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    driver: 'Jane Cooper',
    phoneNumber: '(225) 555-0118',
    currentMission: 'Delivery',
    location: 'United States',
    speed: 60,
    malfunctions: 0,
    vehicleType: 'Truck',
    status: 'active',
  },
  {
    id: '2',
    driver: 'Floyd Miles',
    phoneNumber: '(205) 555-0100',
    currentMission: 'Pickup',
    location: 'Kiribati',
    speed: 0,
    malfunctions: 1,
    vehicleType: 'Van',
    status: 'inactive',
  },
  {
    id: '3',
    driver: 'Ronald Richards',
    phoneNumber: '(302) 555-0107',
    currentMission: 'Maintenance',
    location: 'Israel',
    speed: 30,
    malfunctions: 2,
    vehicleType: 'Car',
    status: 'inactive',
  },
  {
    id: '4',
    driver: 'Marvin McKinney',
    phoneNumber: '(252) 555-0126',
    currentMission: 'Delivery',
    location: 'Iran',
    speed: 75,
    malfunctions: 0,
    vehicleType: 'Truck',
    status: 'active',
  },
  {
    id: '5',
    driver: 'Jerome Bell',
    phoneNumber: '(629) 555-0129',
    currentMission: 'Pickup',
    location: 'Réunion',
    speed: 45,
    malfunctions: 1,
    vehicleType: 'Van',
    status: 'active',
  },
  {
    id: '6',
    driver: 'Kathryn Murphy',
    phoneNumber: '(406) 555-0120',
    currentMission: 'Delivery',
    location: 'Curaçao',
    speed: 55,
    malfunctions: 0,
    vehicleType: 'Truck',
    status: 'active',
  },
  {
    id: '7',
    driver: 'Jacob Jones',
    phoneNumber: '(208) 555-0112',
    currentMission: 'Maintenance',
    location: 'Brazil',
    speed: 0,
    malfunctions: 3,
    vehicleType: 'Car',
    status: 'inactive',
  },
  {
    id: '8',
    driver: 'Kristin Watson',
    phoneNumber: '(704) 555-0127',
    currentMission: 'Delivery',
    location: 'Åland Islands',
    speed: 65,
    malfunctions: 0,
    vehicleType: 'Van',
    status: 'active',
  },
];

interface Props {
  className?: string;
}

const VehiclesPage: React.FC<Props> = ({ className }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.driver.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.vehicleType.toLowerCase().includes(search.toLowerCase())
  );

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    if (sortBy === 'oldest') return a.id.localeCompare(b.id);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);
  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`p-6 ${className}`}>
      <h1 className="text-2xl font-bold mb-6">Транспорт</h1>
      <div className="flex justify-between mb-4">
        <Input
          className="max-w-sm"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID транспорта</TableHead>
            <TableHead>Водитель</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Текущая миссия</TableHead>
            <TableHead>Локация</TableHead>
            <TableHead>Скорость</TableHead>
            <TableHead>Кол-во неисправностей</TableHead>
            <TableHead>Вид транспорта</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.id}</TableCell>
              <TableCell>{vehicle.driver}</TableCell>
              <TableCell>{vehicle.phoneNumber}</TableCell>
              <TableCell>{vehicle.currentMission}</TableCell>
              <TableCell>{vehicle.location}</TableCell>
              <TableCell>{vehicle.speed} km/h</TableCell>
              <TableCell>{vehicle.malfunctions}</TableCell>
              <TableCell>{vehicle.vehicleType}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    vehicle.status === 'active' ? 'default' : 'secondary'
                  }
                >
                  {vehicle.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VehiclesPage;
