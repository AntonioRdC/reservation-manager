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
import { useMemo, useEffect } from 'react';

interface DateTimePickerProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  selectedStartTime: string;
  onSelectStartTime: (startTime: string) => void;
  selectedEndTime: string;
  onSelectEndTime: (endTime: string) => void;
  reservations: Booking[];
  selectedSpace: Space | null;
}

export function DateTimePicker({
  selectedDate,
  onSelectDate,
  selectedStartTime,
  onSelectStartTime,
  selectedEndTime,
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

    return filtered;
  }, [selectedSpace, reservations]);

  const fullyBookedDates = useMemo(() => {
    if (!filteredReservations.length) return [];

    const reservationsByDate = new Map<string, Booking[]>();

    filteredReservations.forEach((reservation) => {
      const startDate = new Date(reservation.startTime);
      const dateKey = format(startDate, 'yyyy-MM-dd');

      if (!reservationsByDate.has(dateKey)) {
        reservationsByDate.set(dateKey, []);
      }

      reservationsByDate.get(dateKey)!.push(reservation);
    });

    const fullyBooked: Date[] = [];

    reservationsByDate.forEach((reservations, dateStr) => {
      const ranges = reservations.map((reservation) => {
        const start = new Date(reservation.startTime);
        const end = new Date(reservation.endTime);
        return {
          start: start.getHours() * 60 + start.getMinutes(),
          end: end.getHours() * 60 + end.getMinutes(),
        };
      });

      const businessStart = 8 * 60;
      const businessEnd = 22 * 60;

      const timeline = Array(24 * 60).fill(false);

      ranges.forEach((range) => {
        for (let minute = range.start; minute < range.end; minute++) {
          timeline[minute] = true;
        }
      });

      let allMinutesBooked = true;
      for (let minute = businessStart; minute < businessEnd; minute++) {
        if (!timeline[minute]) {
          allMinutesBooked = false;
          break;
        }
      }

      if (allMinutesBooked) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObject = new Date(year, month - 1, day);
        fullyBooked.push(dateObject);
      }
    });

    return fullyBooked;
  }, [filteredReservations]);

  useEffect(() => {
    if (!selectedDate) return;

    const isDisabled =
      selectedDate <= new Date() ||
      fullyBookedDates.some((bookedDate) =>
        isSameDay(selectedDate, bookedDate),
      );

    if (isDisabled) {
      onSelectDate(undefined);
    }
  }, [selectedDate, fullyBookedDates, onSelectDate]);

  const reservationsForSelectedDate = useMemo(() => {
    if (!selectedDate || !filteredReservations.length) return [];

    const filtered = filteredReservations.filter(
      (reservation) =>
        reservation.startTime &&
        isSameDay(new Date(reservation.startTime), selectedDate),
    );

    return filtered;
  }, [selectedDate, filteredReservations]);

  const availableTimeOptions = useMemo(() => {
    if (!selectedDate || !reservationsForSelectedDate.length) {
      return timeOptions;
    }

    const timeToHours = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours + minutes / 60;
    };

    const reservedTimeRanges = reservationsForSelectedDate.map(
      (reservation) => {
        const startDate = new Date(reservation.startTime);
        const endDate = new Date(reservation.endTime);
        const startHours = startDate.getHours() + startDate.getMinutes() / 60;
        const endHours = endDate.getHours() + endDate.getMinutes() / 60;
        return { start: startHours, end: endHours };
      },
    );

    const filtered = timeOptions.filter((time) => {
      const timeHours = timeToHours(time);

      return !reservedTimeRanges.some(
        (range) => timeHours >= range.start && timeHours <= range.end,
      );
    });

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
            onSelect={(date) => {
              if (!date) {
                onSelectDate(undefined);
                return;
              }

              const isDisabled =
                date <= new Date() ||
                fullyBookedDates.some((bookedDate) =>
                  isSameDay(date, bookedDate),
                );

              if (!isDisabled) {
                onSelectDate(date);
              }
            }}
            disabled={(date) =>
              date <= new Date() ||
              fullyBookedDates.some((bookedDate) => isSameDay(date, bookedDate))
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
