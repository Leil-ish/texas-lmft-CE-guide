import { describe, expect, it } from "vitest";
import { getCheckerResult, getRequirementResult } from "./logic";

describe("getRequirementResult", () => {
  it("returns the associate path with no renewal CE requirement", () => {
    const result = getRequirementResult({
      licenseType: "associate",
      renewingLicense: false,
      maintainsSupervisorStatus: false,
      providesTelehealth: false
    });

    expect(result.headline).toContain("no renewal CE requirement applies");
    expect(result.checklist[0]).toContain("No renewal CE requirement applies");
  });

  it("returns the base LMFT renewal requirements", () => {
    const result = getRequirementResult({
      licenseType: "lmft",
      renewingLicense: true,
      maintainsSupervisorStatus: false,
      providesTelehealth: false
    });

    expect(result.checklist).toContain(
      "Obtain at least 30 total clock hours during the renewal period."
    );
    expect(result.checklist.join(" ")).toContain("6 hours in ethics");
    expect(result.checklist.join(" ")).toContain("distinct population");
  });

  it("adds supervisor and telehealth conditions without implying extra total hours", () => {
    const result = getRequirementResult({
      licenseType: "lmft",
      renewingLicense: true,
      maintainsSupervisorStatus: true,
      providesTelehealth: true
    });

    expect(result.checklist.join(" ")).toContain("6 hours in supervision");
    expect(result.checklist.join(" ")).toContain("2 hours in technology-assisted services");
    expect(result.checklist.join(" ")).toContain("may count toward the total");
  });
});

describe("getCheckerResult", () => {
  it("returns likely for a matching ethics activity from a listed provider", () => {
    const result = getCheckerResult({
      activityType: "live-course",
      topicArea: "ethics",
      providerType: "professional-association",
      intent: "ethics"
    });

    expect(result.status).toBe("likely");
    expect(result.headline).toContain("Likely counts");
  });

  it("returns verify for distinct population guidance", () => {
    const result = getCheckerResult({
      activityType: "conference",
      topicArea: "distinct-population",
      providerType: "professional-association",
      intent: "distinct-population"
    });

    expect(result.status).toBe("verify");
  });

  it("returns verify rather than yes for an independent provider", () => {
    const result = getCheckerResult({
      activityType: "on-demand-course",
      topicArea: "general-mft-practice",
      providerType: "independent-provider",
      intent: "general"
    });

    expect(result.status).toBe("verify");
    expect(result.headline).not.toContain("will count");
  });

  it("returns unclear when user cannot classify the provider", () => {
    const result = getCheckerResult({
      activityType: "other",
      topicArea: "mixed-or-unclear",
      providerType: "unknown",
      intent: "general"
    });

    expect(result.status).toBe("unclear");
  });
});
