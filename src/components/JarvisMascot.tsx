import React from 'react';
import { Sparkles, ShieldAlert, Trophy, Flame } from 'lucide-react';

interface JarvisMascotProps {
  completedMandatory: number;
  totalMandatory: number;
  rewardsUnlocked: boolean;
  streak: number;
}

export const JarvisMascot: React.FC<JarvisMascotProps> = ({
  completedMandatory,
  totalMandatory,
  rewardsUnlocked,
  streak
}) => {
  // Determine dialogue & mood
  let mood: 'encouraging' | 'warning' | 'celebrating' = 'encouraging';
  let message = '';
  let badgeText = 'JARVIS PROTOCOL';

  if (totalMandatory === 0) {
    message = 'Bienvenido, señor. Agregue sus metas de hoy para iniciar la secuencia.';
  } else if (rewardsUnlocked) {
    mood = 'celebrating';
    badgeText = 'ACCESO TOTAL CONCEDIDO';
    message = `¡Excelente trabajo! Ha completado todas sus tareas clave. Las recompensas han sido liberadas sin culpa alguna.`;
  } else if (completedMandatory === 0) {
    mood = 'warning';
    badgeText = 'RECOMPENSAS BLOQUEADAS';
    message = `Señor, recuerde que el ocio requiere mérito previo. Complete sus tareas obligatorias para habilitar las recompensas.`;
  } else {
    mood = 'encouraging';
    badgeText = 'PROGRESO EN MARCHA';
    const remaining = totalMandatory - completedMandatory;
    message = `¡Gran ritmo! Solo le ${remaining === 1 ? 'falta 1 tarea obligatoria' : `faltan ${remaining} tareas obligatorias`} para desbloquear el tiempo de juego.`;
  }

  return (
    <div className="flex items-center gap-3.5 bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
      {/* Background neon ambient flare */}
      <div
        className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
          mood === 'celebrating'
            ? 'bg-amber-500/20'
            : mood === 'warning'
            ? 'bg-cyan-500/15'
            : 'bg-emerald-500/15'
        }`}
      />

      {/* Jarvis Holographic Core Avatar */}
      <div className="relative shrink-0">
        <div
          className={`w-13 h-13 rounded-2xl flex items-center justify-center relative p-2 transition-all duration-300 ${
            mood === 'celebrating'
              ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-duo-yellow animate-bounceSubtle'
              : mood === 'warning'
              ? 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-duo-cyan'
              : 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-duo-green'
          }`}
          style={{ width: '3.25rem', height: '3.25rem' }}
        >
          {/* Animated Jarvis Core Icon */}
          {mood === 'celebrating' ? (
            <Trophy className="w-7 h-7 animate-pulse" />
          ) : mood === 'warning' ? (
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-cyan-100 animate-ping absolute opacity-60" />
              <ShieldAlert className="w-6 h-6" />
            </div>
          ) : (
            <Sparkles className="w-6 h-6" />
          )}

          {/* Duolingo style mini streak flame tag */}
          {streak > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-slate-900 flex items-center shadow">
              <Flame className="w-2.5 h-2.5 fill-current" />
              <span>{streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
              mood === 'celebrating'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : mood === 'warning'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {badgeText}
          </span>
        </div>
        <p className="text-xs text-slate-300 font-bold mt-1 leading-snug">
          "{message}"
        </p>
      </div>
    </div>
  );
};
