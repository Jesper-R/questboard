"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUserData } from "@/lib/contexts/UserContext";
import { questService } from "@/lib/services";
import { QuestLog } from "@/lib/supabase/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";

interface QuestActivityLogProps {
  limit?: number;
}

const actionColors = {
  created: "bg-blue-500/10 text-blue-500",
  completed: "bg-green-500/10 text-green-500",
  edited: "bg-yellow-500/10 text-yellow-500",
  deleted: "bg-red-500/10 text-red-500",
  expired: "bg-gray-500/10 text-gray-500",
};

export default function QuestActivityLog({ limit = 0 }: QuestActivityLogProps) {
  const { user: userData } = useUserData();
  const { supabase } = useSupabase();
  const [questLogs, setQuestLogs] = useState<QuestLog[]>([]);

  useEffect(() => {
    if (!userData || !supabase) return;

    const fetchQuestLogs = async () => {
      const logs = await questService.getQuestLogs(supabase, userData.id);
      setQuestLogs(logs);
    };

    fetchQuestLogs();

    const handleQuestLogUpdate = () => {
      fetchQuestLogs();
    };

    window.addEventListener("questLogUpdated", handleQuestLogUpdate);

    return () => {
      window.removeEventListener("questLogUpdated", handleQuestLogUpdate);
    };
  }, [userData, supabase]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hourDifference = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (hourDifference < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    return format(date, "PP 'at' p");
  };

  return (
    <div>
      <h2 className="text-3xl font-jacquard text-[#E6C100] mb-4">Quest Log</h2>
      <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1919]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Quest</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Action</TableHead>
              <TableHead className="text-gray-400">Time</TableHead>
              <TableHead className="text-gray-400 text-right">
                Rewards
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questLogs.length > 0 ? (
              questLogs
                .sort(
                  (a, b) =>
                    new Date(b.action_at).getTime() -
                    new Date(a.action_at).getTime()
                )
                .slice(0, limit === 0 ? undefined : limit)
                .map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium ">
                      {log.quest_title}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          "text-xs font-medium uppercase text-gray-500"
                        }
                      >
                        {log.quest_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                          actionColors[log.action]
                        }`}
                      >
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(log.action_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.xp_earned !== null && log.coins_earned !== null ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-blue-300 text-sm font-medium">
                            +{log.xp_earned} XP
                          </span>
                          <span className="text-yellow-500 text-sm font-medium">
                            +{log.coins_earned} coins
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No quest activity yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
