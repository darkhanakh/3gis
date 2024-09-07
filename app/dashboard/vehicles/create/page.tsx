'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const vehicleSchema = z.object({
  driver: z.string().min(2, 'Имя водителя должно содержать минимум 2 символа'),
  phoneNumber: z
    .string()
    .min(10, 'Номер телефона должен содержать минимум 10 символов'),
  vehicleType: z.enum(['Автомобиль', 'Фургон', 'Грузовик']),
  currentMission: z.string().optional(),
  location: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function AddVehiclePage() {
  const router = useRouter();
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      driver: '',
      phoneNumber: '',
      vehicleType: 'Автомобиль',
      currentMission: '',
      location: '',
    },
  });

  async function onSubmit(data: VehicleFormValues) {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Не удалось создать транспортное средство');
      }

      toast({
        title: 'Транспортное средство создано',
        description: 'Новое транспортное средство успешно добавлено.',
      });
      router.push('/vehicles');
    } catch (error) {
      console.error('Ошибка создания транспортного средства:', error);
      toast({
        title: 'Ошибка',
        description:
          'Не удалось создать транспортное средство. Попробуйте снова.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Добавить новое транспортное средство
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="driver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя водителя</FormLabel>
                <FormControl>
                  <Input placeholder="Иван Иванов" {...field} />
                </FormControl>
                <FormDescription>Введите полное имя водителя.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер телефона</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (777) 000-0000" {...field} />
                </FormControl>
                <FormDescription>
                  Введите контактный номер водителя.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип транспортного средства</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип транспортного средства" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Автомобиль">Автомобиль</SelectItem>
                    <SelectItem value="Фургон">Фургон</SelectItem>
                    <SelectItem value="Грузовик">Грузовик</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Выберите тип транспортного средства.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentMission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Текущая задача (опционально)</FormLabel>
                <FormControl>
                  <Input placeholder="Доставка в Алматы" {...field} />
                </FormControl>
                <FormDescription>
                  Введите текущую задачу транспортного средства, если есть.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Местоположение (опционально)</FormLabel>
                <FormControl>
                  <Input placeholder="Нур-Султан, Казахстан" {...field} />
                </FormControl>
                <FormDescription>
                  Введите текущее местоположение транспортного средства, если
                  известно.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Добавить транспортное средство</Button>
        </form>
      </Form>
    </div>
  );
}
