'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart } from '@/components/shared/line-chart';
import { BarChart } from '@/components/shared/bar-chart';
import { DoughnutChart } from '@/components/shared/doughnut-chart';

export default function AnalyticsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        Добро пожаловать в панель управления 3GIS, {session?.user?.name}
      </h2>

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
        {/* Average Fuel Efficiency */}
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">8.2 Km/L</div>
            <div className="text-sm text-muted-foreground">Средний Km/L</div>
          </CardContent>
        </Card>
        {/* Distance (km) */}
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">360k km</div>
            <div className="text-sm text-muted-foreground">Расстояние</div>
          </CardContent>
        </Card>
        {/* Fuel Used */}
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">40k L</div>
            <div className="text-sm text-muted-foreground">
              Использованное топливо
            </div>
          </CardContent>
        </Card>
        {/* Transport Utilization */}
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">60%</div>
            <div className="text-sm text-muted-foreground">
              Утилизация транспорта
            </div>
          </CardContent>
        </Card>
        {/* Estimated CO2 Emissions */}
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">450k тонн</div>
            <div className="text-sm text-muted-foreground">
              Оценка выбросов CO2
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Fuel Consumption Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Расход топлива</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <LineChart />
          </CardContent>
        </Card>

        {/* Fuel Consumption by Category Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Общий расход топлива по категориям</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <BarChart />
          </CardContent>
        </Card>

        {/* Expenses Doughnut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Расходы</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <DoughnutChart />
          </CardContent>
        </Card>
      </div>

      {/* Time Range Buttons */}
      <div className="flex space-x-4 mt-6">
        <Button variant="outline">1 Неделя</Button>
        <Button variant="outline">2 Недели</Button>
        <Button variant="outline">1 Месяц</Button>
        <Button variant="outline">3 Месяца</Button>
      </div>
    </div>
  );
}
