"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CreateQuestDialog from "@/components/CreateQuestDialog";
import QuestCard from "@/components/QuestCard";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
import { useQuests } from "@/lib/hooks/useQuests";
import { Quest } from "@/lib/supabase/models";
import StreakDisplay from "@/components/StreakDisplay";
import QuestActivityChart from "@/components/QuestActivityChart";
import QuestActivityLog from "@/components/QuestActivityLog";
import BadgeCarousel from "@/components/BadgeCarousel";

const DashboardPage = () => {
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showExpired, setShowExpired] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);
  const {
    dailyQuests: allDailyQuests,
    weeklyQuests: allWeeklyQuests,
    onetimeQuests: allOnetimeQuests,
    upcomingQuests,
    loading,
    createQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
  } = useQuests();

  const getFilteredQuests = (questList: Quest[]) => {
    return questList.filter((quest) => {
      if (quest.scheduled_for && !showScheduled) return false;
      if (quest.is_expired && !showExpired) return false;
      if (quest.is_completed && !showCompleted) return false;
      if (!quest.is_expired && !quest.is_completed && !quest.scheduled_for)
        return true;
      return (
        (quest.is_expired && showExpired) ||
        (quest.is_completed && showCompleted) ||
        (quest.scheduled_for && showScheduled)
      );
    });
  };

  const dailyQuests = getFilteredQuests(allDailyQuests);
  const weeklyQuests = getFilteredQuests(allWeeklyQuests);
  const onetimeQuests = getFilteredQuests(allOnetimeQuests);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151515]">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151515]">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-start mb-6 gap-2">
          <CreateQuestDialog createQuest={createQuest}>
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

          <Button
            variant="outline"
            onClick={() => setShowExpired(!showExpired)}
            className="text-gray-400 hover:text-[#E6C100]"
          >
            {showExpired ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Expired
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Expired
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-gray-400 hover:text-[#E6C100]"
          >
            {showCompleted ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Completed
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Completed
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowScheduled(!showScheduled)}
            className="text-gray-400 hover:text-[#E6C100]"
          >
            {showScheduled ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Scheduled
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Scheduled
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
              {upcomingQuests.length > 0
                ? upcomingQuests.map((quest) => (
                    <div key={quest.id} className="min-w-80 flex-shrink-0">
                      <QuestCard
                        quest={{
                          ...quest,
                          description:
                            quest.description.length > 60
                              ? quest.description.substring(0, 60) + "..."
                              : quest.description,
                        }}
                        updateQuest={updateQuest}
                        deleteQuest={deleteQuest}
                        completeQuest={completeQuest}
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h2 className="text-3xl text-[#E6C100] mb-4 flex items-center justify-between">
              <span className="font-jacquard">Daily Quests</span>
              <StreakDisplay type="daily" />
            </h2>
            <div className="space-y-4">
              {dailyQuests.length > 0
                ? dailyQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      updateQuest={updateQuest}
                      deleteQuest={deleteQuest}
                      completeQuest={completeQuest}
                    />
                  ))
                : null}
            </div>
          </div>

          <div>
            <h2 className="text-3xl text-[#E6C100] mb-4 flex items-center justify-between">
              <span className="font-jacquard">Weekly Quests</span>
              <StreakDisplay type="weekly" />
            </h2>
            <div className="space-y-4">
              {weeklyQuests.length > 0
                ? weeklyQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      updateQuest={updateQuest}
                      deleteQuest={deleteQuest}
                      completeQuest={completeQuest}
                    />
                  ))
                : null}
            </div>
          </div>

          <div>
            <h2 className="text-3xl text-[#E6C100] mb-4 flex items-center justify-between">
              <span className="font-jacquard">One-time Quests</span>
              <StreakDisplay type="onetime" />
            </h2>
            <div className="space-y-4">
              {onetimeQuests.length > 0
                ? onetimeQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      updateQuest={updateQuest}
                      deleteQuest={deleteQuest}
                      completeQuest={completeQuest}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>

        <div className="my-8">
          <h2 className="text-3xl font-jacquard text-[#E6C100] mb-4">
            Quest Activity (Last 7 Days)
          </h2>
          <QuestActivityChart />
        </div>

        <div className="my-8">
          <h2 className="text-3xl text-[#E6C100] mb-4 font-jacquard">Badges</h2>
          <BadgeCarousel />
        </div>

        <QuestActivityLog limit={50} />
      </main>
    </div>
  );
};

export default DashboardPage;
