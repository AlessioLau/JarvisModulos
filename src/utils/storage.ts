import { DayRecord, StreakStats, Task } from '../types';
import { format, subDays, parseISO, isSameDay } from 'date-fns';

const STORAGE_KEYS = {
  RECORDS: 'jarvis_daily_records_v1',
  TEMPLATES: 'jarvis_daily_templates_v1',
  STATS: 'jarvis_daily_stats_v1'
};

// Initial default template matching the user's requirements
export const DEFAULT_TASK_TEMPLATES: Task[] = [
  // Obligatorias
  {
    id: 'm1',
    title: '5hs Estudio / Programación',
    description: 'Sesión enfocada de estudio profundo',
    category: 'mandatory',
    completed: false,
    icon: 'book',
    hasCounter: true,
    currentValue: 0,
    targetValue: 5,
    unit: 'hs'
  },
  {
    id: 'm2',
    title: 'Rutina de Ejercicio / Salud',
    description: 'Mover el cuerpo para recargar energía',
    category: 'mandatory',
    completed: false,
    icon: 'dumbbell',
    hasCounter: true,
    currentValue: 0,
    targetValue: 1,
    unit: 'h'
  },
  // Opcionales
  {
    id: 'o1',
    title: 'Lectura o Desarrollo Personal',
    description: '15 - 30 minutos de lectura reflexiva',
    category: 'optional',
    completed: false,
    icon: 'sparkles',
    hasCounter: false
  },
  {
    id: 'o2',
    title: 'Limpiar & Organizar el escritorio',
    description: 'Entorno despejado, mente enfocada',
    category: 'optional',
    completed: false,
    icon: 'check-circle',
    hasCounter: false
  },
  {
    id: 'o3',
    title: 'Beber 2.5L de agua',
    description: 'Hidratación óptima durante el día',
    category: 'optional',
    completed: false,
    icon: 'coffee',
    hasCounter: true,
    currentValue: 0,
    targetValue: 5,
    unit: 'vasos'
  },
  // Recompensas
  {
    id: 'r1',
    title: '3hs de Gaming / Videojuegos',
    description: 'Disfruta sin culpa, ¡te lo ganaste!',
    category: 'reward',
    completed: false,
    rewardDuration: '3 hs',
    claimed: false,
    icon: 'gamepad'
  },
  {
    id: 'r2',
    title: 'Ver Película o Serie',
    description: 'Capítulo o maratón relax nocturno',
    category: 'reward',
    completed: false,
    rewardDuration: '2 hs',
    claimed: false,
    icon: 'tv'
  },
  {
    id: 'r3',
    title: 'Tiempo libre / Salida relajada',
    description: 'Desconexión total de responsabilidades',
    category: 'reward',
    completed: false,
    rewardDuration: 'Libre',
    claimed: false,
    icon: 'gift'
  }
];

export const getTodayKey = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getSavedRecords = (): Record<string, DayRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading records', e);
    return {};
  }
};

export const saveRecords = (records: Record<string, DayRecord>) => {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving records', e);
  }
};

export const getTaskTemplates = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) return DEFAULT_TASK_TEMPLATES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TASK_TEMPLATES;
  } catch {
    return DEFAULT_TASK_TEMPLATES;
  }
};

export const saveTaskTemplates = (templates: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error('Error saving templates', e);
  }
};

export const createDayRecordFromTemplate = (dateStr: string, templates: Task[]): DayRecord => {
  const clonedTasks = templates.map((t) => ({
    ...t,
    id: `${t.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    completed: false,
    currentValue: t.hasCounter ? 0 : undefined,
    claimed: false
  }));

  const mandatory = clonedTasks.filter((t) => t.category === 'mandatory');
  const optional = clonedTasks.filter((t) => t.category === 'optional');

  return {
    date: dateStr,
    tasks: clonedTasks,
    mandatoryCompleted: false,
    allMandatoryCount: mandatory.length,
    completedMandatoryCount: 0,
    optionalCount: optional.length,
    completedOptionalCount: 0,
    unlockedRewards: false
  };
};

export const calculateRecordStats = (record: DayRecord): DayRecord => {
  const mandatory = record.tasks.filter((t) => t.category === 'mandatory');
  const optional = record.tasks.filter((t) => t.category === 'optional');

  const completedMandatory = mandatory.filter((t) => t.completed).length;
  const completedOptional = optional.filter((t) => t.completed).length;

  const allMandatoryDone = mandatory.length > 0 && completedMandatory === mandatory.length;

  return {
    ...record,
    allMandatoryCount: mandatory.length,
    completedMandatoryCount: completedMandatory,
    optionalCount: optional.length,
    completedOptionalCount: completedOptional,
    mandatoryCompleted: allMandatoryDone,
    unlockedRewards: allMandatoryDone
  };
};

export const calculateStreak = (records: Record<string, DayRecord>): StreakStats => {
  const today = new Date();
  let currentStreak = 0;
  let bestStreak = 0;
  let totalCompletedDays = 0;

  // Count total completed
  Object.values(records).forEach((rec) => {
    if (rec.mandatoryCompleted) {
      totalCompletedDays++;
    }
  });

  // Calculate current streak backwards from today or yesterday
  let checkDate = today;
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayRecord = records[todayStr];

  if (todayRecord && todayRecord.mandatoryCompleted) {
    currentStreak++;
    checkDate = subDays(today, 1);
  } else {
    // If today is not finished yet, check if yesterday was finished to keep streak alive
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
    const yesterdayRecord = records[yesterdayStr];
    if (yesterdayRecord && yesterdayRecord.mandatoryCompleted) {
      checkDate = subDays(today, 1);
    } else {
      // Streak broken or 0
      checkDate = subDays(today, 1);
    }
  }

  // Count consecutive days going back
  while (true) {
    const dStr = format(checkDate, 'yyyy-MM-dd');
    if (dStr === todayStr && todayRecord && todayRecord.mandatoryCompleted) {
      // Already counted
      checkDate = subDays(checkDate, 1);
      continue;
    }
    const rec = records[dStr];
    if (rec && rec.mandatoryCompleted) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Calculate best historical streak
  const sortedDates = Object.keys(records).sort();
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const rec = records[dStr];
    const currDate = parseISO(dStr);
    if (rec.mandatoryCompleted) {
      if (prevDate && isSameDay(currDate, subDays(prevDate, -1))) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      prevDate = currDate;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
      prevDate = null;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return {
    currentStreak,
    bestStreak,
    totalCompletedDays,
    lastActiveDate: todayRecord && todayRecord.mandatoryCompleted ? todayStr : null
  };
};

// Seed mock history so the user can immediately experience the calendar with past data!
export const seedInitialHistoryIfEmpty = () => {
  const existing = getSavedRecords();
  if (Object.keys(existing).length > 0) return;

  const records: Record<string, DayRecord> = {};
  const today = new Date();
  const templates = getTaskTemplates();

  // Create 5 days of history for immediate visual richness
  for (let i = 4; i >= 0; i--) {
    const d = subDays(today, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const rec = createDayRecordFromTemplate(dateStr, templates);

    // If it's 2 days ago or 1 day ago, mark them completed for a nice 2-day streak!
    if (i === 1 || i === 2) {
      rec.tasks = rec.tasks.map((t) => {
        if (t.category === 'mandatory') {
          return {
            ...t,
            completed: true,
            currentValue: t.targetValue
          };
        }
        if (t.category === 'reward') {
          return {
            ...t,
            claimed: true
          };
        }
        return t;
      });
    }

    records[dateStr] = calculateRecordStats(rec);
  }

  saveRecords(records);
};
