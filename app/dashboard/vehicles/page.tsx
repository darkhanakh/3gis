'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Plus,
} from 'lucide-react';

interface Vehicle {
  id: string;
  driver: string;
  phoneNumber: string;
  currentMission: string | null;
  location: string | null;
  speed: number;
  malfunctions: number;
  vehicleType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  className?: string;
}

const VehiclesPage: React.FC<Props> = ({ className }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.driver.toLowerCase().includes(search.toLowerCase()) ||
      (vehicle.location &&
        vehicle.location.toLowerCase().includes(search.toLowerCase())) ||
      vehicle.vehicleType.toLowerCase().includes(search.toLowerCase())
  );

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'newest')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest')
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Транспорт</h1>
        <Button onClick={() => router.push('/dashboard/vehicles/create')}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>
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
              <TableCell>{vehicle.currentMission || '-'}</TableCell>
              <TableCell>{vehicle.location || '-'}</TableCell>
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
