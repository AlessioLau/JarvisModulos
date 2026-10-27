import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { sound } from '../utils/sound';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also check if already running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (isStandalone) {
      setIsDismissed(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    sound.playClick();
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      sound.playUnlockRewards();
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sound.playClick();
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-bounceSubtle">
      <div className="bg-gradient-to-r from-slate-900 to-cyan-950 border-2 border-cyan-500/60 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 text-white backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 shadow-duo-cyan">
          <Smartphone className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-xs text-cyan-300 uppercase tracking-tight">
            Instalar Jarvis en tu celular
          </h4>
          <p className="text-[11px] text-slate-300 font-medium truncate">
            Úsala a pantalla completa como app nativa
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="duo-btn-cyan text-slate-950 text-xs font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[3]" />
            <span>Instalar</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

