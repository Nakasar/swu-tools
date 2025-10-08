'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer } from 'lucide-react';

const sets: Record<string, { code: string; name: string; totalCards: number }> = {
  SOR: { code: 'SOR', name: 'Spark of Rebellion', totalCards: 259 },
  SHD: { code: 'SHD', name: 'Shadows of the Galaxy', totalCards: 259 },
  TWI: { code: 'TWI', name: 'Twilight of the Republic', totalCards: 259 },
};

export default function SetlistPage() {
  const params = useParams();
  const setCode = (params.setCode as string)?.toUpperCase();
  const set = sets[setCode];

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  if (!set) {
    notFound();
  }

  const handleQuantityChange = (cardNumber: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [cardNumber]: Math.max(0, quantity),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate card list
  const cardNumbers = Array.from({ length: set.totalCards }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 print:mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{set.name} - Setlist</h1>
            <p className="text-muted-foreground">
              Liste des cartes pour format scellé
            </p>
          </div>
          <Button onClick={handlePrint} className="print:hidden">
            <Printer className="mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cartes du set</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {cardNumbers.map((num) => (
              <div key={num} className="flex items-center gap-2 p-2 border rounded">
                <Label htmlFor={`card-${num}`} className="min-w-[60px]">
                  #{num.toString().padStart(3, '0')}
                </Label>
                <Input
                  id={`card-${num}`}
                  type="number"
                  min={0}
                  value={quantities[num] || 0}
                  onChange={(e) => handleQuantityChange(num, parseInt(e.target.value) || 0)}
                  className="w-16 h-8"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <div className="text-sm font-medium">
              Total de cartes: {Object.values(quantities).reduce((sum, qty) => sum + qty, 0)}
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
