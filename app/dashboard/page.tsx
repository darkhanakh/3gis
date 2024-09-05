// app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        Добро пожаловать в панель управления 3GIS, {session?.user?.name}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-semibold">12</h3>
            <p className="text-sm text-muted-foreground">Активные транспорты</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-semibold">45</h3>
            <p className="text-sm text-muted-foreground">Отправления в пути</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-semibold">98%</h3>
            <p className="text-sm text-muted-foreground">
              Своевременные доставки
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-semibold">2</h3>
            <p className="text-sm text-muted-foreground">
              Активные предупреждения
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Button onClick={() => router.push('/user/profile')}>
          Мой профиль
        </Button>
        <Button onClick={() => router.push('/user/shipments')}>
          Мои отправления
        </Button>
        <Button onClick={() => router.push('/user/reports')}>Отчеты</Button>
      </div>
    </div>
  );
}
