"use client";

import { useUser } from "@clerk/nextjs";
import { userService } from "../services";
import { useEffect, useState, useCallback } from "react";
import { User } from "../supabase/models";
import { useSupabase } from "../supabase/SupabaseProvider";

export function useUserData() {
  const { user: clerkUser } = useUser();
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeUser = useCallback(async () => {
    if (!clerkUser) return;

    try {
      setLoading(true);
      setError(null);

      const userData = await userService.getOrCreateUser(
        supabase!,
        clerkUser.id,
        {
          username: clerkUser.username || clerkUser.firstName || undefined,
          email: clerkUser.primaryEmailAddress?.emailAddress,
        }
      );

      setUser(userData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize user."
      );
    } finally {
      setLoading(false);
    }
  }, [clerkUser, supabase]);

  useEffect(() => {
    if (clerkUser && supabase) {
      initializeUser();
    }
  }, [clerkUser, supabase, initializeUser]);

  async function updateUserData(updates: Partial<User>) {
    if (!clerkUser) throw new Error("User not authenticated");

    try {
      const updatedUser = await userService.updateUser(
        supabase!,
        clerkUser.id,
        updates
      );
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
      throw err;
    }
  }

  async function addXP(xpAmount: number) {
    if (!user) return;

    const newXP = user.xp + xpAmount;
    // const newLevel = Math.floor(newXP / 1000) + 1;

    return updateUserData({
      xp: newXP,
      //level: Math.max(newLevel, user.level),
    });
  }

  async function addCoins(coinAmount: number) {
    if (!user) return;

    return updateUserData({
      coins: user.coins + coinAmount,
    });
  }

  async function completeQuest(
    questType: "daily" | "weekly" | "onetime",
    xpReward: number,
    coinReward: number
  ) {
    if (!user) return;

    const updates: Partial<User> = {
      quests_completed: user.quests_completed + 1,
      xp: user.xp + xpReward,
      coins: user.coins + coinReward,
    };

    switch (questType) {
      case "daily":
        updates.daily_quests_completed = user.daily_quests_completed + 1;
        break;
      case "weekly":
        updates.weekly_quests_completed = user.weekly_quests_completed + 1;
        break;
      case "onetime":
        updates.onetime_quests_completed = user.onetime_quests_completed + 1;
        break;
    }

    const newXP = user.xp + xpReward;
    updates.xp = newXP;
    // const newLevel = Math.floor(newXP / 1000) + 1;
    // if (newLevel > user.level) {
    //   updates.level = newLevel;
    // }

    return updateUserData(updates);
  }

  return {
    user,
    loading,
    error,
    updateUserData,
    addXP,
    addCoins,
    completeQuest,
    initializeUser,
  };
}
