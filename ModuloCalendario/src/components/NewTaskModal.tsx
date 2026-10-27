import React, { useState, useEffect } from 'react';
import { X, Plus, ShieldCheck, Sparkles, Gift, Calendar, Check, Save } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { TaskIcon } from './TaskIcon';
import { sound } from '../utils/sound';
import { WEEK_DAYS } from '../utils/storage';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<Task, 'id' | 'completed'>, saveAsTemplate: boolean, existingId?: string) => void;
  initialTask?: Task | null;
}

const AVAILABLE_ICONS = [
  'book',
  'code',
  'dumbbell',
  'gamepad',
  'tv',
  'sparkles',
  'coffee',
  'gift',
  'music',
  'brain'
];

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('mandatory');
  const [icon, setIcon] = useState('book');
  const [hasCounter, setHasCounter] = useState(false);
  const [targetValue, setTargetValue] = useState(3);
  const [unit, setUnit] = useState('hs');
  const [rewardDuration, setRewardDuration] = useState('2 hs');
  const [activeDays, setActiveDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]); // Default all days
  const [saveAsTemplate, setSaveAsTemplate] = useState(true);

  // Sync state when modal opens or initialTask changes
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategory(initialTask.category);
      setIcon(initialTask.icon);
      setHasCounter(Boolean(initialTask.hasCounter));
      setTargetValue(initialTask.targetValue || 1);
      setUnit(initialTask.unit || 'hs');
      setRewardDuration(initialTask.rewardDuration || '2 hs');
      setActiveDays(initialTask.activeDays && initialTask.activeDays.length > 0 ? initialTask.activeDays : [1, 2, 3, 4, 5, 6, 0]);
      setSaveAsTemplate(true);
    } else {
      setTitle('');
      setDescription('');
      setCategory('mandatory');
      setIcon('book');
      setHasCounter(false);
      setTargetValue(3);
      setUnit('hs');
      setRewardDuration('2 hs');
      setActiveDays([1, 2, 3, 4, 5, 6, 0]);
      setSaveAsTemplate(true);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const isEditMode = Boolean(initialTask);

  // Toggle individual day
  const handleToggleDay = (dayId: number) => {
    sound.playClick();
    if (activeDays.includes(dayId)) {
      if (activeDays.length === 1) return; // Keep at least one day
      setActiveDays(activeDays.filter((d) => d !== dayId));
    } else {
      setActiveDays([...activeDays, dayId]);
    }
  };

  // Quick day presets
  const handleApplyPreset = (preset: 'all' | 'gym3' | 'work5' | 'weekend') => {
    sound.playClick();
    if (preset === 'all') {
      setActiveDays([1, 2, 3, 4, 5, 6, 0]);
    } else if (preset === 'gym3') {
      setActiveDays([1, 3, 5]); // Lunes, Miércoles, Viernes
    } else if (preset === 'work5') {
      setActiveDays([1, 2, 3, 4, 5]); // Lun a Vie
    } else if (preset === 'weekend') {
      setActiveDays([6, 0]); // Sáb y Dom
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playCheck();
    onSaveTask(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        icon,
        hasCounter: category !== 'reward' ? hasCounter : false,
        targetValue: hasCounter && category !== 'reward' ? targetValue : undefined,
        currentValue: initialTask?.currentValue || (hasCounter && category !== 'reward' ? 0 : undefined),
        unit: hasCounter && category !== 'reward' ? unit : undefined,
        rewardDuration: category === 'reward' ? rewardDuration : undefined,
        claimed: initialTask?.claimed || false,
        activeDays: activeDays.length === 7 ? undefined : activeDays
      },
      saveAsTemplate,
      initialTask?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            {isEditMode ? (
              <>
                <Save className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
                <span>Editar Tarea / Recompensa</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-cyan-400 stroke-[3]" />
                <span>Nueva Tarea o Recompensa</span>
              </>
            )}
          </h3>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase">
              Tipo de Tarea
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCategory('mandatory');
                  if (icon === 'gamepad' || icon === 'tv') setIcon('book');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 border-2 transition-all ${
                  category === 'mandatory'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Obligatoria</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCategory('optional');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 border-2 transition-all ${
                  category === 'optional'
                    ? 'border-purple-400 bg-purple-950/60 text-purple-200'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Opcional</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCategory('reward');
                  if (icon === 'book' || icon === 'code') setIcon('gamepad');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 border-2 transition-all ${
                  category === 'reward'
                    ? 'border-amber-400 bg-amber-950/60 text-amber-200'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Recompensa</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-black text-slate-300 block mb-1 uppercase">
              Título
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'mandatory'
                  ? 'Ej: 5hs de estudio o Rutina de Gym'
                  : category === 'optional'
                  ? 'Ej: 15 min de lectura'
                  : 'Ej: 3hs de juego / FIFA'
              }
              className="w-full bg-slate-950 border-2 border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 font-bold placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-black text-slate-300 block mb-1 uppercase">
              Descripción o detalle (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Entrenamiento de fuerza 3 días por semana"
              className="w-full bg-slate-950 border-2 border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
            />
          </div>

          {/* DÍAS ACTIVOS (SCHEDULE POR DÍA) */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>¿Qué días aplica esta tarea?</span>
              </label>
              <span className="text-[11px] font-bold text-cyan-400 font-mono">
                {activeDays.length === 7 ? 'Todos los días' : `${activeDays.length} días/sem`}
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('all')}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                  activeDays.length === 7
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                Todos los días
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('gym3')}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  activeDays.length === 3 && [1, 3, 5].every((d) => activeDays.includes(d))
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>💪 3 días (Lun, Mié, Vie)</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('work5')}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                  activeDays.length === 5 && [1, 2, 3, 4, 5].every((d) => activeDays.includes(d))
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                Lun a Vie
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('weekend')}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                  activeDays.length === 2 && [6, 0].every((d) => activeDays.includes(d))
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                Fin de semana
              </button>
            </div>

            {/* Day of Week Toggle Chips */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {WEEK_DAYS.map((day) => {
                const isSelected = activeDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleToggleDay(day.id)}
                    className={`py-2 rounded-xl font-black text-xs transition-all flex flex-col items-center gap-0.5 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-duo-cyan'
                        : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500'
                    }`}
                    title={day.name}
                  >
                    <span>{day.label}</span>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              💡 En los días que no selecciones, esta tarea no aparecerá ni te impedirá desbloquear tus recompensas.
            </p>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase">
              Icono
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIcon(ic);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all ${
                    icon === ic
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-300 scale-105'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <TaskIcon name={ic} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Duration / Counter settings */}
          {category === 'reward' ? (
            <div>
              <label className="text-xs font-black text-slate-300 block mb-1 uppercase">
                Duración de la Recompensa
              </label>
              <input
                type="text"
                value={rewardDuration}
                onChange={(e) => setRewardDuration(e.target.value)}
                placeholder="Ej: 3 hs, 1 hora, Libre"
                className="w-full bg-slate-950 border-2 border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-sm text-slate-100 font-bold placeholder:text-slate-600 outline-none"
              />
            </div>
          ) : (
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasCounter}
                  onChange={(e) => setHasCounter(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span className="text-xs font-bold text-slate-200">
                  ¿Tiene contador de horas o cantidad? (ej. 5hs de estudio o 1h de gym)
                </span>
              </label>

              {hasCounter && (
                <div className="grid grid-cols-2 gap-2.5 mt-3 pt-2.5 border-t border-slate-800/60">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      Meta
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={targetValue}
                      onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      Unidad
                    </span>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="hs, vasos, etc"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-100 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save as routine template checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={saveAsTemplate}
              onChange={(e) => setSaveAsTemplate(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
            <span className="text-xs text-slate-400 font-medium">
              Guardar en la plantilla fija de la rutina (afectará a todos los días correspondientes)
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full duo-btn-cyan text-slate-950 font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 mt-1 active:scale-95"
          >
            {isEditMode ? (
              <>
                <Save className="w-5 h-5" />
                <span>Guardar Cambios</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>Agregar a la Rutina</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
