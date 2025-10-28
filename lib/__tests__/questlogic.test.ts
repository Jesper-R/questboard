import { test, describe } from "node:test";
import assert from "node:assert";
import { questService, DateUtils } from "../services";
import type { Quest } from "../supabase/models";

describe("quest logic", () => {
  test("daily quest expired when past due time", () => {
    DateUtils.now = () => new Date("2025-10-20T15:00:00");
    const result = questService.isQuestExpired({
      type: "daily",
      due_time: "14:00",
    });
    assert.strictEqual(result, true);
  });

  test("daily quest not expired before due time", () => {
    DateUtils.now = () => new Date("2025-10-20T15:00:00");
    const result = questService.isQuestExpired({
      type: "daily",
      due_time: "16:00",
    });
    assert.strictEqual(result, false);
  });

  test("weekly quest expired after due day", () => {
    DateUtils.now = () => new Date("2025-10-21");
    const result = questService.isQuestExpired({
      type: "weekly",
      due_day: "monday",
    });
    assert.strictEqual(result, true);
  });

  test("weekly quest not expired before due day", () => {
    DateUtils.now = () => new Date("2025-10-20");
    const result = questService.isQuestExpired({
      type: "weekly",
      due_day: "friday",
    });
    assert.strictEqual(result, false);
  });

  test("onetime quest expired after due date", () => {
    DateUtils.now = () => new Date("2025-10-25");
    const result = questService.isQuestExpired({
      type: "onetime",
      due_date: "2025-10-20T23:59:59.999Z",
    });
    assert.strictEqual(result, true);
  });

  test("onetime quest not expired before due date", () => {
    DateUtils.now = () => new Date("2025-10-19");
    const result = questService.isQuestExpired({
      type: "onetime",
      due_date: "2025-10-20T23:59:59.999Z",
    });
    assert.strictEqual(result, false);
  });

  test("completed quest has no urgency", () => {
    const result = questService.getQuestUrgency({
      is_completed: true,
      is_expired: false,
      type: "daily",
    } as Quest);
    assert.strictEqual(result.level, null);
  });

  test("expired quest has no urgency", () => {
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: true,
      type: "daily",
    } as Quest);
    assert.strictEqual(result.level, null);
  });

  test("scheduled quest has no urgency", () => {
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      scheduled_for: "2025-10-20",
      type: "daily",
    } as Quest);
    assert.strictEqual(result.level, null);
  });

  test("daily quest urgent when less than 1 hour left", () => {
    DateUtils.now = () => new Date("2025-10-20T13:30:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "daily",
      due_time: "14:00",
    } as Quest);
    assert.strictEqual(result.label, "<1h left");
  });

  test("daily quest urgent when less than 6 hours left", () => {
    DateUtils.now = () => new Date("2025-10-20T10:00:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "daily",
      due_time: "14:00",
    } as Quest);
    assert.strictEqual(result.label, "<6h left");
  });

  test("daily quest not urgent when more than 6 hours left", () => {
    DateUtils.now = () => new Date("2025-10-20T07:00:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "daily",
      due_time: "14:00",
    } as Quest);
    assert.strictEqual(result.level, null);
  });

  test("weekly quest urgent when due today", () => {
    DateUtils.now = () => new Date("2025-10-24T10:00:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "weekly",
      due_day: "friday",
    } as Quest);
    assert.strictEqual(result.label, "Today");
  });

  test("weekly quest urgent when due tomorrow", () => {
    DateUtils.now = () => new Date("2025-10-23T10:00:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "weekly",
      due_day: "friday",
    } as Quest);
    assert.strictEqual(result.label, "Tomorrow");
  });

  test("onetime quest urgent when due today", () => {
    DateUtils.now = () => new Date("2025-10-20T10:00:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "onetime",
      due_date: "2025-10-20T23:59:59.999Z",
    } as Quest);
    assert.strictEqual(result.label, "Today");
  });

  test("onetime quest urgent within 7 days", () => {
    DateUtils.now = () => new Date("2025-10-20T10:00:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "onetime",
      due_date: "2025-10-25T23:59:59.999Z",
    } as Quest);
    assert.strictEqual(result.label, "<7 days");
  });

  test("onetime quest urgent within 30 days", () => {
    DateUtils.now = () => new Date("2025-10-20T10:00:00");
    const result = questService.getQuestUrgency({
      is_completed: false,
      is_expired: false,
      type: "onetime",
      due_date: "2025-11-10T23:59:59.999Z",
    } as Quest);
    assert.strictEqual(result.label, "<30 days");
  });
});
