export type TaskCategory = 'mandatory' | 'optional' | 'reward';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  completed: boolean;
  icon: string; // key corresponding to an icon or emoji
  
  // For time or count-based tasks (e.g. "5hs estudio")
  hasCounter?: boolean;
  targetValue?: number;
  currentValue?: number;
  unit?: string;

  // For rewards
  rewardDuration?: string; // e.g. "3 hs"
  claimed?: boolean; // When the user taps to enjoy the reward

  // Day-of-week scheduling: 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb, 0=Dom
  // If undefined or empty, it runs every day
  activeDays?: number[];
}

export interface DayRecord {
  date: string; // ISO 'YYYY-MM-DD'
  tasks: Task[];
  note?: string;
  mandatoryCompleted: boolean;
  allMandatoryCount: number;
  completedMandatoryCount: number;
  optionalCount: number;
  completedOptionalCount: number;
  unlockedRewards: boolean;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletedDays: number;
  lastActiveDate: string | null;
}

export type ViewMode = 'widget' | 'expanded';

