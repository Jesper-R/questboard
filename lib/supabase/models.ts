export interface User {
  id: string;
  clerk_user_id: string;
  username: string | null;
  email: string | null;
  avatar_path: string | null;
  border_path: string | null;
  user_title: string;
  level: number;
  xp: number;
  coins: number;
  login_streak: number;
  daily_streak: number;
  weekly_streak: number;
  onetime_streak: number;
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
  daily_streak?: number;
  weekly_streak?: number;
  onetime_streak?: number;
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
  quest_title: string;
  quest_type: "daily" | "weekly" | "onetime";
  action: "created" | "completed" | "deleted" | "expired" | "edited";
  action_at: string;
  xp_earned: number | null;
  coins_earned: number | null;
  created_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  type: "title" | "border" | "avatar";
  cost: number;
  description?: string;
  data: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  created_at: string;
}

export interface UserInventory {
  id: string;
  user_id: string;
  item_id: string;
  is_equipped: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon_path: string;
  requirement: string;
  requirement_type:
    | "quests_completed"
    | "daily_quests_completed"
    | "weekly_quests_completed"
    | "onetime_quests_completed"
    | "daily_streak"
    | "weekly_streak"
    | "onetime_streak"
    | "level"
    | "xp"
    | "coins";
  requirement_value: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}
