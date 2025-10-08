import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import type { Set, Card as CardType } from '@/lib/types';

// Sample data - would come from MongoDB in production
const sets: Record<string, Set> = {
  SOR: {
    code: 'SOR',
    name: 'Spark of Rebellion',
    releaseDate: '2024-03-08',
    totalCards: 259,
  },
  SHD: {
    code: 'SHD',
    name: 'Shadows of the Galaxy',
    releaseDate: '2024-07-12',
    totalCards: 259,
  },
  TWI: {
    code: 'TWI',
    name: 'Twilight of the Republic',
    releaseDate: '2024-11-08',
    totalCards: 259,
  },
};

const sampleCards: CardType[] = [
  {
    id: '1',
    setCode: 'SOR',
    number: '001',
    name: 'Luke Skywalker',
    type: 'Unit - Leader',
    aspects: ['Heroism'],
    cost: 7,
    power: 6,
    hp: 7,
    rarity: 'Rare',
  },
  // More cards would be loaded from DB
];

export default function SetDetailPage({
  params,
}: {
  params: { setCode: string };
}) {
  const set = sets[params.setCode.toUpperCase()];

  if (!set) {
    notFound();
  }

  // In production, filter cards by setCode from DB
  const cards = sampleCards.filter((card) => card.setCode === set.code);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{set.name}</h1>
            <p className="text-muted-foreground">
              Code: {set.code} • Sortie: {new Date(set.releaseDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <Link href={`/sets/${set.code}/setlist`}>
            <Button>
              <FileText className="mr-2" />
              Liste du set
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Cartes ({set.totalCards})</h2>
        <p className="text-muted-foreground mb-4">
          Les cartes seront disponibles prochainement via l&apos;intégration MeiliSearch.
        </p>
      </div>

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{card.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {card.number}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">{card.type}</div>
                  <div className="flex gap-1">
                    {card.aspects?.map((aspect) => (
                      <Badge key={aspect} variant="outline">
                        {aspect}
                      </Badge>
                    ))}
                  </div>
                  {card.cost !== undefined && (
                    <div className="text-muted-foreground">Coût: {card.cost}</div>
                  )}
                  {card.power !== undefined && (
                    <div className="text-muted-foreground">
                      {card.power}/{card.hp}
                    </div>
                  )}
                  <Badge>{card.rarity}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune carte disponible pour l&apos;instant.
            <br />
            Intégration avec MeiliSearch à venir.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
