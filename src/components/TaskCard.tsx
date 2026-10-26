import React, { useState } from 'react';
import { Task } from '../types';
import { TaskIcon } from './TaskIcon';
import { Check, Lock, Unlock, Plus, Minus, Trash2, PartyPopper, Pencil, Calendar } from 'lucide-react';
import { sound } from '../utils/sound';
import { triggerTaskCheckConfetti, triggerRewardUnlockConfetti } from '../utils/confetti';
import { formatActiveDays } from '../utils/storage';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onUpdateCounter?: (taskId: string, newValue: number) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  rewardsUnlocked?: boolean;
  onClaimReward?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onUpdateCounter,
  onDelete,
  onEdit,
  rewardsUnlocked = true,
  onClaimReward
}) => {
  const [shaking, setShaking] = useState(false);
  const [showLockedWarning, setShowLockedWarning] = useState(false);

  const isReward = task.category === 'reward';
  const isLocked = isReward && !rewardsUnlocked;

  const handleCardClick = () => {
    if (isLocked) {
      sound.playLockDeny();
      setShaking(true);
      setShowLockedWarning(true);
      setTimeout(() => setShaking(false), 400);
      setTimeout(() => setShowLockedWarning(false), 2800);
      return;
    }

    if (isReward) {
      if (onClaimReward) {
        sound.playClaimReward();
        triggerRewardUnlockConfetti();
        onClaimReward(task.id);
      }
      return;
    }

    // Toggle for regular tasks if clicking checkbox area
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    if (!task.completed) {
      sound.playCheck();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      triggerTaskCheckConfetti(rect.x + rect.width / 2, rect.y + rect.height / 2);
    } else {
      sound.playUncheck();
    }
    onToggle(task.id);
  };

  const handleCounterChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    if (!onUpdateCounter || task.targetValue === undefined) return;
    sound.playClick();

    const current = task.currentValue || 0;
    const nextVal = Math.max(0, Math.min(task.targetValue, current + delta));
    onUpdateCounter(task.id, nextVal);

    if (nextVal >= task.targetValue && !task.completed) {
      sound.playCheck();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      triggerTaskCheckConfetti(rect.x + rect.width / 2, rect.y + rect.height / 2);
    }
  };

  // Determine styling based on category and state
  let cardBorderColor = 'border-slate-700';
  let badgeColor = 'bg-slate-800 text-slate-300';

  if (task.category === 'mandatory') {
    cardBorderColor = task.completed ? 'border-emerald-500/70' : 'border-cyan-500/50';
    badgeColor = 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50';
  } else if (task.category === 'optional') {
    cardBorderColor = task.completed ? 'border-purple-500/70' : 'border-indigo-500/40';
    badgeColor = 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/50';
  } else if (isReward) {
    if (isLocked) {
      cardBorderColor = 'border-amber-900/30';
      badgeColor = 'bg-amber-950/30 text-amber-500/80 border border-amber-900/40';
    } else {
      cardBorderColor = task.claimed ? 'border-emerald-500/80' : 'border-amber-400';
      badgeColor = 'bg-amber-900/40 text-amber-300 border border-amber-600/50';
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={`relative group rounded-2xl p-4 transition-all select-none ${
        isLocked
          ? 'duo-card-locked opacity-75 cursor-not-allowed hover:opacity-85'
          : isReward && !task.claimed
          ? 'duo-card duo-reward-unlocked bg-slate-900/90 cursor-pointer'
          : 'duo-card bg-slate-900/80'
      } ${task.completed ? 'bg-slate-900/50 opacity-90' : ''} ${
        shaking ? 'animate-shake' : ''
      } ${cardBorderColor}`}
    >
      {/* Locked Tooltip Warning */}
      {showLockedWarning && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-rose-900/95 text-rose-100 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-rose-500 flex items-center gap-1.5 animate-bounceSubtle whitespace-nowrap">
          <Lock className="w-3.5 h-3.5 text-rose-300" />
          <span>¡Completa tus tareas obligatorias para desbloquear!</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Checkbox or Lock Icon */}
        {isReward ? (
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
              isLocked
                ? 'bg-slate-800/80 text-amber-500/70 border-2 border-dashed border-amber-700/50'
                : task.claimed
                ? 'bg-emerald-500 text-white shadow-duo-green'
                : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-duo-yellow hover:scale-105 active:scale-95'
            }`}
          >
            {isLocked ? (
              <Lock className="w-5 h-5" />
            ) : task.claimed ? (
              <Check className="w-6 h-6 stroke-[3]" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCheckboxClick}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              task.completed
                ? task.category === 'mandatory'
                  ? 'bg-emerald-500 text-white shadow-duo-green scale-100'
                  : 'bg-purple-600 text-white shadow-duo-purple scale-100'
                : 'bg-slate-800 border-2 border-slate-600 hover:border-slate-400 text-transparent hover:scale-105 active:scale-95'
            }`}
            title={task.completed ? 'Marcar incompleta' : 'Marcar completada'}
          >
            <Check
              className={`w-6 h-6 stroke-[3] transition-transform ${
                task.completed ? 'scale-100' : 'scale-50 opacity-0'
              }`}
            />
          </button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-slate-400 group-hover:text-cyan-400 transition-colors ${
                task.completed ? 'line-through text-slate-500' : ''
              }`}
            >
              <TaskIcon name={task.icon} className="w-4 h-4" />
            </span>
            <h4
              className={`font-extrabold text-sm sm:text-base tracking-tight truncate ${
                task.completed ? 'line-through text-slate-500' : 'text-slate-100'
              } ${isLocked ? 'text-slate-400' : ''}`}
            >
              {task.title}
            </h4>

            {/* Active days pill if scheduled for specific days */}
            {task.activeDays && task.activeDays.length > 0 && task.activeDays.length < 7 && (
              <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded-md border border-cyan-800/60 flex items-center gap-1 shrink-0">
                <Calendar className="w-2.5 h-2.5 text-cyan-400" />
                {formatActiveDays(task.activeDays)}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
              {task.description}
            </p>
          )}

          {/* Progress bar for counter-based tasks */}
          {task.hasCounter && task.targetValue && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    task.completed
                      ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(((task.currentValue || 0) / task.targetValue) * 100)
                    )}%`
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-300 font-mono shrink-0">
                {task.currentValue || 0}/{task.targetValue} {task.unit || 'hs'}
              </span>
            </div>
          )}
        </div>

        {/* Controls / Badges / Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Stepper controls if counter */}
          {task.hasCounter && !isLocked && !task.completed && (
            <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={(e) => handleCounterChange(e, -1)}
                disabled={(task.currentValue || 0) <= 0}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => handleCounterChange(e, 1)}
                disabled={(task.currentValue || 0) >= (task.targetValue || 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-cyan-400 hover:text-white hover:bg-cyan-600 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reward duration badge */}
          {isReward && (
            <div className="flex flex-col items-end">
              <span
                className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg ${badgeColor}`}
              >
                {task.rewardDuration || 'Recompensa'}
              </span>

              {!isLocked && !task.claimed && (
                <span className="text-[10px] text-amber-400 font-bold mt-1 flex items-center gap-1 animate-pulse">
                  <PartyPopper className="w-3 h-3" /> ¡Canjear!
                </span>
              )}
              {task.claimed && (
                <span className="text-[10px] text-emerald-400 font-bold mt-1">
                  ✓ Reclamada
                </span>
              )}
            </div>
          )}

          {/* Edit action on hover */}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onEdit(task);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/40 rounded-lg"
              title="Editar tarea y días asignados"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete action on hover */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onDelete(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg"
              title="Eliminar tarea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
