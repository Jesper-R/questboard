import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { userService } from "../services";

describe("user creation integration", () => {
  let supabase: SupabaseClient;
  let clerkUserId: string;

  beforeEach(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    supabase = createClient(supabaseUrl!, supabaseKey!);
    clerkUserId = `clerktesting_${Date.now()}`;
  });

  afterEach(async () => {
    const user = await userService.getUser(supabase, clerkUserId);
    if (user) {
      await supabase.from("users").delete().eq("id", user.id);
    }
  });

  test("creates supabase user when clerk user visits dashboard", async () => {
    const user = await userService.getOrCreateUser(supabase, clerkUserId, {
      username: "test",
      email: "test@test.com",
    });

    assert.ok(user);
    assert.strictEqual(user.username, "test");
    assert.strictEqual(user.clerk_user_id, clerkUserId);
  });
});
