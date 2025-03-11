import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { UserBookings } from './action';

interface ChatProps {
  conversationId: string;
  reservation: UserBookings;
}

export type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  conversationId: string;
};

function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/messages?conversationId=${conversationId}`,
      );
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId]);

  const sendMessage = async (content: string) => {
    if (!session?.user.id) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          senderId: session.user.id,
          conversationId,
        }),
      });

      const newMessage = await response.json();

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}

export function Chat({ conversationId, reservation }: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const { messages, loading, sendMessage } = useChat(conversationId);
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chat</h2>
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}
          />
          <span className="text-sm text-gray-500">
            {loading ? 'Carregando...' : 'Online'}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === session?.user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderId === session?.user.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t flex">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 mr-2"
        />
        <Button type="submit" disabled={!inputValue.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  );
}
