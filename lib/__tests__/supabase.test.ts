import { test, describe } from "node:test";
import assert from "node:assert";

describe("supabase health", () => {
  test("supabase reachable", async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      assert.fail("NEXT_PUBLIC_SUPABASE_URL not set");
    }

    try {
      await fetch(supabaseUrl);
      assert.ok("supabase is reachable");
    } catch {
      assert.fail("supabase is not reachable");
    }
  });
});
