import confetti from 'canvas-confetti';

export const triggerRewardUnlockConfetti = () => {
  // Center burst
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.65 },
    colors: ['#58cc02', '#22d3ee', '#ffc800', '#ff9600', '#ce82ff']
  });

  // Secondary side bursts
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.2, y: 0.7 },
      colors: ['#58cc02', '#22d3ee', '#ffc800']
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.8, y: 0.7 },
      colors: ['#ce82ff', '#ff9600', '#ff4b4b']
    });
  }, 180);
};

export const triggerTaskCheckConfetti = (x?: number, y?: number) => {
  const originX = x ? x / window.innerWidth : 0.5;
  const originY = y ? y / window.innerHeight : 0.5;

  confetti({
    particleCount: 18,
    spread: 40,
    startVelocity: 18,
    ticks: 40,
    origin: { x: originX, y: originY },
    colors: ['#58cc02', '#22d3ee', '#ffc800']
  });
};
