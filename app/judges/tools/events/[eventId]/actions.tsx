'use server';
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { LimitedEvent } from "@/lib/types";
import { generateObject } from 'ai';
import { headers } from "next/headers";
import { z } from 'zod';

export async function extractCardsListFromPicture({ url, playerId, eventId, type }: { url: string; playerId: string; eventId: string, type: 'POOL' | 'DECK' }): Promise<void> {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    });

    if (!session?.user.email) { 
      throw new Error('Not authenticated');
    }

    const client = await clientPromise;
    const db = client.db();

    const event = await db.collection<LimitedEvent>('events').findOne({ id: eventId }, { projection: { id: 1, judges: 1, players: { $elemMatch: { id: playerId } } } });

    if (!event || event.judges.indexOf(session.user.email) === -1) { 
      throw new Error('Event not found');
    }

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