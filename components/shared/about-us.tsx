import { Container } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function AboutUs() {
  return (
    <section className="py-20 bg-muted">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              О 3GIS
            </h2>
            <p className="text-lg text-muted-foreground">
              3GIS - это инновационная платформа, разработанная для повышения
              безопасности и прозрачности в сфере транспортировки нефти. Наша
              миссия - сделать процесс перевозки более эффективным, безопасным и
              экологичным.
            </p>
            <ul className="space-y-4">
              {[
                'Передовые технологии GPS-мониторинга',
                'Команда экспертов в области логистики и IT',
                'Соответствие международным стандартам безопасности',
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="group">
              Узнать больше
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative aspect-video lg:aspect-square">
            <Image
              src="/placeholder.svg"
              alt="3GIS команда"
              fill
              className="object-cover rounded-lg transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
