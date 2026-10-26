import React from 'react';
import { 
  BookOpen, 
  Dumbbell, 
  Gamepad2, 
  Sparkles, 
  Tv, 
  Coffee, 
  Code, 
  Gift, 
  Brain, 
  Flame, 
  Music, 
  Laptop,
  Smile
} from 'lucide-react';

interface TaskIconProps {
  name: string;
  className?: string;
}

export const TaskIcon: React.FC<TaskIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name.toLowerCase()) {
    case 'book':
    case 'estudio':
      return <BookOpen className={className} />;
    case 'dumbbell':
    case 'gym':
    case 'ejercicio':
      return <Dumbbell className={className} />;
    case 'gamepad':
    case 'juegos':
    case 'gaming':
      return <Gamepad2 className={className} />;
    case 'sparkles':
    case 'lectura':
      return <Sparkles className={className} />;
    case 'tv':
    case 'serie':
    case 'cine':
      return <Tv className={className} />;
    case 'coffee':
    case 'agua':
      return <Coffee className={className} />;
    case 'code':
    case 'programacion':
      return <Code className={className} />;
    case 'gift':
      return <Gift className={className} />;
    case 'brain':
      return <Brain className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'music':
      return <Music className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'check-circle':
    default:
      if (name.length <= 2) {
        return <span className="text-lg leading-none">{name}</span>;
      }
      return <Smile className={className} />;
  }
};
