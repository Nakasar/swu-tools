'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Shield } from 'lucide-react';
import type { LimitedEvent } from '@/lib/types';
import { AddPlayerDialog } from '@/components/judges/add-player-dialog';
import { AddJudgeDialog } from '@/components/judges/add-judge-dialog';
import { PlayersList } from '@/components/judges/players-list';
import { authClient } from '@/lib/auth-client';

export default function EventPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<LimitedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddJudge, setShowAddJudge] = useState(false);
  const { data: session, isPending } = authClient.useSession();
   useEffect(() => {
    loadEvent();
  }, [eventId]);
  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/judges/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <></>;
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            Événement non trouvé
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <div className="flex gap-2 mt-2">
              <Badge>{event.format}</Badge>
              <Badge variant="secondary">ID: {event.id}</Badge>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Date:</span>{' '}
              {new Date(event.date).toLocaleDateString('fr-FR')}
            </div>
            <div>
              <span className="font-medium">Arbitre principal:</span> {event.creatorEmail}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Arbitres:</span>
              <div className="flex gap-1">
                {event.judges.map((judge) => (
                  <Badge key={judge} variant="outline">
                    {judge}
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddJudge(true)}
              >
                <Shield className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div>
              <span className="font-medium">Joueurs:</span> {event.players.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="players" className="space-y-4">
        <TabsList>
          <TabsTrigger value="players">
            <Users className="mr-2 h-4 w-4" />
            Joueurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Joueurs ({event.players.length})
            </h2>
            <Button onClick={() => setShowAddPlayer(true)}>
              <UserPlus className="mr-2" />
              Ajouter un joueur
            </Button>
          </div>

          <PlayersList
            players={event.players}
            eventId={event.id}
            onUpdate={loadEvent}
          />
        </TabsContent>
      </Tabs>

      <AddPlayerDialog
        open={showAddPlayer}
        onOpenChange={setShowAddPlayer}
        eventId={event.id}
        onSuccess={loadEvent}
      />

      <AddJudgeDialog
        open={showAddJudge}
        onOpenChange={setShowAddJudge}
        eventId={event.id}
        onSuccess={loadEvent}
      />
    </div>
  );
}
