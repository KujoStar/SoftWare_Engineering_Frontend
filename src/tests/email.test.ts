import { test, expect } from "vitest";
import { EMAIL_REG } from "@data/constants";

test("check email", () => {
  expect(EMAIL_REG.test("arona@schale.org")).toBe(true);
  expect(EMAIL_REG.test("1@1")).toBe(false);
});
