import rulesContent from "../content/ce-rules.json";
import type {
  CeRulesContent,
  CheckerFormState,
  CheckerResult,
  CheckerStatus,
  RequirementFormState,
  RequirementResult
} from "./types";

export const content = rulesContent as CeRulesContent;

const providerLooksListed = (providerType: CheckerFormState["providerType"]) =>
  [
    "professional-association",
    "government",
    "higher-education",
    "school-system",
    "hospital-or-clinic"
  ].includes(providerType);

export function getRequirementResult(
  form: RequirementFormState
): RequirementResult {
  if (form.licenseType === "associate") {
    return {
      headline: content.requirements.associate.headline,
      summary: content.requirements.associate.summary,
      requirementLevel: "info",
      checklist: content.requirements.associate.checklist,
      notes: content.requirements.associate.notes,
      edgeCasePrompt: content.requirements.associate.edgeCasePrompt
    };
  }

  const checklist = [...content.requirements.lmft.baseChecklist];

  if (form.maintainsSupervisorStatus) {
    checklist.push(...content.requirements.lmft.supervisorChecklist);
  }

  if (form.providesTelehealth) {
    checklist.push(...content.requirements.lmft.telehealthChecklist);
  }

  return {
    headline: content.requirements.lmft.headline,
    summary: content.requirements.lmft.summary,
    requirementLevel: "action",
    checklist,
    notes: content.requirements.lmft.notes,
    edgeCasePrompt: content.requirements.lmft.edgeCasePrompt
  };
}

function getCheckerStatus(form: CheckerFormState): CheckerStatus {
  if (form.providerType === "unknown" || form.activityType === "other") {
    return "unclear";
  }

  if (form.intent === "distinct-population") {
    if (form.topicArea === "distinct-population") {
      return "verify";
    }
    return "unclear";
  }

  if (form.intent === "supervision") {
    return form.topicArea === "supervision" ? "likely" : "verify";
  }

  if (form.intent === "telehealth") {
    return form.topicArea === "technology-assisted-services" ? "likely" : "verify";
  }

  if (form.intent === "ethics") {
    return form.topicArea === "ethics" ? "likely" : "verify";
  }

  if (
    form.topicArea === "mixed-or-unclear" ||
    form.providerType === "independent-provider"
  ) {
    return "verify";
  }

  if (
    form.topicArea === "general-mft-practice" &&
    providerLooksListed(form.providerType)
  ) {
    return "likely";
  }

  if (providerLooksListed(form.providerType)) {
    return "verify";
  }

  return "unclear";
}

export function getCheckerResult(form: CheckerFormState): CheckerResult {
  const status = getCheckerStatus(form);
  const copy = content.checkerCopy[status];
  const reasons: string[] = [];
  const nextSteps: string[] = [];

  if (status === "likely") {
    reasons.push(
      "The activity topic aligns with the CE category you selected."
    );
    if (providerLooksListed(form.providerType)) {
      reasons.push(
        "The provider type appears to fit one of the public rule categories commonly used for the 50% provider requirement."
      );
    }
    reasons.push(
      "TAMFT still should not present this as a guaranteed acceptance decision."
    );
  }

  if (status === "verify") {
    reasons.push(
      "Some parts of your answer line up with the public rules, but the category or provider fit is not clear enough for a firm call."
    );
    if (form.intent === "distinct-population") {
      reasons.push(
        "Distinct population credit is especially fact-specific, so the tool should route users to the official rule text instead of declaring a yes."
      );
    }
    if (form.providerType === "independent-provider") {
      reasons.push(
        "Independent providers may still offer usable CE, but the tool should not assume the provider satisfies the 50% listed-provider rule."
      );
    }
  }

  if (status === "unclear") {
    reasons.push(
      "The answers leave too much ambiguity to safely classify this activity in a conservative public-facing tool."
    );
    reasons.push(
      "Official BHEC guidance should control when the activity type, topic, or provider status is uncertain."
    );
  }

  nextSteps.push(
    "Review the official BHEC renewal page and CE FAQ before relying on this activity for reporting."
  );
  nextSteps.push(
    "Keep the certificate or transcript showing your name, topic, date, and hours earned."
  );
  if (status !== "likely") {
    nextSteps.push(
      "If the course serves a special category such as ethics, supervision, telehealth, or a distinct population, compare the course description against the rule text."
    );
  }

  return {
    status,
    headline: copy.headline,
    explanation: copy.explanation,
    reasons,
    nextSteps
  };
}
