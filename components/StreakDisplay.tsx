import Image from "next/image";
import { useUserData } from "@/lib/contexts/UserContext";

interface StreakDisplayProps {
  type: "daily" | "weekly" | "onetime";
  className?: string;
}

export default function StreakDisplay({
  type,
  className = "",
}: StreakDisplayProps) {
  const { user: userData } = useUserData();

  const getStreak = () => {
    if (!userData) return 0;
    switch (type) {
      case "daily":
        return userData.daily_streak || 0;
      case "weekly":
        return userData.weekly_streak || 0;
      case "onetime":
        return userData.onetime_streak || 0;
      default:
        return 0;
    }
  };

  const streak = getStreak();

  return (
    <div className={`flex items-center gap-1 text-[#E6C100] ${className}`}>
      <Image
        src="/icons/streak.png"
        alt="streak"
        width={32}
        height={32}
        style={{ imageRendering: "pixelated" }}
      />
      <span className="font-semibold tabular-nums text-xl">{streak}</span>
    </div>
  );
}
