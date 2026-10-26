import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Task, 
  DayRecord, 
  ViewMode 
} from './types';
import { 
  getTodayKey, 
  getSavedRecords, 
  saveRecords, 
  getTaskTemplates, 
  saveTaskTemplates, 
  createDayRecordFromTemplate, 
  calculateRecordStats, 
  calculateStreak,
  seedInitialHistoryIfEmpty,
  DEFAULT_TASK_TEMPLATES
} from './utils/storage';
import { sound } from './utils/sound';
import { triggerRewardUnlockConfetti } from './utils/confetti';
import { HeaderWidget } from './components/HeaderWidget';
import { TaskCard } from './components/TaskCard';
import { JarvisMascot } from './components/JarvisMascot';
import { CalendarModal } from './components/CalendarModal';
import { NewTaskModal } from './components/NewTaskModal';
import { ShieldAlert, Sparkles, Gift, CheckCircle2, Lock, Zap } from 'lucide-react';

export function App() {
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayKey());
  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [templates, setTemplates] = useState<Task[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('widget');
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false);

  // Track previous mandatory unlock state to trigger celebration sound only on transition
  const prevUnlockedRef = useRef<boolean>(false);

  // Initialize
  useEffect(() => {
    seedInitialHistoryIfEmpty();
    const loadedRecords = getSavedRecords();
    const loadedTemplates = getTaskTemplates();
    setRecords(loadedRecords);
    setTemplates(loadedTemplates);

    const savedSound = localStorage.getItem('jarvis_sound_enabled');
    if (savedSound !== null) {
      const isEnabled = savedSound === 'true';
      setSoundEnabled(isEnabled);
      sound.enabled = isEnabled;
    }

    const savedView = localStorage.getItem('jarvis_view_mode') as ViewMode | null;
    if (savedView) {
      setViewMode(savedView);
    }
  }, []);

  // Save sound setting
  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.enabled = nextVal;
    localStorage.setItem('jarvis_sound_enabled', String(nextVal));
    sound.playClick();
  };

  // Toggle View Mode
  const toggleViewMode = () => {
    const nextMode: ViewMode = viewMode === 'widget' ? 'expanded' : 'widget';
    setViewMode(nextMode);
    localStorage.setItem('jarvis_view_mode', nextMode);
  };

  // Current day record
  const currentRecord = useMemo((): DayRecord => {
    if (records[selectedDateStr]) {
      return records[selectedDateStr];
    }
    // Create new for selected date
    return createDayRecordFromTemplate(selectedDateStr, templates.length > 0 ? templates : DEFAULT_TASK_TEMPLATES);
  }, [records, selectedDateStr, templates]);

  // Streak stats
  const streakStats = useMemo(() => {
    return calculateStreak(records);
  }, [records]);

  // Tasks divided by category
  const mandatoryTasks = useMemo(() => {
    return currentRecord.tasks.filter((t) => t.category === 'mandatory');
  }, [currentRecord.tasks]);

  const optionalTasks = useMemo(() => {
    return currentRecord.tasks.filter((t) => t.category === 'optional');
  }, [currentRecord.tasks]);

  const rewardTasks = useMemo(() => {
    return currentRecord.tasks.filter((t) => t.category === 'reward');
  }, [currentRecord.tasks]);

  // Check mandatory completion
  const completedMandatoryCount = mandatoryTasks.filter((t) => t.completed).length;
  const allMandatoryDone = mandatoryTasks.length > 0 && completedMandatoryCount === mandatoryTasks.length;
  const completionRate = mandatoryTasks.length > 0 
    ? Math.round((completedMandatoryCount / mandatoryTasks.length) * 100) 
    : 0;

  // Detect unlock moment
  useEffect(() => {
    if (allMandatoryDone && !prevUnlockedRef.current) {
      // Just unlocked!
      sound.playUnlockRewards();
      triggerRewardUnlockConfetti();
    }
    prevUnlockedRef.current = allMandatoryDone;
  }, [allMandatoryDone]);

  // Update a day record and persist
  const updateCurrentRecordTasks = (newTasks: Task[]) => {
    const updated = calculateRecordStats({
      ...currentRecord,
      tasks: newTasks
    });

    const nextRecords = {
      ...records,
      [selectedDateStr]: updated
    };

    setRecords(nextRecords);
    saveRecords(nextRecords);
  };

  // Toggle completion of a regular task
  const handleToggleTask = (taskId: string) => {
    const newTasks = currentRecord.tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          // If counter exists, max it out if completed or reset to 0 if unmarked
          currentValue: t.hasCounter
            ? nextCompleted
              ? t.targetValue
              : 0
            : undefined
        };
      }
      return t;
    });

    updateCurrentRecordTasks(newTasks);
  };

  // Update counter (+ / -)
  const handleUpdateCounter = (taskId: string, newValue: number) => {
    const newTasks = currentRecord.tasks.map((t) => {
      if (t.id === taskId) {
        const isDone = t.targetValue !== undefined && newValue >= t.targetValue;
        return {
          ...t,
          currentValue: newValue,
          completed: isDone
        };
      }
      return t;
    });

    updateCurrentRecordTasks(newTasks);
  };

  // Claim reward
  const handleClaimReward = (taskId: string) => {
    const newTasks = currentRecord.tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          claimed: !t.claimed
        };
      }
      return t;
    });

    updateCurrentRecordTasks(newTasks);
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const newTasks = currentRecord.tasks.filter((t) => t.id !== taskId);
    updateCurrentRecordTasks(newTasks);
  };

  // Add new task
  const handleAddTask = (
    taskData: Omit<Task, 'id' | 'completed'>,
    saveAsTemplate: boolean
  ) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completed: false
    };

    const newTasks = [...currentRecord.tasks, newTask];
    updateCurrentRecordTasks(newTasks);

    if (saveAsTemplate) {
      const newTemplates = [...templates, newTask];
      setTemplates(newTemplates);
      saveTaskTemplates(newTemplates);
    }
  };

  // Reset to default
  const handleResetToDefaults = () => {
    setTemplates(DEFAULT_TASK_TEMPLATES);
    saveTaskTemplates(DEFAULT_TASK_TEMPLATES);
    const rec = createDayRecordFromTemplate(selectedDateStr, DEFAULT_TASK_TEMPLATES);
    const nextRecs = { ...records, [selectedDateStr]: rec };
    setRecords(nextRecs);
    saveRecords(nextRecs);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 md:p-8 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background glow orbs */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container - Widget Phone Frame or Expanded Dashboard */}
      <div
        className={`w-full transition-all duration-300 relative z-10 ${
          viewMode === 'widget'
            ? 'max-w-md duo-widget-container rounded-[2.5rem] border-4 border-slate-800 p-4 sm:p-5 shadow-2xl my-auto'
            : 'max-w-4xl bg-slate-900/90 rounded-3xl border-2 border-slate-800 p-6 shadow-2xl my-auto'
        }`}
      >
        {/* Header Widget */}
        <HeaderWidget
          currentDateStr={selectedDateStr}
          onSelectDate={setSelectedDateStr}
          streak={streakStats.currentStreak}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
          viewMode={viewMode}
          onToggleViewMode={toggleViewMode}
          completionRate={completionRate}
        />

        {/* Jarvis Mascot & Motivation speech bubble */}
        <div className="my-4">
          <JarvisMascot
            completedMandatory={completedMandatoryCount}
            totalMandatory={mandatoryTasks.length}
            rewardsUnlocked={allMandatoryDone}
            streak={streakStats.currentStreak}
          />
        </div>

        {/* Task Lists Section */}
        <div className="space-y-5">
          {/* 1. SECCIÓN OBLIGATORIAS */}
          <section>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Tareas Obligatorias
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-full border border-slate-700">
                {completedMandatoryCount}/{mandatoryTasks.length} Listas
              </span>
            </div>

            <div className="space-y-2.5">
              {mandatoryTasks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  Sin tareas obligatorias. ¡Toca "+ Nueva" para agregar una!
                </div>
              ) : (
                mandatoryTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onUpdateCounter={handleUpdateCounter}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </section>

          {/* 2. SECCIÓN RECOMPENSAS (CON CANDADO INTERACTIVO DUOLINGO STYLE) */}
          <section>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Recompensas & Ocio
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                {allMandatoryDone ? (
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                    <Zap className="w-3 h-3 fill-emerald-400" /> Desbloqueadas
                  </span>
                ) : (
                  <span className="bg-amber-500/15 text-amber-400/90 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Bloqueadas
                  </span>
                )}
              </div>
            </div>

            {/* Explanatory banner if locked */}
            {!allMandatoryDone && mandatoryTasks.length > 0 && (
              <div className="mb-2 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-800/40 rounded-xl p-2.5 flex items-center gap-2 text-xs text-amber-200/90 font-medium">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>
                  Completa las <strong>tareas obligatorias</strong> para liberar tus horas de juego y recompensas.
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {rewardTasks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  Sin recompensas configuradas. Agrega gaming, películas o descanso.
                </div>
              ) : (
                rewardTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    rewardsUnlocked={allMandatoryDone}
                    onToggle={handleToggleTask}
                    onClaimReward={handleClaimReward}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </section>

          {/* 3. SECCIÓN OPCIONALES */}
          <section>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Tareas Opcionales & Hábitos
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold bg-slate-800 text-purple-300 px-2 py-0.5 rounded-full border border-slate-700">
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
                    onToggle={handleToggleTask}
                    onUpdateCounter={handleUpdateCounter}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        {/* Footer Widget Branding / Tip */}
        <footer className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-bold">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
            <span>Jarvis Habit Engine</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Ver histórico completo →
          </button>
        </footer>
      </div>

      {/* Calendar & Historical Stats Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDateStr={selectedDateStr}
        onSelectDate={setSelectedDateStr}
        records={records}
        streakStats={streakStats}
        onImportRecords={(imported) => {
          setRecords(imported);
          saveRecords(imported);
        }}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* New Task / Reward Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}

export default App;
