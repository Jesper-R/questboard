"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useUserData } from "@/lib/contexts/UserContext";
import CountUp from "@/components/reactbits/CountUp";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { questService, DateUtils } from "@/lib/services";
import { useEffect, useState } from "react";
import { QuestLog } from "@/lib/supabase/models";

export default function ProfilePage() {
  const { user: userData } = useUserData();
  const { supabase } = useSupabase();
  const [questLogs, setQuestLogs] = useState<QuestLog[]>([]);

  const currentLevel = userData?.level || 1;
  const currentXP = userData?.xp || 0;
  const xpForCurrentLevel = (currentLevel - 1) * 50;
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = 50;
  const progressPercentage = (xpProgress / xpNeeded) * 100;

  useEffect(() => {
    if (!userData || !supabase) return;

    const fetchQuestLogs = async () => {
      const endDate = DateUtils.now();
      const startDate = DateUtils.addDays(endDate, -6);
      startDate.setHours(0, 0, 0, 0);

      const logs = await questService.getQuestLogs(
        supabase,
        userData.id,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setQuestLogs(logs);
    };

    fetchQuestLogs();
  }, [userData, supabase]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#151515]">
        <Navbar />
      </div>
    );
  }

  const chartData = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = DateUtils.now();
    const data = [];

    for (let i = 0; i < 7; i++) {
      const date = DateUtils.addDays(today, i - 6);
      const dateStr = DateUtils.getLocalDateString(date);
      const dayName = days[DateUtils.getWeekDayIndex(date)];

      const dayLogs = questLogs.filter(
        (log) =>
          DateUtils.getLocalDateString(new Date(log.completed_at)) === dateStr
      );

      data.push({
        day: dayName,
        daily: dayLogs.filter((log) => log.quest_type === "daily").length,
        weekly: dayLogs.filter((log) => log.quest_type === "weekly").length,
        onetime: dayLogs.filter((log) => log.quest_type === "onetime").length,
      });
    }

    return data;
  })();

  const chartConfig = {
    daily: {
      label: "Daily",
      color: "#E6C100",
    },
    weekly: {
      label: "Weekly",
      color: "#e6ad00",
    },
    onetime: {
      label: "One-time",
      color: "#e69900",
    },
  };

  return (
    <div className="min-h-screen bg-[#151515]">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative w-[140px] h-[140px]">
              <Image
                src={userData?.avatar_path || "/avatars/default.png"}
                alt="User Avatar"
                width={128}
                height={128}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ imageRendering: "pixelated" }}
              />
              <Image
                src={userData?.border_path || "/borders/wood.png"}
                alt="Avatar Border"
                width={140}
                height={140}
                className="absolute inset-0 pointer-events-none"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="flex h-[140px] py-1 flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-start items-baseline gap-3">
                  <h1 className="text-4xl font-bold font-jacquard">
                    {userData?.username || "User"}
                  </h1>
                  <span className="text-gray-400"> - </span>
                  <p className="text-[#E6C100] text-2xl font-jacquard">
                    {userData?.user_title}
                  </p>
                </div>
                <div className="flex items-center gap-2 max-w-md">
                  <span className="text-sm text-gray-400">{currentLevel}</span>
                  <Progress value={progressPercentage} className="w-full" />
                  <span className="text-sm text-gray-400">
                    {currentLevel + 1}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/icons/coin.png"
                    alt="coin display"
                    width={30}
                    height={30}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <CountUp
                    to={userData?.coins || 0}
                    duration={1}
                    className="text-lg font-medium tabular-nums"
                  />
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/xp.png"
                    alt="xp display"
                    width={30}
                    height={30}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <CountUp
                    to={userData?.xp || 0}
                    duration={1}
                    className="text-lg tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-jacquard text-[#E6C100] mb-4">
              Quest Activity
            </h2>
            {/* Chart code taken from shadcn */}
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <AreaChart
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <defs>
                  <linearGradient id="fillDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-daily)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-daily)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-weekly)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-weekly)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillOnetime" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-onetime)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-onetime)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="onetime"
                  type="natural"
                  fill="url(#fillOnetime)"
                  fillOpacity={0.4}
                  stroke="var(--color-onetime)"
                  stackId="a"
                />
                <Area
                  dataKey="weekly"
                  type="natural"
                  fill="url(#fillWeekly)"
                  fillOpacity={0.4}
                  stroke="var(--color-weekly)"
                  stackId="a"
                />
                <Area
                  dataKey="daily"
                  type="natural"
                  fill="url(#fillDaily)"
                  fillOpacity={0.4}
                  stroke="var(--color-daily)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
