import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Timer } from 'lucide-react';

export default function TimersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Timers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/timers/draft">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Timer className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Timer de Draft</CardTitle>
              <CardDescription>
                Chronométrez les tours de draft avec des alarmes
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/timers/clock">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Clock className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Timer de Ronde</CardTitle>
              <CardDescription>
                Gérez le temps des rondes de tournoi
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
