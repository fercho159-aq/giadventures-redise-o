import { Mountain, TrendingUp, AlertTriangle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

type Difficulty = keyof typeof DIFFICULTY_COLORS;

const DIFFICULTY_ICONS: Record<Difficulty, React.ElementType> = {
  principiante: Mountain,
  intermedio: TrendingUp,
  avanzado: AlertTriangle,
  "alto-rendimiento": Flame,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  "alto-rendimiento": "Alto Rendimiento",
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function DifficultyBadge({
  difficulty,
  size = "md",
  className,
}: DifficultyBadgeProps) {
  const colors = DIFFICULTY_COLORS[difficulty];
  const Icon = DIFFICULTY_ICONS[difficulty];
  const label = DIFFICULTY_LABELS[difficulty];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        className
      )}
      aria-label={`Dificultad: ${label}`}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
      {label}
    </span>
  );
}
