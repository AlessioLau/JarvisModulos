import React from 'react';
import { Flame, Calendar as CalendarIcon, Volume2, VolumeX, Plus, Sparkles, Smartphone, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../utils/sound';
import { format, isToday, parseISO, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeaderWidgetProps {
  currentDateStr: string;
  onSelectDate: (newDateStr: string) => void;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCalendar: () => void;
  onOpenNewTask: () => void;
  viewMode: 'widget' | 'expanded';
  onToggleViewMode: () => void;
  completionRate: number; // 0 - 100
}

export const HeaderWidget: React.FC<HeaderWidgetProps> = ({
  currentDateStr,
  onSelectDate,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenCalendar,
  onOpenNewTask,
  viewMode,
  onToggleViewMode,
  completionRate
}) => {
  const currentDate = parseISO(currentDateStr);
  const isViewingToday = isToday(currentDate);

  const handlePrevDay = () => {
    sound.playClick();
    const prev = subDays(currentDate, 1);
    onSelectDate(format(prev, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    sound.playClick();
    const next = addDays(currentDate, 1);
    onSelectDate(format(next, 'yyyy-MM-dd'));
  };

  const handleGoToday = () => {
    sound.playClick();
    onSelectDate(format(new Date(), 'yyyy-MM-dd'));
  };

  return (
    <header className="flex flex-col gap-3">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-slate-950 shadow-duo-cyan text-sm">
            J
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight flex items-center gap-1.5 leading-none">
              JARVIS <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">DAILY</span>
            </h1>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1.5">
          {/* Streak pill (Duolingo style) */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 bg-amber-500/15 border-2 border-amber-500/30 hover:border-amber-400 px-3 py-1.5 rounded-2xl transition-all group active:scale-95 shadow-sm"
            title="Racha de días cumplidos. ¡Haz clic para ver el calendario!"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounceSubtle group-hover:scale-110 transition-transform" />
            <span className="font-black text-xs text-amber-300 font-mono">
              {streak} {streak === 1 ? 'DÍA' : 'DÍAS'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="w-9 h-9 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-90"
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Calendar button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenCalendar();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-90"
            title="Calendario e histórico"
          >
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
          </button>

          {/* View Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleViewMode();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-90 hidden sm:flex"
            title={viewMode === 'widget' ? 'Modo Expandido' : 'Modo Widget Móvil'}
          >
            {viewMode === 'widget' ? (
              <LayoutGrid className="w-4 h-4 text-teal-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-teal-400" />
            )}
          </button>

          {/* Add task button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenNewTask();
            }}
            className="duo-btn-cyan text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 active:scale-95"
            title="Agregar nueva tarea o recompensa"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Nueva</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-2 py-1.5 text-xs">
        <button
          type="button"
          onClick={handlePrevDay}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Día anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-extrabold capitalize text-slate-200">
            {format(currentDate, "EEEE d 'de' MMMM", { locale: es })}
          </span>
          {isViewingToday ? (
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
              HOY
            </span>
          ) : (
            <button
              type="button"
              onClick={handleGoToday}
              className="text-[10px] font-bold text-cyan-400 hover:underline cursor-pointer"
            >
              (Ir a Hoy)
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextDay}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Día siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Duolingo Global Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-[11px] font-extrabold mb-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Meta Obligatoria del Día
          </span>
          <span
            className={`font-mono ${
              completionRate === 100 ? 'text-emerald-400 font-black' : 'text-slate-300'
            }`}
          >
            {completionRate}% {completionRate === 100 && '¡COMPLETO! 🎉'}
          </span>
        </div>
        <div className="w-full bg-slate-800/90 rounded-full h-3 p-0.5 border border-slate-700/60 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completionRate === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#10b981]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </header>
  );
};
