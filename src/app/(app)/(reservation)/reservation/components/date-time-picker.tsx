import { CalendarIcon } from '@radix-ui/react-icons';
import { ptBR } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';

import { cn } from '@/lib/utils';

import { timeOptions } from '@/app/(app)/(reservation)/reservation/docs';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Booking, Space } from '@/lib/db/schema';
import { useMemo } from 'react';

interface DateTimePickerProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onSelectStartTime: (startTime: string) => void;
  onSelectEndTime: (endTime: string) => void;
  reservations: Booking[];
  selectedSpace: Space | null;
}

export function DateTimePicker({
  selectedDate,
  onSelectDate,
  onSelectStartTime,
  onSelectEndTime,
  reservations,
  selectedSpace,
}: DateTimePickerProps) {
  const formatDate = (date: Date | undefined) => {
    return date
      ? format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })
      : 'Escolha uma data';
  };

  const filteredReservations = useMemo(() => {
    if (!selectedSpace) return [];

    const filtered = reservations.filter(
      (reservation) =>
        reservation.spaceId === selectedSpace.id &&
        ['CONFIRMED', 'PAYMENT', 'REQUESTED'].includes(reservation.status),
    );

    console.log('filteredReservations:', filtered);
    return filtered;
  }, [selectedSpace, reservations]);

  const reservationsForSelectedDate = useMemo(() => {
    if (!selectedDate || !filteredReservations.length) return [];

    const filtered = filteredReservations.filter(
      (reservation) =>
        reservation.startTime &&
        isSameDay(new Date(reservation.startTime), selectedDate),
    );

    console.log('reservationsForSelectedDate:', filtered);
    return filtered;
  }, [selectedDate, filteredReservations]);

  const availableTimeOptions = useMemo(() => {
    if (!selectedDate || !reservationsForSelectedDate.length) {
      return timeOptions;
    }

    const timeToHours = (timeStr: string) => {
      const [timePart, meridiem] = timeStr.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);

      if (meridiem === 'PM' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'AM' && hours === 12) {
        hours = 0;
      }

      return hours + minutes / 60;
    };

    console.log('timeOptions:', timeOptions);

    const reservedTimeRanges = reservationsForSelectedDate.map(
      (reservation) => {
        const startDate = new Date(reservation.startTime);
        const endDate = new Date(reservation.endTime);
        const startHours = startDate.getHours() + startDate.getMinutes() / 60;
        const endHours = endDate.getHours() + endDate.getMinutes() / 60;
        return { start: startHours, end: endHours };
      },
    );
    console.log('reservedTimeRanges:', reservedTimeRanges);

    const filtered = timeOptions.filter((time) => {
      const timeHours = timeToHours(time);
      console.log('time:', time);
      console.log('timeHours:', timeHours);

      return !reservedTimeRanges.some(
        (range) => timeHours >= range.start && timeHours <= range.end,
      );
    });
    console.log('filtered:', filtered);

    return filtered;
  }, [selectedDate, reservationsForSelectedDate]);

  return (
    <div className="flex flex-col gap-2 items-center md:flex-row">
      {/* Data */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'pl-3 text-left font-normal',
              !selectedDate && 'text-muted-foreground',
            )}
          >
            {formatDate(selectedDate)}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {/* Hora de início */}
      <Select
        onValueChange={onSelectStartTime}
        defaultValue={availableTimeOptions[0]}
        value={availableTimeOptions[0]}
      >
        <SelectTrigger>
          <SelectValue placeholder="Início" />
        </SelectTrigger>
        <SelectContent>
          {availableTimeOptions.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-gray-500">-</span>

      {/* Hora de fim */}
      <Select
        onValueChange={onSelectEndTime}
        defaultValue={availableTimeOptions[availableTimeOptions.length - 1]}
        value={availableTimeOptions[availableTimeOptions.length - 1]}
      >
        <SelectTrigger>
          <SelectValue placeholder="Fim" />
        </SelectTrigger>
        <SelectContent>
          {availableTimeOptions.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
