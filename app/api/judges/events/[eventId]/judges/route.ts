import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const addJudgeSchema = z.object({
  email: z.string().email(),
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

  try {
    const body = await request.json();
    const data = addJudgeSchema.parse(body);

    const client = await clientPromise;
    const db = client.db('swu-tools');

    const { eventId } = await params;

    const event = await db.collection('events').findOne({ id: eventId });

    if (!event || event.judges.indexOf(session.user.email) === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.judges.indexOf(data.email) !== -1) {
      return NextResponse.json({ error: 'Judge already added' }, { status: 400 });
    }

    const result = await db.collection('events').updateOne(
      { id: eventId },
      {
        $addToSet: { judges: data.email },
        $set: { updatedAt: new Date().toISOString() },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error adding judge:', error);
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
