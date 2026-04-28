import { formatRub } from "@/lib/format";

describe("formatRub", () => {
  it("formats rubles", () => {
    expect(formatRub("1000")).toContain("1");
  });
});
