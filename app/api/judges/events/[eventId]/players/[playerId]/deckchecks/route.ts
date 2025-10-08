import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
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
    const notes = formData.get('notes') as string;

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(
      `events/${eventId}/${playerId}/deckcheck-${Date.now()}.jpg`,
      file,
      {
        access: 'public',
      }
    );

    // Create deck check object
    const deckCheck = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      photoUrl: blob.url,
      notes: notes || undefined,
    };

    // Update MongoDB
    const client = await clientPromise;
    const db = client.db('swu-tools');

    const result = await db.collection<LimitedEvent>('events').updateOne(
      {
        id: eventId,
        'players.id': playerId,
      },
      {
        $push: { 'players.$.deckChecks': deckCheck },
        $set: { updatedAt: new Date().toISOString() },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Event or player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ deckCheck }, { status: 201 });
  } catch (error) {
    console.error('Error adding deck check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
