import React from 'react';
import { Container } from '@/components/shared';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string;
}

const navbarItems = ['Главная', 'О нас', 'Преимущества', 'Контакты'];

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={className}>
      <Container className="flex items-center justify-between py-5">
        <Link href="/" className="text-2xl font-bold">
          3GIS
        </Link>

        <div>
          <ul className="flex items-center gap-4">
            {navbarItems.map((item) => (
              <li key={item} className="group">
                <Link
                  href="#"
                  className="relative inline-block text-gray-900 dark:text-gray-100 transition duration-300 ease-in-out text-lg"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Button>Начать</Button>
        </div>
      </Container>
    </header>
  );
};
