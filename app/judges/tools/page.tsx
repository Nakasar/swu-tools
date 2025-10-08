import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function JudgeToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Outils Judges</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/judges/tools/limited">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="w-12 h-12 mb-4 text-primary" />
              <CardTitle>Gestionnaire de Format Limité</CardTitle>
              <CardDescription>
                Gérez les événements scellés et draft avec photos et deck checks
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
