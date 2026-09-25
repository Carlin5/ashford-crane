import { describe, expect, it } from "vitest";
import {
  CURRENCY_PRECISION,
  formatMoney,
  moneyAriaLabel,
  toMajor,
  toMinor,
  isCurrency,
} from "@/lib/money";

describe("CURRENCY_PRECISION", () => {
  it("uses zero decimal places for UGX", () => {
    expect(CURRENCY_PRECISION.UGX).toBe(0);
  });
  it("uses two decimal places for the others", () => {
    for (const c of ["USD", "EUR", "GBP", "KES", "AED"] as const) {
      expect(CURRENCY_PRECISION[c]).toBe(2);
    }
  });
});

describe("isCurrency", () => {
  it("accepts supported currencies", () => {
    expect(isCurrency("USD")).toBe(true);
    expect(isCurrency("UGX")).toBe(true);
  });
  it("rejects unsupported codes", () => {
    expect(isCurrency("BTC")).toBe(false);
  });
});

describe("toMajor / toMinor", () => {
  it("converts minor to major units", () => {
    expect(toMajor(12345, "USD")).toBe(123.45);
    expect(toMajor(12000, "UGX")).toBe(12000);
  });
  it("converts major to minor units", () => {
    expect(toMinor(123.45, "USD")).toBe(12345);
    expect(toMinor(12000, "UGX")).toBe(12000);
  });
  it("rounds half up without floating-point drift", () => {
    expect(toMinor(0.015, "USD")).toBe(2);
    expect(toMinor(19.99, "EUR")).toBe(1999);
  });
});

describe("formatMoney", () => {
  it("formats USD with two decimals", () => {
    expect(formatMoney(1234567, "USD", "en-US")).toBe("$12,345.67");
  });
  it("formats UGX with zero decimals", () => {
    const out = formatMoney(12000, "UGX", "en-US");
    expect(out).toMatch(/12,000/);
    expect(out).not.toMatch(/\.00/);
  });
  it("respects locale", () => {
    expect(formatMoney(100000, "EUR", "de-DE")).toContain("1.000,00");
  });
});

describe("moneyAriaLabel", () => {
  it("spells out the currency name for screen readers", () => {
    const label = moneyAriaLabel(1200000, "USD", "en-US");
    expect(label.toLowerCase()).toContain("us dollars");
    expect(label).toContain("12,000");
  });
});
