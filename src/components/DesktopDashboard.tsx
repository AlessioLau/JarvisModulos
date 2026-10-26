import React from 'react';
import { 
  Task, 
  DayRecord, 
  StreakStats 
} from '../types';
import { TaskCard } from './TaskCard';
import { MiniCalendar } from './MiniCalendar';
import { JarvisMascot } from './JarvisMascot';
import { 
  ShieldAlert, 
  Sparkles, 
  Gift, 
  Flame, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Plus, 
  Smartphone, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  RotateCcw,
  PartyPopper
} from 'lucide-react';
import { sound } from '../utils/sound';
import { format, parseISO, isToday, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface DesktopDashboardProps {
  currentDateStr: string;
  onSelectDate: (dateStr: string) => void;
  records: Record<string, DayRecord>;
  streakStats: StreakStats;
  mandatoryTasks: Task[];
  optionalTasks: Task[];
  rewardTasks: Task[];
  allMandatoryDone: boolean;
  completedMandatoryCount: number;
  completionRate: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSwitchToMobile: () => void;
  onOpenNewTask: () => void;
  onOpenEditTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateCounter: (taskId: string, newValue: number) => void;
  onDeleteTask: (taskId: string) => void;
  onClaimReward: (taskId: string) => void;
  onSyncDayWithTemplates: () => void;
  onResetToDefaults: () => void;
  onImportRecords: (imported: Record<string, DayRecord>) => void;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  currentDateStr,
  onSelectDate,
  records,
  streakStats,
  mandatoryTasks,
  optionalTasks,
  rewardTasks,
  allMandatoryDone,
  completedMandatoryCount,
  completionRate,
  soundEnabled,
  onToggleSound,
  onSwitchToMobile,
  onOpenNewTask,
  onOpenEditTask,
  onToggleTask,
  onUpdateCounter,
  onDeleteTask,
  onClaimReward,
  onSyncDayWithTemplates,
  onResetToDefaults,
  onImportRecords
}) => {
  const currentDate = parseISO(currentDateStr);
  const isViewingToday = isToday(currentDate);

  const handlePrevDay = () => {
    sound.playClick();
    onSelectDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    sound.playClick();
    onSelectDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'));
  };

  const handleGoToday = () => {
    sound.playClick();
    onSelectDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleExport = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jarvis_backup_${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 px-4 py-4 animate-fadeIn">
      {/* Top PC Command Bar */}
      <header className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 shadow-xl flex items-center justify-between gap-4 backdrop-blur-md">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center font-black text-slate-950 shadow-duo-cyan text-base">
            J
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight text-white leading-none">
                JARVIS DAILY
              </h1>
              <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-950/90 px-2 py-0.5 rounded-full border border-cyan-800">
                COMMAND CENTER PC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Protocolo de hábitos, estudio y desbloqueo de recompensas
            </p>
          </div>
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-2.5">
          {/* Streak Flame Pill */}
          <div className="flex items-center gap-2 bg-amber-500/15 border-2 border-amber-500/30 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounceSubtle" />
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase block leading-none">
                Racha Activa
              </span>
              <span className="text-sm font-black text-amber-200 font-mono leading-none">
                {streakStats.currentStreak} {streakStats.currentStreak === 1 ? 'DÍA' : 'DÍAS'}
              </span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="w-10 h-10 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Switch to Mobile Widget Preview */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onSwitchToMobile();
            }}
            className="px-3 py-2 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-teal-400 text-slate-300 hover:text-teal-300 flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
            title="Cambiar a vista compacta de widget de celular"
          >
            <Smartphone className="w-4 h-4 text-teal-400" />
            <span>Vista Celular</span>
          </button>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenNewTask();
            }}
            className="duo-btn-cyan text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 active:scale-95 shadow-duo-cyan"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Tarea / Hábito</span>
          </button>
        </div>
      </header>

      {/* 3-COLUMN COMMAND CENTER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================= */}
        {/* COLUMNA 1 (IZQUIERDA, 3 cols): ASISTENTE, CALENDARIO & STATS */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Jarvis Mascot Box */}
          <JarvisMascot
            completedMandatory={completedMandatoryCount}
            totalMandatory={mandatoryTasks.length}
            rewardsUnlocked={allMandatoryDone}
            streak={streakStats.currentStreak}
          />

          {/* Mini Calendar Integrado */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Navegación Rápida
              </span>
              <span className="text-[11px] font-bold text-cyan-400">
                Selecciona cualquier día
              </span>
            </div>
            <MiniCalendar
              selectedDateStr={currentDateStr}
              onSelectDate={onSelectDate}
              records={records}
            />
          </div>

          {/* Estadísticas de Rendimiento */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Métricas Duolingo
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-purple-400 text-xs font-black mb-0.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>RÉCORD</span>
                </div>
                <span className="text-xl font-black text-purple-300 font-mono">
                  {streakStats.bestStreak}
                </span>
                <span className="text-[10px] text-slate-500 font-bold block">días racha</span>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-black mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>LOGRADOS</span>
                </div>
                <span className="text-xl font-black text-emerald-300 font-mono">
                  {streakStats.totalCompletedDays}
                </span>
                <span className="text-[10px] text-slate-500 font-bold block">días 100%</span>
              </div>
            </div>
          </div>

          {/* Backups & Actions */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleExport}
                className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-bold text-[11px]"
                title="Descargar copia JSON de tu histórico"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>Backup</span>
              </button>
              <label className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-bold text-[11px] cursor-pointer">
                <Upload className="w-3 h-3 text-indigo-400" />
                <span>Restaurar</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('¿Restablecer la rutina a los valores predeterminados?')) {
                  onResetToDefaults();
                }
              }}
              className="text-slate-500 hover:text-rose-400 text-[10px] font-bold flex items-center gap-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMNA 2 (CENTRAL, 5 cols): RUTINA DEL DÍA (OBLIGATORIAS + OPCIONALES) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Date Selector & Day Progress Header */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevDay}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Día anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h2 className="font-black text-base capitalize text-slate-100 flex items-center justify-center gap-2">
                  <span>{format(currentDate, "EEEE d 'de' MMMM", { locale: es })}</span>
                  {isViewingToday && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
                      HOY
                    </span>
                  )}
                </h2>
                {!isViewingToday && (
                  <button
                    type="button"
                    onClick={handleGoToday}
                    className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    (Volver a Hoy)
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextDay}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Día siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Duolingo Progress Bar */}
            <div>
              <div className="flex justify-between items-center text-xs font-black mb-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Progreso de Metas Obligatorias
                </span>
                <span className={`font-mono ${completionRate === 100 ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {completionRate}% {completionRate === 100 && '¡COMPLETO! 🎉'}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden shadow-inner">
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
          </div>

          {/* 1. SECCIÓN OBLIGATORIAS */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Tareas Obligatorias
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold bg-slate-800 text-cyan-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                {completedMandatoryCount}/{mandatoryTasks.length} Listas
              </span>
            </div>

            <div className="space-y-2.5">
              {mandatoryTasks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  Sin tareas obligatorias programadas para este día.
                </div>
              ) : (
                mandatoryTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onUpdateCounter={onUpdateCounter}
                    onDelete={onDeleteTask}
                    onEdit={onOpenEditTask}
                  />
                ))
              )}
            </div>
          </section>

          {/* 2. SECCIÓN OPCIONALES & HÁBITOS */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Tareas Opcionales & Hábitos
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold bg-slate-800 text-purple-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                {optionalTasks.filter((t) => t.completed).length}/{optionalTasks.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {optionalTasks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  Sin tareas opcionales hoy.
                </div>
              ) : (
                optionalTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onUpdateCounter={onUpdateCounter}
                    onDelete={onDeleteTask}
                    onEdit={onOpenEditTask}
                  />
                ))
              )}
            </div>
          </section>

          {/* Sync Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSyncDayWithTemplates}
              className="text-xs font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-900"
              title="Aplica los días de la semana y metas de tu rutina a este día"
            >
              <span>🔄 Sincronizar tareas según días de la semana</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMNA 3 (DERECHA, 4 cols): BÓVEDA DE RECOMPENSAS & OCIO */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Bóveda de Recompensas
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Gaming, series y tiempo libre sin culpa
                  </p>
                </div>
              </div>
            </div>

            {/* Protocol Status Interactive Banner */}
            <div
              className={`rounded-2xl p-4 border-2 transition-all duration-300 ${
                allMandatoryDone
                  ? 'bg-gradient-to-tr from-emerald-950/80 via-teal-900/60 to-slate-900 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-gradient-to-tr from-amber-950/60 via-slate-900 to-slate-900 border-amber-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                    allMandatoryDone
                      ? 'bg-emerald-500 text-slate-950 shadow-duo-green animate-bounceSubtle'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {allMandatoryDone ? (
                    <Unlock className="w-6 h-6 stroke-[2.5]" />
                  ) : (
                    <Lock className="w-6 h-6 stroke-[2.5]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1 ${
                      allMandatoryDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {allMandatoryDone ? 'ACCESO AUTORIZADO' : 'ACCESO DENEGADO'}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-100">
                    {allMandatoryDone
                      ? '¡Todas las obligatorias completadas! Recompensas activas.'
                      : `Faltan ${mandatoryTasks.length - completedMandatoryCount} tareas obligatorias para desbloquear.`}
                  </h4>
                </div>
              </div>
            </div>

            {/* List of Rewards */}
            <div className="space-y-3">
              {rewardTasks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  Sin recompensas configuradas. Agrega gaming o descanso.
                </div>
              ) : (
                rewardTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    rewardsUnlocked={allMandatoryDone}
                    onToggle={onToggleTask}
                    onClaimReward={onClaimReward}
                    onDelete={onDeleteTask}
                    onEdit={onOpenEditTask}
                  />
                ))
              )}
            </div>

            {/* Reclaimed history today */}
            {rewardTasks.some((t) => t.claimed) && (
              <div className="mt-2 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <PartyPopper className="w-3.5 h-3.5" />
                  Recompensas disfrutadas hoy:
                </span>
                <div className="space-y-1">
                  {rewardTasks
                    .filter((t) => t.claimed)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between text-xs bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800"
                      >
                        <span className="text-slate-300 font-bold truncate">{t.title}</span>
                        <span className="text-emerald-400 font-mono text-[11px] font-extrabold shrink-0">
                          {t.rewardDuration || '✓ Canjeada'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-2 text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-cyan-500" />
        <span>Jarvis Command Center • PWA habilitada para móvil y escritorio</span>
      </footer>
    </div>
  );
};
