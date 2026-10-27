import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame 
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  addMonths, 
  subMonths, 
  isToday, 
  isFuture,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { DayRecord } from '../types';
import { sound } from '../utils/sound';

interface MiniCalendarProps {
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  records: Record<string, DayRecord>;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  selectedDateStr,
  onSelectDate,
  records
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => parseISO(selectedDateStr));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Starts Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDayClick = (date: Date) => {
    sound.playClick();
    const str = format(date, 'yyyy-MM-dd');
    onSelectDate(str);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
      {/* Month Switcher */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setCurrentMonth(subMonths(currentMonth, 1));
          }}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Mes anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-extrabold text-xs capitalize text-slate-200 font-mono">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </span>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setCurrentMonth(addMonths(currentMonth, 1));
          }}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Mes siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-500 mb-0.5">
        <span>L</span>
        <span>M</span>
        <span>M</span>
        <span>J</span>
        <span>V</span>
        <span>S</span>
        <span>D</span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const record = records[dayStr];
          const isCurrMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDateStr === dayStr;
          const isDayToday = isToday(day);
          const future = isFuture(day) && !isDayToday;

          const isCompleted = record?.mandatoryCompleted;
          const hasProgress = record && !isCompleted && record.completedMandatoryCount > 0;

          return (
            <button
              key={dayStr}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={!isCurrMonth}
              className={`h-7 rounded-lg flex flex-col items-center justify-center text-[11px] font-bold transition-all relative ${
                !isCurrMonth
                  ? 'opacity-20 cursor-default'
                  : isSelected
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-duo-cyan'
                  : 'hover:bg-slate-800 text-slate-300'
              } ${
                isDayToday && !isSelected ? 'border border-cyan-400/60 text-cyan-300' : ''
              }`}
            >
              <span className="leading-none">{format(day, 'd')}</span>

              {/* Status Dot / Flame indicator */}
              {isCurrMonth && !isSelected && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2">
                  {isCompleted ? (
                    <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  ) : hasProgress ? (
                    <div className="w-1 h-1 rounded-full bg-cyan-400" />
                  ) : record && !future ? (
                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

