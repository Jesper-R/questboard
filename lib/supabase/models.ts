export interface User {
  id: string;
  clerk_user_id: string;
  username: string | null;
  email: string | null;
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
