import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { messages } from '@/lib/db/schema';
import { createMessage } from '@/lib/db/queries/messages';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const conversationId = url.searchParams.get('conversationId');

  if (!conversationId) {
    return NextResponse.json(
      { error: 'Conversation ID is required' },
      { status: 400 },
    );
  }

  try {
    const messagesList = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return NextResponse.json(messagesList);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, senderId, conversationId } = body;

    if (!content || !senderId || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const newMessage = await createMessage(content, senderId, conversationId);

    if (!newMessage) {
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 },
      );
    }

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 },
    );
  }
}
