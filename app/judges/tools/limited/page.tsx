'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export default function LimitedToolPage() {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [format, setFormat] = useState<'sealed' | 'draft'>('sealed');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateEvent = async () => {
    if (!eventName || !creatorEmail) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/judges/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eventName,
          format,
          creatorEmail,
        }),
      });

      if (response.ok) {
        const { eventId } = await response.json();
        router.push(`/judges/tools/events/${eventId}`);
      } else {
        alert('Erreur lors de la création de l\'événement');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Erreur lors de la création de l\'événement');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestionnaire de Format Limité</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel événement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="eventName">Nom de l&apos;événement</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Tournoi Scellé - Novembre 2024"
              />
            </div>

            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={(value: 'sealed' | 'draft') => setFormat(value)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sealed">Scellé</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Votre email (arbitre principal)</Label>
              <Input
                id="email"
                type="email"
                value={creatorEmail}
                onChange={(e) => setCreatorEmail(e.target.value)}
                placeholder="arbitre@example.com"
              />
            </div>

            <Button
              onClick={handleCreateEvent}
              disabled={isCreating || !eventName || !creatorEmail}
              className="w-full"
              size="lg"
            >
              <Plus className="mr-2" />
              {isCreating ? 'Création...' : 'Créer l\'événement'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Événements récents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les événements récents seront affichés ici après leur création.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
