import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, BookOpen, Gavel } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">SWU Tools</h1>
        <p className="text-xl text-muted-foreground">
          Une collection d&apos;outils pour Star Wars Unlimited TCG
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/timers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Clock className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Timers</CardTitle>
              <CardDescription>
                Chronométrez vos parties et drafts
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/sets">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <BookOpen className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Sets</CardTitle>
              <CardDescription>
                Explorez les sets et leurs cartes
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/judges/tools">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Gavel className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Outils Judges</CardTitle>
              <CardDescription>
                Outils pour arbitres et organisateurs
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Card className="h-full opacity-50">
          <CardHeader>
            <Users className="w-12 h-12 mb-4 text-muted-foreground" />
            <CardTitle>Plus à venir</CardTitle>
            <CardDescription>
              D&apos;autres outils en développement
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
