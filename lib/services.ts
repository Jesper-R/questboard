import { User, UserInsert, Quest, QuestInsert } from "./supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export const userService = {
  async getUser(
    supabase: SupabaseClient,
    clerkUserId: string
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async createUser(supabase: SupabaseClient, user: UserInsert): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        clerk_user_id: user.clerk_user_id,
        username: user.username || null,
        email: user.email || null,
        avatar_path: user.avatar_path || "/avatars/default.png",
        user_title: user.user_title || "Adventurer",
        level: user.level || 1,
        xp: user.xp || 0,
        coins: user.coins || 100,
        login_streak: user.login_streak || 0,
        quest_streak: user.quest_streak || 0,
        last_login_date: user.last_login_date || new Date().toISOString(),
        quests_completed: user.quests_completed || 0,
        daily_quests_completed: user.daily_quests_completed || 0,
        weekly_quests_completed: user.weekly_quests_completed || 0,
        onetime_quests_completed: user.onetime_quests_completed || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateUser(
    supabase: SupabaseClient,
    clerkUserId: string,
    updates: Partial<User>
  ): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_user_id", clerkUserId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLoginStreak(
    supabase: SupabaseClient,
    clerkUserId: string
  ): Promise<User> {
    const user = await this.getUser(supabase, clerkUserId);
    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split("T")[0];
    const lastLogin = user.last_login_date?.split("T")[0];

    let newStreak = user.login_streak;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastLogin === yesterdayStr) {
        newStreak = user.login_streak + 1;
      } else {
        newStreak = 1;
      }

      return this.updateUser(supabase, clerkUserId, {
        login_streak: newStreak,
        last_login_date: new Date().toISOString(),
      });
    }

    return user;
  },

  async getOrCreateUser(
    supabase: SupabaseClient,
    clerkUserId: string,
    userInfo?: {
      username?: string;
      email?: string;
    }
  ): Promise<User> {
    let user = await this.getUser(supabase, clerkUserId);

    if (!user) {
      try {
        user = await this.createUser(supabase, {
          clerk_user_id: clerkUserId,
          username: userInfo?.username,
          email: userInfo?.email,
        });
      } catch {
        user = await this.getUser(supabase, clerkUserId);
        if (!user) throw new Error("Failed to get or create user");
      }
    } else {
      user = await this.updateLoginStreak(supabase, clerkUserId);
    }

    return user;
  },
};

const difficultyRewards: Record<string, { xp: number; coins: number }> = {
  easy: { xp: 10, coins: 5 },
  medium: { xp: 25, coins: 10 },
  hard: { xp: 50, coins: 20 },
  epic: { xp: 100, coins: 50 },
};

export type QuestUrgency = {
  level: 1 | 2 | 3 | null;
  label: string;
  timeLeft: number;
};

function getWeekDayIndex(date: Date): number {
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

export const questService = {
  getQuestUrgency(quest: Quest): QuestUrgency {
    if (quest.is_completed || quest.is_expired) {
      return { level: null, label: "", timeLeft: Infinity };
    }

    const now = new Date();

    switch (quest.type) {
      case "daily":
        if (quest.due_time) {
          const [hours, minutes] = quest.due_time.split(":").map(Number);
          const dueDateTime = new Date();
          dueDateTime.setHours(hours, minutes, 0, 0);

          const msLeft = dueDateTime.getTime() - now.getTime();
          const hoursLeft = msLeft / (1000 * 60 * 60);

          if (hoursLeft < 1) {
            return {
              level: 1,
              label: "<1h left",
              timeLeft: msLeft,
            };
          } else if (hoursLeft < 6) {
            return {
              level: 2,
              label: "Due Soon",
              timeLeft: msLeft,
            };
          }

          return { level: null, label: "", timeLeft: msLeft };
        }
        break;

      case "weekly":
        if (quest.due_day) {
          const questDayIndex = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].indexOf(quest.due_day);

          const currentDayIndex = getWeekDayIndex(now);
          const daysLeft = questDayIndex - currentDayIndex;
          const dueDay = new Date(now);
          dueDay.setDate(now.getDate() + daysLeft);
          dueDay.setHours(23, 59, 59, 999);
          const timeLeft = dueDay.getTime() - now.getTime();

          if (daysLeft <= 1) {
            return {
              level: 1,
              label: "Due Today",
              timeLeft,
            };
          } else if (daysLeft <= 3) {
            return {
              level: 2,
              label: "Due Soon",
              timeLeft,
            };
          }

          return { level: null, label: "", timeLeft };
        }
        break;

      case "onetime":
        if (quest.due_date) {
          const dueDate = new Date(quest.due_date);
          const msLeft = dueDate.getTime() - now.getTime();
          const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

          if (daysLeft <= 1) {
            return {
              level: 1,
              label: "Due Today",
              timeLeft: msLeft,
            };
          } else if (daysLeft <= 7) {
            return {
              level: 2,
              label: "Due Soon",
              timeLeft: msLeft,
            };
          } else if (daysLeft <= 30) {
            return {
              level: 3,
              label: "This month",
              timeLeft: msLeft,
            };
          }

          return { level: null, label: "", timeLeft: msLeft };
        }
        break;
    }

    return { level: null, label: "", timeLeft: Infinity };
  },

  isQuestExpired(quest: Partial<Quest>): boolean {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDayIndex = getWeekDayIndex(now);

    switch (quest.type) {
      case "daily":
        if (quest.due_time && currentTime > quest.due_time) {
          return true;
        }
        break;

      case "weekly":
        if (quest.due_day) {
          const questDayIndex = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].indexOf(quest.due_day);
          console.log(currentDayIndex);
          console.log(questDayIndex);
          if (currentDayIndex > questDayIndex) {
            return true;
          }
        }
        break;

      case "onetime":
        if (quest.due_date) {
          const dueDate = new Date(quest.due_date);
          if (now > dueDate) {
            return true;
          }
        }
        break;
    }

    return false;
  },

  async getQuests(supabase: SupabaseClient, userId: string): Promise<Quest[]> {
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async createQuest(
    supabase: SupabaseClient,
    quest: QuestInsert
  ): Promise<Quest> {
    const rewards = difficultyRewards[quest.difficulty];

    const isExpired = this.isQuestExpired({
      type: quest.type,
      due_time: quest.due_time,
      due_day: quest.due_day,
      due_date: quest.due_date,
    });

    const { data, error } = await supabase
      .from("quests")
      .insert({
        user_id: quest.user_id,
        title: quest.title,
        description: quest.description,
        type: quest.type,
        difficulty: quest.difficulty,
        is_completed: quest.is_completed || false,
        is_expired: quest.is_expired || isExpired,
        due_time: quest.due_time || null,
        due_day: quest.due_day || null,
        due_date: quest.due_date || null,
        xp_reward: quest.xp_reward || rewards.xp,
        coin_reward: quest.coin_reward || rewards.coins,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateQuest(
    supabase: SupabaseClient,
    questId: string,
    updates: Partial<Quest>
  ): Promise<Quest> {
    const baseUpdateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    let updateData = baseUpdateData;

    if (
      updates.type ||
      updates.due_time !== undefined ||
      updates.due_day !== undefined ||
      updates.due_date !== undefined
    ) {
      const { data: currentQuest, error: fetchError } = await supabase
        .from("quests")
        .select("*")
        .eq("id", questId)
        .single();

      if (fetchError) throw fetchError;

      const questToCheck = {
        type: updates.type || currentQuest.type,
        due_time:
          updates.due_time !== undefined
            ? updates.due_time
            : currentQuest.due_time,
        due_day:
          updates.due_day !== undefined
            ? updates.due_day
            : currentQuest.due_day,
        due_date:
          updates.due_date !== undefined
            ? updates.due_date
            : currentQuest.due_date,
      };

      const isExpired = this.isQuestExpired(questToCheck);

      if (!currentQuest.is_completed) {
        updateData = {
          ...baseUpdateData,
          is_expired: isExpired,
        };
      }
    }

    const { data, error } = await supabase
      .from("quests")
      .update(updateData)
      .eq("id", questId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeQuest(
    supabase: SupabaseClient,
    questId: string
  ): Promise<Quest> {
    const { data: quest, error: fetchError } = await supabase
      .from("quests")
      .select("*")
      .eq("id", questId)
      .single();

    if (fetchError) throw fetchError;

    if (quest.is_completed) {
      throw new Error("Quest is already completed");
    }

    if (quest.is_expired) {
      throw new Error("Cannot complete expired quest");
    }

    const isCurrentlyExpired = this.isQuestExpired({
      type: quest.type,
      due_time: quest.due_time,
      due_day: quest.due_day,
      due_date: quest.due_date,
    });

    if (isCurrentlyExpired) {
      throw new Error("Quest has expired and cannot be completed");
    }

    const rewards = difficultyRewards[quest.difficulty];

    const { data, error } = await supabase
      .from("quests")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        xp_reward: rewards.xp,
        coin_reward: rewards.coins,
      })
      .eq("id", questId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteQuest(supabase: SupabaseClient, questId: string): Promise<void> {
    const { error } = await supabase.from("quests").delete().eq("id", questId);

    if (error) throw error;
  },

  async getQuestsByType(
    supabase: SupabaseClient,
    userId: string,
    type: "daily" | "weekly" | "onetime"
  ): Promise<Quest[]> {
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", userId)
      .eq("type", type)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async checkAndExpireQuests(
    supabase: SupabaseClient,
    userId: string
  ): Promise<void> {
    const { data: quests, error: fetchError } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", userId)
      .eq("is_completed", false)
      .eq("is_expired", false);

    if (fetchError) throw fetchError;
    if (!quests) return;

    const expiredQuestIds: string[] = [];

    for (const quest of quests) {
      if (this.isQuestExpired(quest)) {
        expiredQuestIds.push(quest.id);
      }
    }

    if (expiredQuestIds.length > 0) {
      const { error: updateError } = await supabase
        .from("quests")
        .update({
          is_expired: true,
          updated_at: new Date().toISOString(),
        })
        .in("id", expiredQuestIds);

      if (updateError) throw updateError;
    }
  },

  async refreshRecurringQuests(
    supabase: SupabaseClient,
    userId: string
  ): Promise<void> {
    const now = new Date();
    const currentDateStr = now.toISOString().split("T")[0];

    const { data: quests, error: fetchError } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", userId)
      .in("type", ["daily", "weekly"])
      .or("is_completed.eq.true,is_expired.eq.true");

    if (fetchError) throw fetchError;
    if (!quests) return;

    const questsToRefresh: string[] = [];

    for (const quest of quests) {
      let shouldRefresh = false;

      if (quest.type === "daily") {
        if (quest.completed_at || quest.updated_at) {
          const lastActionDate = quest.completed_at || quest.updated_at;
          const lastActionDateStr = new Date(lastActionDate)
            .toISOString()
            .split("T")[0];

          if (lastActionDateStr < currentDateStr) {
            shouldRefresh = true;
          }
        }
      } else if (quest.type === "weekly") {
        if (quest.completed_at || quest.updated_at) {
          const lastActionDate = new Date(
            quest.completed_at || quest.updated_at
          );

          const currentWeekStart = new Date(now);
          currentWeekStart.setDate(now.getDate() - getWeekDayIndex(now));
          currentWeekStart.setHours(0, 0, 0, 0);

          const lastActionWeekStart = new Date(lastActionDate);
          lastActionWeekStart.setDate(
            lastActionDate.getDate() - getWeekDayIndex(lastActionDate)
          );
          lastActionWeekStart.setHours(0, 0, 0, 0);

          if (currentWeekStart.getTime() > lastActionWeekStart.getTime()) {
            shouldRefresh = true;
          }
        }
      }

      if (shouldRefresh) {
        questsToRefresh.push(quest.id);
      }
    }

    if (questsToRefresh.length > 0) {
      const { error: updateError } = await supabase
        .from("quests")
        .update({
          is_completed: false,
          is_expired: false,
          completed_at: null,
          updated_at: new Date().toISOString(),
        })
        .in("id", questsToRefresh);

      if (updateError) throw updateError;
    }
  },
};
