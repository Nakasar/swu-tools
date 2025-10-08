'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LimitedEvent, Player } from '@/lib/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import { extractCardsListFromPicture } from '@/app/judges/tools/events/[eventId]/actions';

interface PlayerPhotosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
  eventId: LimitedEvent['id'];
}

export function PlayerPhotosDialog({ open, onOpenChange, player, eventId }: PlayerPhotosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Photos - {player.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pool de cartes</CardTitle>
            </CardHeader>
            <CardContent>
              {player.poolPhotoUrl ? (
                <div>
                <div className="relative w-full aspect-video">
                  <Image
                    src={player.poolPhotoUrl}
                    alt="Pool de cartes"
                    fill
                    className="object-contain rounded"
                    unoptimized
                  />
                </div>
                <Button onClick={() => player.poolPhotoUrl && extractCardsListFromPicture({ url: player.poolPhotoUrl, eventId, playerId: player.id, type: 'POOL' })}>Extract cards</Button>

                <div className="mt-2">
                  {player.pool && player.pool.cards ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
                      {player.pool.cards.map((cardName, index) => (
                        <Badge key={index} className="break-words">
                          {cardName}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucune carte extraite
                    </p>
                  )}
                </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune photo du pool disponible
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Decklist</CardTitle>
            </CardHeader>
            <CardContent>
              {player.decklistPhotoUrl ? (
                <div className="relative w-full">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={player.decklistPhotoUrl}
                      alt="Decklist"
                      fill
                      className="object-contain rounded"
                      unoptimized
                    />
                  </div>
                  <Button onClick={() => player.decklistPhotoUrl && extractCardsListFromPicture({ url: player.decklistPhotoUrl, eventId, playerId: player.id, type: 'DECK' })}>Extract cards</Button>

                  <div className="mt-2">
                    {player.deck && player.deck.cards ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
                        {player.deck.cards.map((cardName, index) => (
                          <Badge key={index} className="break-words">
                            {cardName}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune carte extraite
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune photo de decklist disponible
                </p>
              )}
            </CardContent>
          </Card>

          {player.deckChecks && player.deckChecks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Deck Checks ({player.deckChecks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {player.deckChecks.map((deckCheck) => (
                  <div key={deckCheck.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {new Date(deckCheck.timestamp).toLocaleString('fr-FR')}
                      </Badge>
                    </div>
                    {deckCheck.notes && (
                      <p className="text-sm">{deckCheck.notes}</p>
                    )}
                    <div className="relative w-full aspect-video">
                      <Image
                        src={deckCheck.photoUrl}
                        alt={`Deck check ${deckCheck.id}`}
                        fill
                        className="object-contain rounded"
                        unoptimized
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
