import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Trophy, 
  CalendarCheck, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles
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
  isFuture 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { DayRecord, StreakStats } from '../types';
import { sound } from '../utils/sound';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  records: Record<string, DayRecord>;
  streakStats: StreakStats;
  onImportRecords?: (imported: Record<string, DayRecord>) => void;
  onResetToDefaults?: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDateStr,
  onSelectDate,
  records,
  streakStats,
  onImportRecords,
  onResetToDefaults
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  if (!isOpen) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDayClick = (date: Date) => {
    sound.playClick();
    const str = format(date, 'yyyy-MM-dd');
    onSelectDate(str);
    onClose();
  };

  const handleExport = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jarvis_rutina_backup_${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportRecords) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportRecords(parsed);
        sound.playUnlockRewards();
        alert('¡Histórico importado con éxito!');
      } catch (err) {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                Calendario e Histórico
              </h3>
              <p className="text-xs text-slate-400">
                Visualiza tu constancia y racha Duolingo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Quick Ribbon */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span className="text-xs font-black">RACHA</span>
            </div>
            <span className="text-2xl font-black text-amber-300 font-mono">
              {streakStats.currentStreak}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">días activos</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-purple-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-black">RÉCORD</span>
            </div>
            <span className="text-2xl font-black text-purple-300 font-mono">
              {streakStats.bestStreak}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">mejor racha</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black">LOGRADOS</span>
            </div>
            <span className="text-2xl font-black text-emerald-300 font-mono">
              {streakStats.totalCompletedDays}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">días 100%</span>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setCurrentMonth(subMonths(currentMonth, 1));
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h4 className="font-extrabold text-sm capitalize text-slate-100 font-mono">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h4>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setCurrentMonth(addMonths(currentMonth, 1));
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black text-slate-400 mb-2">
            <span>L</span>
            <span>M</span>
            <span>M</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
            <span>D</span>
          </div>

          {/* Days */}
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
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between text-xs font-bold transition-all relative ${
                    !isCurrMonth
                      ? 'opacity-20 cursor-default'
                      : isSelected
                      ? 'ring-2 ring-cyan-400 bg-cyan-950/40 text-cyan-200'
                      : 'hover:bg-slate-800 text-slate-300'
                  } ${
                    isDayToday ? 'border-2 border-dashed border-cyan-400/70' : ''
                  }`}
                >
                  <span className="text-[11px] font-mono leading-none">
                    {format(day, 'd')}
                  </span>

                  {/* Indicator Icon */}
                  {isCurrMonth && (
                    <div className="h-4 flex items-center justify-center">
                      {isCompleted ? (
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounceSubtle" />
                      ) : hasProgress ? (
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      ) : record && !future ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around text-[11px] text-slate-400 pt-1 font-bold">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Obligatorias Cumplidas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>En Progreso</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
            <span>Incompleto</span>
          </div>
        </div>

        {/* Backup / Export / Import options */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-bold transition-colors"
              title="Descargar copia de seguridad"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exportar</span>
            </button>
            <label className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-bold transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Importar</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          {onResetToDefaults && (
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Restablecer las plantillas iniciales por defecto?')) {
                  onResetToDefaults();
                }
              }}
              className="text-slate-500 hover:text-rose-400 text-[11px] flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
