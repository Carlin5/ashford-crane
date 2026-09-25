import { describe, expect, it } from "vitest";
import {
  PENDING,
  positioningStatement,
  partnerDisclosure,
} from "@/lib/compliance";

describe("compliance guardrails", () => {
  it("PENDING uses the exact mandated wording", () => {
    expect(PENDING).toBe("Information pending regulatory confirmation");
  });
  it("positioning statement keeps all bracketed placeholders by default", () => {
    const s = positioningStatement();
    expect(s).toContain("[legal entity name — pending]");
    expect(s).toContain("[Partner name — pending]");
    expect(s).toContain("[Regulator — pending]");
    expect(s).toContain("does not hold client funds directly");
  });
  it("partner disclosure follows the Section 28 template", () => {
    const s = partnerDisclosure({ service: "Card issuing" });
    expect(s).toMatch(/^Card issuing is provided by /);
    expect(s).toContain("[pending]");
  });
});
