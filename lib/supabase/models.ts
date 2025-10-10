export interface User {
  id: string;
  clerk_user_id: string;
  username: string | null;
  email: string | null;
  avatar_path: string | null;
  user_title: string;
  level: number;
  xp: number;
  coins: number;
  login_streak: number;
  quest_streak: number;
  last_login_date: string | null;
  quests_completed: number;
  daily_quests_completed: number;
  weekly_quests_completed: number;
  onetime_quests_completed: number;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  clerk_user_id: string;
  username?: string;
  email?: string;
  avatar_path?: string;
  user_title?: string;
  level?: number;
  xp?: number;
  coins?: number;
  login_streak?: number;
  quest_streak?: number;
  last_login_date?: string;
  quests_completed?: number;
  daily_quests_completed?: number;
  weekly_quests_completed?: number;
  onetime_quests_completed?: number;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "onetime";
  difficulty: "easy" | "medium" | "hard" | "epic";
  is_completed: boolean;
  is_expired: boolean;
  due_time?: string;
  due_day?: string;
  due_date?: string;
  scheduled_for?: string;
  xp_reward: number;
  coin_reward: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestInsert {
  user_id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "onetime";
  difficulty: "easy" | "medium" | "hard" | "epic";
  is_completed?: boolean;
  is_expired?: boolean;
  due_time?: string;
  due_day?: string;
  due_date?: string;
  scheduled_for?: string;
  xp_reward?: number;
  coin_reward?: number;
}

export interface QuestLog {
  id: string;
  user_id: string;
  quest_id: string;
  quest_type: "daily" | "weekly" | "onetime";
  xp_earned: number;
  coins_earned: number;
  completed_at: string;
  created_at: string;
}
