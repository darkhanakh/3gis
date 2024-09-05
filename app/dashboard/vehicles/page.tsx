'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  vehicleModel: z.string().min(2, {
    message: 'Vehicle model must be at least 2 characters.',
  }),
  licensePlate: z.string().min(2, {
    message: 'License plate must be at least 2 characters.',
  }),
  trackerSerialNumber: z.string().min(5, {
    message: 'Tracker serial number must be at least 5 characters.',
  }),
  tankCapacity: z.number().positive({
    message: 'Tank capacity must be a positive number.',
  }),
  fuelType: z.enum(['Gasoline', 'Diesel', 'Electric', 'Hybrid']),
  currentLatitude: z.number().min(-90).max(90),
  currentLongitude: z.number().min(-180).max(180),
});

export default function RegisterCarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleModel: '',
      licensePlate: '',
      trackerSerialNumber: '',
      tankCapacity: 0,
      fuelType: 'Gasoline',
      currentLatitude: 0,
      currentLongitude: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to register car');
      }

      toast({
        title: 'Success',
        description: 'New car has been registered with 3GIS tracker.',
      });
      router.push('/dashboard/vehicles'); // Redirect to vehicles list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register car. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">
        Register New Car with 3GIS Tracker
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Toyota Camry" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the model of the vehicle.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ABC123" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the vehicle's license plate number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trackerSerialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>3GIS Tracker Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 3GIS12345" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the serial number of the 3GIS tracker installed in the
                  vehicle.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tankCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tank Capacity (liters)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter the fuel tank capacity in liters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of fuel the vehicle uses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentLatitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentLongitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Car'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
