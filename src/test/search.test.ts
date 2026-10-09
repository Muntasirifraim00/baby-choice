import { describe, expect, it } from "vitest";
import { search } from "@/lib/search";

describe("Smart search relevance", () => {
  it.each(["shampoo", "শ্যাম্পু"])("keeps %s to seven named shampoos", (q) => {
    expect(search(q).results).toHaveLength(7);
    expect(search(q).results.every((p) => /shampoo/i.test(p.name))).toBe(true);
  });
  it.each([["diap", 7], ["pampers", 1], ["bottle", 6], ["aptamil", 1], ["ডায়াপার", 7], ["teether", 0]] as const)("preserves %s results", (q, count) => {
    expect(search(q).results).toHaveLength(count);
  });
  it("preserves correction, leading brand and diaper bag", () => {
    expect(search("ডায়াপার").corrected).toBe("diaper");
    expect(search("aptamill").results[0]?.brand).toBe("Aptamil");
    expect(search("diap").results[0]?.brand).toBe("Pampers");
    expect(search("diap").results.some((p) => p.slug === "baby-diaper-bag")).toBe(true);
  });
});