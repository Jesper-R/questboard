"use client";

import { Button } from "@/components/ui/button";
import { Clock, Calendar, CheckCircle } from "lucide-react";
import EditQuestDialog from "@/components/EditQuestDialog";
import { Quest } from "@/lib/supabase/models";
import { format } from "date-fns";

interface QuestCardProps {
  quest: Quest;
  updateQuest?: (questId: string, updates: Partial<Quest>) => Promise<Quest>;
  deleteQuest?: (questId: string) => Promise<void>;
  completeQuest?: (questId: string) => Promise<Quest>;
}

const difficultyColors = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
  epic: "bg-purple-500",
};

export default function QuestCard({
  quest,
  updateQuest,
  deleteQuest,
  completeQuest,
}: QuestCardProps) {
  const {
    title,
    description,
    type,
    difficulty,
    is_completed: isCompleted = false,
    is_expired: isExpired = false,
    due_time: dueTime,
    due_day: dueDay,
    due_date: dueDate,
  } = quest;
  return (
    <div
      className={`relative rounded-lg border-1 border-[#E6C100] bg-[#2a2a00]/20 p-4 transition-all hover:shadow-lg group ${
        isCompleted || isExpired ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-1 absolute top-3 right-3">
        <div
          className={`w-3 h-3 rounded-full ${difficultyColors[difficulty]}`}
        ></div>
      </div>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-white">{title}</h3>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-3">{description}</p>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-4 text-s text-gray-400">
          {type === "daily" && dueTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{dueTime}</span>
            </div>
          )}
          {type === "onetime" && dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(dueDate), "MMM d, yyyy")}</span>
            </div>
          )}
          {type === "weekly" && dueDay && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{dueDay?.charAt(0).toUpperCase() + dueDay?.slice(1)}</span>
            </div>
          )}
        </div>
        <div className="gap-1 flex">
          {updateQuest && deleteQuest && (
            <EditQuestDialog
              quest={quest}
              updateQuest={updateQuest}
              deleteQuest={deleteQuest}
            >
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              Edit
            </Button>
            </EditQuestDialog>
          )}
          {completeQuest ? (
            <Button
              size="sm"
              variant={isCompleted || isExpired ? "ghost" : "default"}
              className={
                isCompleted || isExpired
                  ? ""
                  : "bg-[#E6C100] text-black hover:bg-[#E6C100]/90 "
              }
              disabled={isCompleted || isExpired}
              onClick={() => !isCompleted && !isExpired && completeQuest(quest.id)}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </>
              ) : isExpired ? (
                "Expired"
              ) : (
                "Complete"
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              variant={isCompleted || isExpired ? "ghost" : "default"}
              className={
                isCompleted || isExpired
                  ? ""
                  : "bg-[#E6C100] text-black hover:bg-[#E6C100]/90 "
              }
              disabled={true}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </>
              ) : isExpired ? (
                "Expired"
              ) : (
                "Complete"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
