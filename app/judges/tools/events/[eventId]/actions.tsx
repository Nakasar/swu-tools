'use server';
import clientPromise from "@/lib/mongodb";
import { LimitedEvent } from "@/lib/types";
import { generateObject } from 'ai';
import { z } from 'zod';

export async function extractCardsListFromPicture({ url, playerId, eventId, type }: { url: string; playerId: string; eventId: string, type: 'POOL' | 'DECK' }): Promise<void> {
    const client = await clientPromise;
    const db = client.db();

    const result = await generateObject({
        model: 'openai/gpt-4.1-mini',
        messages: [
            {
                role: "user",
                content: [
                    { type: 'text', text: `Extract the list of cards from this image of a decklist. Return only the card names, no quantities or other text. If there are multiple times the same card, include its name multiple times in the array. If you can't identify any cards, return an empty list.` },
                    { type: 'image', image: url },
                ],
            },
        ],
        schema: z.object({
            cards: z.array(z.string()).min(0).max(150)
        }),
        maxRetries: 3,
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
    });

    console.log(result.object.cards);

    await db.collection<LimitedEvent>('events').updateOne(
      {
        id: eventId,
        'players.id': playerId,
      },
      {
        $set: {
          [`players.$.${type === 'POOL' ? 'pool' : 'deck'}.photoUrl`]: url,
          [`players.$.${type === 'POOL' ? 'pool' : 'deck'}.cards`]: result.object.cards,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return;
} 