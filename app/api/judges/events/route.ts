import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { generateEventId } from '@/lib/helpers';

const createEventSchema = z.object({
  name: z.string().min(1),
  format: z.enum(['sealed', 'draft']),
  creatorEmail: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createEventSchema.parse(body);

    const client = await clientPromise;
    const db = client.db('swu-tools');

    const event = {
      id: generateEventId(),
      name: data.name,
      format: data.format,
      date: new Date().toISOString(),
      creatorEmail: data.creatorEmail,
      judges: [data.creatorEmail],
      players: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('events').insertOne(event);

    return NextResponse.json({ eventId: event.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
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
