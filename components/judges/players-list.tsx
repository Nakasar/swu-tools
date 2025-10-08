'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, CheckSquare, Eye } from 'lucide-react';
import type { Player } from '@/lib/types';
import { PlayerPhotosDialog } from './player-photos-dialog';
import { UploadPhotoDialog } from './upload-photo-dialog';
import { AddDeckCheckDialog } from './add-deckcheck-dialog';

interface PlayersListProps {
  players: Player[];
  eventId: string;
  onUpdate: () => void;
}

export function PlayersList({ players, eventId, onUpdate }: PlayersListProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPhotos, setShowPhotos] = useState(false);
  const [uploadType, setUploadType] = useState<'pool' | 'decklist' | null>(null);
  const [showDeckCheck, setShowDeckCheck] = useState(false);

  const handleUploadPhoto = (player: Player, type: 'pool' | 'decklist') => {
    setSelectedPlayer(player);
    setUploadType(type);
  };

  const handleAddDeckCheck = (player: Player) => {
    setSelectedPlayer(player);
    setShowDeckCheck(true);
  };

  const handleViewPhotos = (player: Player) => {
    setSelectedPlayer(player);
    setShowPhotos(true);
  };

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucun joueur ajouté pour le moment.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <Card key={player.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{player.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewPhotos(player)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardTitle>
              {player.email && (
                <p className="text-xs text-muted-foreground">{player.email}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleUploadPhoto(player, 'pool')}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Pool
                  {player.poolPhotoUrl && (
                    <Badge variant="secondary" className="ml-2">
                      ✓
                    </Badge>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleUploadPhoto(player, 'decklist')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Decklist
                  {player.decklistPhotoUrl && (
                    <Badge variant="secondary" className="ml-2">
                      ✓
                    </Badge>
                  )}
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => handleAddDeckCheck(player)}
              >
                <CheckSquare className="h-4 w-4 mr-1" />
                Deck Check ({player.deckChecks?.length || 0})
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlayer && showPhotos && (
        <PlayerPhotosDialog
          open={showPhotos}
          onOpenChange={setShowPhotos}
          player={selectedPlayer}
          eventId={eventId}
        />
      )}

      {selectedPlayer && uploadType && (
        <UploadPhotoDialog
          open={!!uploadType}
          onOpenChange={(open) => {
            if (!open) setUploadType(null);
          }}
          eventId={eventId}
          playerId={selectedPlayer.id}
          type={uploadType}
          onSuccess={onUpdate}
        />
      )}

      {selectedPlayer && showDeckCheck && (
        <AddDeckCheckDialog
          open={showDeckCheck}
          onOpenChange={setShowDeckCheck}
          eventId={eventId}
          playerId={selectedPlayer.id}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
}
