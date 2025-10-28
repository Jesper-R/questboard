import { test, describe } from "node:test";
import assert from "node:assert";
import { DateUtils, getLocalDateString } from "../services";

describe("date utils", () => {
  test("formats date as YYYY-MM-DD", () => {
    const result = getLocalDateString(new Date("2025-10-20T12:30:32Z"));
    assert.strictEqual(result, "2025-10-20");
  });

  test("pads single digits", () => {
    const result = getLocalDateString(new Date("2025-1-1"));
    assert.strictEqual(result, "2025-01-01");
  });

  test("adds days correctly", () => {
    const result = DateUtils.addDays(new Date("2025-10-01"), 3);
    assert.strictEqual(result.getDate(), 4);
  });

  test("handles month overflow", () => {
    const result = DateUtils.addDays(new Date("2025-10-31"), 5);
    assert.strictEqual(result.getMonth(), 10);
    assert.strictEqual(result.getDate(), 5);
  });

  test("subtracts days", () => {
    const result = DateUtils.addDays(new Date("2025-10-15"), -5);
    assert.strictEqual(result.getDate(), 10);
  });

  test("gets yesterday", () => {
    const result = DateUtils.yesterday();
    const today = new Date();
    const expectedDate = today.getDate() - 1;
    assert.strictEqual(result.getDate(), expectedDate);
  });

  test("monday is index 0", () => {
    const result = DateUtils.getWeekDayIndex(new Date("2025-10-20"));
    assert.strictEqual(result, 0);
  });

  test("sunday is index 6", () => {
    const result = DateUtils.getWeekDayIndex(new Date("2025-10-19"));
    assert.strictEqual(result, 6);
  });

  test("monday-monday is 7 days", () => {
    assert.strictEqual(DateUtils.daysUntilNextMonday(0), 7);
  });

  test("sunday-monday is 1 day", () => {
    assert.strictEqual(DateUtils.daysUntilNextMonday(6), 1);
  });
});
