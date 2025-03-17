import { NextRequest, NextResponse } from 'next/server';
import { getConversationParticipants } from '@/lib/db/queries/conversation-participants';

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
    const participants = await getConversationParticipants(conversationId);

    if (!participants || participants.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching conversation participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 },
    );
  }
}
