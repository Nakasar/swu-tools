import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';
import { LimitedEvent } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; playerId: string }> }
) {
  const { eventId, playerId } = await params;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'Missing file or type' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(
      `events/${eventId}/${playerId}/${type}-${Date.now()}.jpg`,
      file,
      {
        access: 'public',
      }
    );

    // Update MongoDB
    const client = await clientPromise;
    const db = client.db('swu-tools');

    const fieldName = type === 'pool' ? 'poolPhotoUrl' : 'decklistPhotoUrl';

    const result = await db.collection<LimitedEvent>('events').updateOne(
      {
        id: eventId,
        'players.id': playerId,
      },
      {
        $set: {
          [`players.$.${fieldName}`]: blob.url,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Event or player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
