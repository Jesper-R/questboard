"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUserData } from "@/lib/contexts/UserContext";
import { questService, DateUtils } from "@/lib/services";
import { QuestLog } from "@/lib/supabase/models";

export default function QuestActivityChart() {
  const { user: userData } = useUserData();
  const { supabase } = useSupabase();
  const [questLogs, setQuestLogs] = useState<QuestLog[]>([]);

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
        endDate.toISOString(),
        "completed"
      );
      setQuestLogs(logs);
    };

    fetchQuestLogs();
  }, [userData, supabase]);

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
          DateUtils.getLocalDateString(new Date(log.action_at)) === dateStr
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
    <div>
      {/* chart code taken from shadcn with slight tweaks */}
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <AreaChart
          data={chartData}
          margin={{
            left: 20,
            right: 20,
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
  );
}
