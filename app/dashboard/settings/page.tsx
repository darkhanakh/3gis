'use client';

import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [notificationEmail, setNotificationEmail] = useState(false);
  const [notificationPush, setNotificationPush] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Настройки</h2>

      {/* User Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Информация профиля</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              defaultValue={session?.user?.name || ''}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={session?.user?.email || ''}
            />
          </div>
          <Button className="mt-4">Сохранить изменения</Button>
        </CardContent>
      </Card>

      {/* Password Change Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Изменение пароля</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Текущий пароль</Label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password">Новый пароль</Label>
            <Input id="new-password" type="password" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button className="mt-4">Изменить пароль</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки уведомлений</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Получать уведомления на почту.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={notificationEmail}
              onCheckedChange={setNotificationEmail}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Получать push уведомления на устройства.
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={notificationPush}
              onCheckedChange={setNotificationPush}
            />
          </div>
          <Button className="mt-4">Сохранить настройки уведомлений</Button>
        </CardContent>
      </Card>
    </div>
  );
}
