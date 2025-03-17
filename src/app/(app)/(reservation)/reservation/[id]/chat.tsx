import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ChatParticipant } from '@/lib/db/queries/conversation-participants';

interface ChatProps {
  conversationId: string;
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
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/conversations/messages?conversationId=${conversationId}`,
      );
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `/api/conversations/participants?conversationId=${conversationId}`,
      );
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchParticipants();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId]);

  const sendMessage = async (content: string) => {
    if (!session?.user.id) return;

    try {
      const response = await fetch('/api/conversations/messages', {
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
    participants,
    loading,
    sendMessage,
  };
}

export function Chat({ conversationId }: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const { messages, participants, loading, sendMessage } =
    useChat(conversationId);
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputLength = inputValue.trim().length;

  const isUserAdmin = session?.user?.role === 'ADMIN';
  const adminParticipants = participants.filter((p) => p.role === 'ADMIN');
  const nonAdminParticipants = participants.filter((p) => p.role !== 'ADMIN');

  const displayParticipants = isUserAdmin
    ? nonAdminParticipants
    : adminParticipants;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const groupedMessages = messages.reduce((groups: any[], message, index) => {
    const prevMessage = messages[index - 1];
    const isSameSender =
      prevMessage && prevMessage.senderId === message.senderId;

    if (isSameSender) {
      groups[groups.length - 1].messages.push(message);
    } else {
      const sender = participants.find((p) => p.id === message.senderId);
      groups.push({
        senderId: message.senderId,
        senderName: sender?.name || 'Usuário',
        messages: [message],
      });
    }
    return groups;
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-2">
          {displayParticipants.length > 0 ? (
            <div className="flex -space-x-2">
              {displayParticipants.slice(0, 3).map((participant) => (
                <TooltipProvider key={participant.id} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="border-2 border-background h-8 w-8">
                        <AvatarImage
                          src={participant.image || ''}
                          alt={participant.name || 'Avatar'}
                        />
                        <AvatarFallback>
                          {participant.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participant.name || 'Usuário'}</p>
                      <p className="text-xs text-muted-foreground">
                        {participant.email}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {displayParticipants.length > 3 && (
                <Avatar className="border-2 border-background h-8 w-8 bg-muted">
                  <AvatarFallback>
                    +{displayParticipants.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ) : (
            <Avatar>
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          )}
          <div className="ml-2">
            <p className="text-sm font-medium leading-none">
              {isUserAdmin
                ? nonAdminParticipants[0]?.name || 'Cliente'
                : 'Suporte'}
            </p>
            <p className="text-xs text-muted-foreground">
              {displayParticipants.length > 0
                ? `${displayParticipants.length} participante${displayParticipants.length > 1 ? 's' : ''}`
                : 'Carregando...'}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}
          />
          <span className="text-xs text-muted-foreground">
            {loading ? 'Carregando...' : 'Online'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-6" ref={scrollRef}>
            {groupedMessages.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={cn(
                  'space-y-2',
                  group.senderId === session?.user?.id
                    ? 'flex flex-col items-end'
                    : '',
                )}
              >
                {' '}
                <p
                  className={cn(
                    'text-xs font-medium px-1',
                    group.senderId === session?.user?.id ? 'text-right' : '',
                  )}
                >
                  {group.senderId === session?.user?.id
                    ? 'Você'
                    : group.senderName}
                </p>
                {group.messages.map((message: Message, msgIndex: number) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm',
                      message.senderId === session?.user?.id
                        ? 'ml-auto bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted rounded-tl-none',
                      msgIndex > 0 && '!rounded-t-md',
                      msgIndex < group.messages.length - 1 && '!rounded-b-md',
                    )}
                  >
                    {message.content}
                    <span className="text-[10px] opacity-70 mt-1">
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {messages.length === 0 && !loading && (
              <div className="text-center text-sm text-muted-foreground py-8">
                Nenhuma mensagem ainda. Seja o primeiro a enviar!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-3">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
