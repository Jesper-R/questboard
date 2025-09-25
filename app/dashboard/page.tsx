"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CreateQuestDialog from "@/components/CreateQuestDialog";
import QuestCard from "@/components/QuestCard";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";

const mockQuests = [
  {
    title: "Morning Workout",
    description: "Complete 30 minutes of exercise to start the day strong",
    type: "daily" as const,
    difficulty: "medium" as const,
    dueTime: "07:00",
    isCompleted: false,
  },
  {
    title: "Morning Workout",
    description: "Complete 30 minutes of exercise to start the day strong",
    type: "daily" as const,
    difficulty: "medium" as const,
    dueTime: "07:00",
    isCompleted: false,
  },
  {
    title: "Code Review",
    description: "Review at least 2 pull requests from team members",
    type: "daily" as const,
    difficulty: "easy" as const,
    dueTime: "10:00",
    isCompleted: true,
  },
  {
    title: "Learn TypeScript",
    description:
      "Complete one chapter from the TypeScript handbook and practice with examples Complete one chapter from the TypeScript handbook and practice with examples Complete one chapter from the TypeScript handbook and practice with examples",
    type: "weekly" as const,
    difficulty: "hard" as const,
    dueDay: "Friday",
    isCompleted: false,
  },
  {
    title: "Deploy New Feature",
    description:
      "Finalize testing and deploy the user authentication feature to production",
    type: "onetime" as const,
    difficulty: "epic" as const,
    dueDate: "2024-01-15",
    isCompleted: false,
  },
  {
    title: "Team Standup",
    description: "Participate in daily standup meeting",
    type: "daily" as const,
    difficulty: "easy" as const,
    dueTime: "09:30",
    isCompleted: true,
  },
];

const DashboardPage = () => {
  const [showUpcoming, setShowUpcoming] = useState(true);

  return (
    <div className="min-h-screen bg-[#151515]">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-start mb-6 gap-2">
          <CreateQuestDialog>
            <Button variant="outline" className="text-[#E6C100]">
              <Plus />
              New Quest
            </Button>
          </CreateQuestDialog>

          <Button
            variant="outline"
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="text-gray-400 hover:text-[#E6C100]"
          >
            {showUpcoming ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Upcoming
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Upcoming
              </>
            )}
          </Button>
        </div>

        {showUpcoming && (
          <div className="mb-8">
            <h2 className="text-3xl text-[#E6C100] mb-4 font-jacquard">
              Upcoming Quests
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {mockQuests
                .filter((quest) => !quest.isCompleted)
                .slice(0, 5)
                .map((quest, index) => (
                  <div key={index} className="min-w-80 flex-shrink-0">
                    <QuestCard
                      {...quest}
                      description={
                        quest.description.length > 60
                          ? quest.description.substring(0, 60) + "..."
                          : quest.description
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h2 className="text-3xl text-[#E6C100] mb-4 flex items-center gap-2 font-jacquard">
              Daily Quests
            </h2>
            <div className="space-y-4">
              {mockQuests
                .filter((quest) => quest.type === "daily")
                .map((quest, index) => (
                  <QuestCard key={index} {...quest} />
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl text-[#E6C100] mb-4 flex items-center gap-2 font-jacquard">
              Weekly Quests
            </h2>
            <div className="space-y-4">
              {mockQuests
                .filter((quest) => quest.type === "weekly")
                .map((quest, index) => (
                  <QuestCard key={index} {...quest} />
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl text-[#E6C100] mb-4 flex items-center gap-2 font-jacquard">
              One-time Quests
            </h2>
            <div className="space-y-4">
              {mockQuests
                .filter((quest) => quest.type === "onetime")
                .map((quest, index) => (
                  <QuestCard key={index} {...quest} />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
