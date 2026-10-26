import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Sparkles, Gift } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { TaskIcon } from './TaskIcon';
import { sound } from '../utils/sound';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>, saveAsTemplate: boolean) => void;
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
  onAddTask
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('mandatory');
  const [icon, setIcon] = useState('book');
  const [hasCounter, setHasCounter] = useState(false);
  const [targetValue, setTargetValue] = useState(3);
  const [unit, setUnit] = useState('hs');
  const [rewardDuration, setRewardDuration] = useState('2 hs');
  const [saveAsTemplate, setSaveAsTemplate] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playCheck();
    onAddTask(
      {
        title: title.trim(),
        category,
        icon,
        hasCounter: category !== 'reward' ? hasCounter : false,
        targetValue: hasCounter && category !== 'reward' ? targetValue : undefined,
        currentValue: hasCounter && category !== 'reward' ? 0 : undefined,
        unit: hasCounter && category !== 'reward' ? unit : undefined,
        rewardDuration: category === 'reward' ? rewardDuration : undefined,
        claimed: false
      },
      saveAsTemplate
    );

    // Reset
    setTitle('');
    setHasCounter(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400 stroke-[3]" />
            Nueva Tarea o Recompensa
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
                  ? 'Ej: 5hs de estudio'
                  : category === 'optional'
                  ? 'Ej: 15 min de lectura'
                  : 'Ej: 3hs de juego / FIFA'
              }
              className="w-full bg-slate-950 border-2 border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 font-bold placeholder:text-slate-600 outline-none transition-colors"
            />
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
                  ¿Tiene contador de horas o cantidad? (ej. 5hs)
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
              Incluir automáticamente en los días futuros (Plantilla fija)
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full duo-btn-cyan text-slate-950 font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 mt-1 active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Agregar a la Rutina</span>
          </button>
        </form>
      </div>
    </div>
  );
};
