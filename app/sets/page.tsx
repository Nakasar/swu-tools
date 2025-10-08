import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Set } from '@/lib/types';

// Sample data - in production, this would come from MongoDB
const sets: Set[] = [
  {
    code: 'SOR',
    name: 'Spark of Rebellion',
    releaseDate: '2024-03-08',
    totalCards: 259,
  },
  {
    code: 'SHD',
    name: 'Shadows of the Galaxy',
    releaseDate: '2024-07-12',
    totalCards: 259,
  },
  {
    code: 'TWI',
    name: 'Twilight of the Republic',
    releaseDate: '2024-11-08',
    totalCards: 259,
  },
];

export default function SetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sets.map((set) => (
          <Link key={set.code} href={`/sets/${set.code}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{set.name}</CardTitle>
                  <Badge variant="secondary">{set.code}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Date de sortie: {new Date(set.releaseDate).toLocaleDateString('fr-FR')}</div>
                  <div>Cartes: {set.totalCards}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
