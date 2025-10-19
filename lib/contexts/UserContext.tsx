"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { userService } from "../services";
import { User } from "../supabase/models";
import { useSupabase } from "../supabase/SupabaseProvider";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUserData: (updates: Partial<User>) => Promise<User>;
  addXP: (xpAmount: number) => Promise<User | undefined>;
  addCoins: (coinAmount: number) => Promise<User | undefined>;
  completeQuest: (
    questType: "daily" | "weekly" | "onetime",
    xpReward: number,
    coinReward: number
  ) => Promise<User | undefined>;
  initializeUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
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

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 50) + 1;
  };

  const updateUserData = useCallback(
    async (updates: Partial<User>) => {
      if (!clerkUser) throw new Error("User not authenticated");

      try {
        if (updates.xp !== undefined) {
          updates.level = calculateLevel(updates.xp);
        }

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
    },
    [clerkUser, supabase]
  );

  const addXP = useCallback(
    async (xpAmount: number) => {
      if (!user) return;

      const newXP = user.xp + xpAmount;
      return updateUserData({
        xp: newXP,
      });
    },
    [user, updateUserData]
  );

  const addCoins = useCallback(
    async (coinAmount: number) => {
      if (!user) return;

      return updateUserData({
        coins: user.coins + coinAmount,
      });
    },
    [user, updateUserData]
  );

  const completeQuest = useCallback(
    async (
      questType: "daily" | "weekly" | "onetime",
      xpReward: number,
      coinReward: number
    ) => {
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

      return updateUserData(updates);
    },
    [user, updateUserData]
  );

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        updateUserData,
        addXP,
        addCoins,
        completeQuest,
        initializeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
}
