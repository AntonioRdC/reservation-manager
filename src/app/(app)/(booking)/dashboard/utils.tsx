import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatStartTime = (startTime: string | Date) => {
  const formatTime = `${format(new Date(startTime), 'eeee, dd MMMM yyyy', { locale: ptBR })} - ${format(new Date(startTime), 'HH:mm')}`;

  return formatTime.replace(/^./, formatTime[0].toUpperCase());
};
