'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Import your UI components
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsRedirecting(true);
      switch (session.user.role) {
        case 'ADMIN':
          router.replace('/admin/dashboard');
          break;
        case 'DRIVER':
          router.replace('/driver/dashboard');
          break;
        case 'MANAGER':
          router.replace('/manager/dashboard');
          break;
        case 'USER':
          setIsRedirecting(false); // We're already on the correct page
          break;
        default:
          console.error('Unknown user role:', session.user.role);
          setIsRedirecting(false);
      }
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, session, router]);

  if (status === 'loading' || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-4 text-lg">Загрузка...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // This will be handled by the useEffect hook
  }

  if (session?.user?.role !== 'USER') {
    return <div>Hi!</div>; // This will be handled by the useEffect hook
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Добро пожаловать в панель управления 3GIS
      </h1>
      <p className="mb-4">Вы вошли как: {session.user.email}</p>
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
