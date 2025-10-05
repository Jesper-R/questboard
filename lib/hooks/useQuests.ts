"use client";

import { useUser } from "@clerk/nextjs";
import { questService, userService } from "../services";
import { useEffect, useState, useCallback, useRef } from "react";
import { Quest, QuestInsert } from "../supabase/models";
import { useSupabase } from "../supabase/SupabaseProvider";
import { useUserData } from "./useUserData";

export function useQuests() {
  const { user: clerkUser } = useUser();
  const { supabase } = useSupabase();
  const { user: userData } = useUserData();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const loadQuests = useCallback(async () => {
    if (!userData || !supabase) {
      return;
    }

    if (hasLoadedRef.current) {
      return;
    }

    try {
      setError(null);
      await questService.refreshRecurringQuests(supabase, userData.id);
      await questService.checkAndExpireQuests(supabase, userData.id);
      const data = await questService.getQuests(supabase, userData.id);
      setQuests(data);
      hasLoadedRef.current = true;
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quests.");
      setLoading(false);
    }
  }, [userData, supabase]);

  useEffect(() => {
    if (!hasLoadedRef.current && userData && supabase) {
      loadQuests();
    }
  }, [loadQuests, userData, supabase]);

  async function createQuest(questData: Omit<QuestInsert, "user_id">) {
    if (!userData || !supabase) throw new Error("User not authenticated");

    try {
      const newQuest = await questService.createQuest(supabase, {
        ...questData,
        user_id: userData.id,
      });
      setQuests((prev) => [newQuest, ...prev]);
      return newQuest;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quest.");
      throw err;
    }
  }

  async function updateQuest(questId: string, updates: Partial<Quest>) {
    if (!supabase) throw new Error("Database not available");

    try {
      const updatedQuest = await questService.updateQuest(
        supabase,
        questId,
        updates
      );
      setQuests((prev) =>
        prev.map((quest) => (quest.id === questId ? updatedQuest : quest))
      );
      return updatedQuest;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quest.");
      throw err;
    }
  }

  async function completeQuest(questId: string) {
    if (!supabase || !clerkUser) throw new Error("User not authenticated");

    try {
      const completedQuest = await questService.completeQuest(
        supabase,
        questId
      );

      const freshUserData = await userService.getUser(supabase, clerkUser.id);
      if (!freshUserData) throw new Error("User data not found");

      await userService.updateUser(supabase, clerkUser.id, {
        xp: freshUserData.xp + completedQuest.xp_reward,
        coins: freshUserData.coins + completedQuest.coin_reward,
        quests_completed: freshUserData.quests_completed + 1,
        [`${completedQuest.type}_quests_completed`]:
          freshUserData[`${completedQuest.type}_quests_completed`] + 1,
      });

      setQuests((prev) =>
        prev.map((quest) => (quest.id === questId ? completedQuest : quest))
      );

      return completedQuest;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete quest."
      );
      throw err;
    }
  }

  async function deleteQuest(questId: string) {
    if (!supabase) throw new Error("Database not available");

    try {
      await questService.deleteQuest(supabase, questId);
      setQuests((prev) => prev.filter((quest) => quest.id !== questId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quest.");
      throw err;
    }
  }

  const sortByUrgencyAndDueTime = (a: Quest, b: Quest) => {
    const aUrgency = questService.getQuestUrgency(a);
    const bUrgency = questService.getQuestUrgency(b);

    const aLevel = aUrgency.level ?? Infinity;
    const bLevel = bUrgency.level ?? Infinity;
    if (aLevel !== bLevel) {
      return aLevel - bLevel;
    }

    if (a.type === "daily" && b.type === "daily") {
      return a.due_time!.localeCompare(b.due_time!);
    }

    if (a.type === "weekly" && b.type === "weekly") {
      const dayOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const aDay = dayOrder.indexOf(a.due_day!);
      const bDay = dayOrder.indexOf(b.due_day!);
      return aDay - bDay;
    }

    if (a.type === "onetime" && b.type === "onetime") {
      return new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime();
    }

    return 0;
  };

  const dailyQuests = quests
    .filter((quest) => quest.type === "daily")
    .sort(sortByUrgencyAndDueTime);
  const weeklyQuests = quests
    .filter((quest) => quest.type === "weekly")
    .sort(sortByUrgencyAndDueTime);
  const onetimeQuests = quests
    .filter((quest) => quest.type === "onetime")
    .sort(sortByUrgencyAndDueTime);

  const sortByTimeLeft = (a: Quest, b: Quest) => {
    const aUrgency = questService.getQuestUrgency(a);
    const bUrgency = questService.getQuestUrgency(b);
    return aUrgency.timeLeft - bUrgency.timeLeft;
  };

  const upcomingQuests = quests
    .filter((quest) => !quest.is_completed && !quest.is_expired)
    .sort(sortByTimeLeft)
    .slice(0, 5);

  return {
    quests,
    dailyQuests,
    weeklyQuests,
    onetimeQuests,
    upcomingQuests,
    loading,
    error,
    createQuest,
    updateQuest,
    completeQuest,
    deleteQuest,
    loadQuests,
  };
}
