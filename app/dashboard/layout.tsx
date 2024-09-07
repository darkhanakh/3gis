'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Truck,
  Users,
  Loader2,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

import 'leaflet/dist/leaflet.css';

const menuItems = [
  {
    name: 'dashboard',
    icon: LayoutDashboard,
    label: 'Панель управления',
    href: '/dashboard',
  },
  { name: 'map', icon: MapPin, label: 'Карта', href: '/dashboard/map' },
  {
    name: 'vehicles',
    icon: Truck,
    label: 'Транспорт',
    subItems: [
      {
        name: 'create-vehicle',
        icon: Plus,
        label: 'Создать транспорт',
        href: '/dashboard/vehicles/create',
      },
      {
        name: 'all-vehicles',
        icon: List,
        label: 'Все транспорты',
        href: '/dashboard/vehicles',
      },
    ],
  },
  {
    name: 'shipments',
    icon: Boxes,
    label: 'Заявки',
    href: '/dashboard/invoices',
  },
  {
    name: 'analytics',
    icon: BarChart3,
    label: 'Аналитика',
    href: '/dashboard/analytics',
  },
  {
    name: 'users',
    icon: Users,
    label: 'Пользователи',
    href: '/dashboard/users',
  },
  {
    name: 'settings',
    icon: Settings,
    label: 'Настройки',
    href: '/dashboard/settings',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
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
          // We're already on the correct page
          break;
        default:
          console.error('Unknown user role:', session.user.role);
      }
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-4 text-lg">Загрузка...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'USER') {
    return null;
  }

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-6 w-6" />
              <span className="font-bold">3GIS</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => toggleSubmenu(item.name)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                        {openSubmenu === item.name ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Button>
                      {openSubmenu === item.name && (
                        <div className="ml-4 mt-1 grid gap-1">
                          {item.subItems.map((subItem) => (
                            <Link key={subItem.name} href={subItem.href}>
                              <Button
                                variant={
                                  pathname === subItem.href
                                    ? 'secondary'
                                    : 'ghost'
                                }
                                className="w-full justify-start"
                              >
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.label}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-14 items-center border-b px-6">
          <h1 className="text-lg font-semibold">
            {menuItems.find((item) => item.href === pathname)?.label ||
              menuItems.find((item) =>
                item.subItems?.some((subItem) => subItem.href === pathname)
              )?.label ||
              'Панель управления'}
          </h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
