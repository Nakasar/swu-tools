import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import clientPromise from '@/lib/mongodb';
import { LimitedEvent } from '@/lib/types';

const addPlayerSchema = z.object({
  name: z.string().min(1),
  email: z.email().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  try {
    const body = await request.json();
    const data = addPlayerSchema.parse(body);

    const client = await clientPromise;
    const db = client.db('swu-tools');

    const player = {
      id: nanoid(),
      name: data.name,
      email: data.email,
      deckChecks: [],
    };

    const result = await db.collection<LimitedEvent>('events').updateOne(
      { id: eventId },
      {
        $push: { players: player },
        $set: { updatedAt: new Date().toISOString() },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('Error adding player:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
