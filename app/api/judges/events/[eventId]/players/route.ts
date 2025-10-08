import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import clientPromise from '@/lib/mongodb';
import { LimitedEvent } from '@/lib/types';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const addPlayerSchema = z.object({
  name: z.string().min(1),
  email: z.email().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.email) { 
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
    
  const { eventId } = await params;
  try {
    const body = await request.json();
    const data = addPlayerSchema.parse(body);

    const client = await clientPromise;
    const db = client.db();

    const player = {
      id: nanoid(),
      name: data.name,
      email: data.email,
      deckChecks: [],
    };

    const event = await db.collection<LimitedEvent>('events').findOne({ id: eventId }, { projection: { id: 1, judges: 1 } });

    if (!event || event.judges.indexOf(session.user.email) === -1) { 
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

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
