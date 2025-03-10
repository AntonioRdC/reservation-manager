import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema/messages';

let io: SocketIOServer;

export async function GET(_request: NextRequest) {
  if (io) {
    return new Response(null, { status: 200 });
  }

  const res = new Response();
  const server = (res as any).socket?.server;

  if (server && !server.io) {
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    server.io = io;

    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('message', async (data) => {
        try {
          const newMessage = await db
            .insert(messages)
            .values({
              content: data.content,
              senderId: data.senderId,
              conversationId: data.conversationId,
            })
            .returning();

          io.emit('message', newMessage[0]);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      socket.on('disconnect', () => {});
    });
  }

  return new Response(null, { status: 200 });
}
