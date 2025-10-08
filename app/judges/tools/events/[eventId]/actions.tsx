'use server';
import { getDownloadUrl } from "@vercel/blob";
import { generateObject } from 'ai';
import { z } from 'zod';

export async function extractCardsListFromPicture({ url }: { url: string }): Promise<void> {
    const photoURL = await getDownloadUrl(url);

    console.log(photoURL);

    const photoRaw = await fetch(photoURL);
    const photoBlob = await photoRaw.blob();

    const result = await generateObject({
        model: 'openai/gpt-4.1-mini',
        messages: [
            {
                role: "user",
                content: [
                    { type: 'text', text: `Extract the list of cards from this image of a decklist. Return only the card names, no quantities or other text. If you can't identify any cards, return an empty list.` },
                    { type: 'image', image: url },
                ],
            },
        ],
        schema: z.object({
            cards: z.array(z.string()).min(1).max(100)
        }),
        maxRetries: 3,
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
    });

    console.log(result);

    return;
} 