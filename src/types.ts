export type LicenseType = "associate" | "lmft";

export type RequirementFormState = {
  licenseType: LicenseType;
  renewingLicense: boolean;
  maintainsSupervisorStatus: boolean;
  providesTelehealth: boolean;
};

export type RequirementResult = {
  headline: string;
  summary: string;
  requirementLevel: "info" | "action";
  checklist: string[];
  notes: string[];
  edgeCasePrompt: string;
};

export type CheckerIntent =
  | "general"
  | "ethics"
  | "distinct-population"
  | "supervision"
  | "telehealth";

export type CheckerActivityType =
  | "live-course"
  | "on-demand-course"
  | "conference"
  | "self-study"
  | "other";

export type CheckerTopicArea =
  | "ethics"
  | "distinct-population"
  | "supervision"
  | "technology-assisted-services"
  | "general-mft-practice"
  | "mixed-or-unclear";

export type CheckerProviderType =
  | "professional-association"
  | "government"
  | "higher-education"
  | "school-system"
  | "hospital-or-clinic"
  | "independent-provider"
  | "unknown";

export type CheckerFormState = {
  activityType: CheckerActivityType;
  topicArea: CheckerTopicArea;
  providerType: CheckerProviderType;
  intent: CheckerIntent;
};

export type CheckerStatus = "likely" | "verify" | "unclear";

export type CheckerResult = {
  status: CheckerStatus;
  headline: string;
  explanation: string;
  reasons: string[];
  nextSteps: string[];
};

export type SourceLink = {
  label: string;
  url: string;
  lastVerified: string;
};

export type RequirementContent = {
  associate: {
    headline: string;
    summary: string;
    checklist: string[];
    notes: string[];
    edgeCasePrompt: string;
  };
  lmft: {
    headline: string;
    summary: string;
    baseChecklist: string[];
    supervisorChecklist: string[];
    telehealthChecklist: string[];
    notes: string[];
    edgeCasePrompt: string;
  };
};

export type CheckerCopy = {
  likely: {
    headline: string;
    explanation: string;
  };
  verify: {
    headline: string;
    explanation: string;
  };
  unclear: {
    headline: string;
    explanation: string;
  };
};

export type CeRulesContent = {
  metadata: {
    title: string;
    subtitle: string;
    lastVerified: string;
  };
  disclaimers: {
    global: string;
    results: string;
    checker: string;
  };
  sources: SourceLink[];
  requirements: RequirementContent;
  checkerCopy: CheckerCopy;
  contactEscalation: {
    heading: string;
    body: string;
    officialLinksLabel: string;
  };
};
