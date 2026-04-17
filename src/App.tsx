import { useMemo, useState } from "react";
import { content, getCheckerResult, getRequirementResult } from "./logic";
import type { CheckerFormState, RequirementFormState } from "./types";

type ActiveTool = "requirements" | "checker";

const initialRequirementForm: RequirementFormState = {
  licenseType: "associate",
  renewingLicense: false,
  maintainsSupervisorStatus: false,
  providesTelehealth: false
};

const initialCheckerForm: CheckerFormState = {
  activityType: "live-course",
  topicArea: "general-mft-practice",
  providerType: "professional-association",
  intent: "general"
};

const requirementPathSteps = [
  "Choose your path",
  "Supervisor status",
  "Telehealth services",
  "See your likely requirements"
];

const checkerPathSteps = [
  "Choose the CE bucket",
  "Match the topic",
  "Check the provider",
  "Choose the activity type",
  "See the risk level"
];

function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("requirements");
  const [requirementForm, setRequirementForm] = useState(initialRequirementForm);
  const [checkerForm, setCheckerForm] = useState(initialCheckerForm);

  const requirementResult = useMemo(
    () => getRequirementResult(requirementForm),
    [requirementForm]
  );
  const checkerResult = useMemo(
    () => getCheckerResult(checkerForm),
    [checkerForm]
  );

  const requirementStep =
    requirementForm.licenseType === "associate"
      ? 4
      : requirementForm.providesTelehealth
        ? 4
        : requirementForm.maintainsSupervisorStatus
          ? 3
          : 2;

  const checkerStep =
    checkerForm.activityType === "live-course" &&
    checkerForm.topicArea === "general-mft-practice" &&
    checkerForm.providerType === "professional-association" &&
    checkerForm.intent === "general"
      ? 1
      : checkerForm.activityType !== "live-course"
        ? 5
        : checkerForm.providerType !== "professional-association"
          ? 4
          : checkerForm.topicArea !== "general-mft-practice"
            ? 3
            : 2;

  return (
    <div className="app-shell">
      <aside className="rules-panel">
        <p className="eyebrow">Official Sources</p>
        <h1>Rules, Reporting, and Verification</h1>
        <p className="lede">
          Use these links and notes to verify edge cases with BHEC and CE Broker.
        </p>
        <p className="verified-date">
          Last verified <strong>{content.metadata.lastVerified}</strong>
        </p>
        <div className="notice">
          <p>{content.disclaimers.global}</p>
        </div>
        <div className="sources-card compact-card">
          <h2>Official sources</h2>
          <ul className="source-list">
            {content.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <section className="hero-card">
          <p className="eyebrow">Interactive Guide</p>
          <h2>Texas LMFT Continuing Education Guide</h2>
          <p>
            Find your likely CE requirements, check whether an activity may fit
            a CE category, and see how to report hours in CE Broker using
            public BHEC guidance.
          </p>
          <div className="tool-toggle" role="tablist" aria-label="Choose tool">
            <button
              type="button"
              className={activeTool === "requirements" ? "active" : ""}
              onClick={() => setActiveTool("requirements")}
            >
              What CE do I need?
            </button>
            <button
              type="button"
              className={activeTool === "checker" ? "active" : ""}
              onClick={() => setActiveTool("checker")}
            >
              Will this likely count?
            </button>
          </div>
        </section>

        {activeTool === "requirements" ? (
          <section className="flow-layout">
            <div className="flow-panel">
              <div className="flow-header">
                <div>
                  <p className="eyebrow">Tool 1</p>
                  <h2>CE Requirement Finder</h2>
                </div>
                <span className="step-badge">Step {requirementStep} of 4</span>
              </div>

              <ol className="stepper">
                {requirementPathSteps.map((label, index) => (
                  <li
                    key={label}
                    className={index + 1 <= requirementStep ? "current" : ""}
                  >
                    <span>{index + 1}</span>
                    <p>{label}</p>
                  </li>
                ))}
              </ol>

              <div className="question-stack">
                <section className="question-card">
                  <p className="question-number">Question 1</p>
                  <h3>Which path are you on?</h3>
                  <div className="choice-grid">
                    <button
                      type="button"
                      className={
                        requirementForm.licenseType === "associate"
                          ? "choice-card selected"
                          : "choice-card"
                      }
                      onClick={() =>
                        setRequirementForm({
                          licenseType: "associate",
                          renewingLicense: false,
                          maintainsSupervisorStatus: false,
                          providesTelehealth: false
                        })
                      }
                    >
                      <strong>LMFT Associate</strong>
                      <span>Non-renewable associate license</span>
                    </button>
                    <button
                      type="button"
                      className={
                        requirementForm.licenseType === "lmft"
                          ? "choice-card selected"
                          : "choice-card"
                      }
                      onClick={() =>
                        setRequirementForm({
                          licenseType: "lmft",
                          renewingLicense: true,
                          maintainsSupervisorStatus: false,
                          providesTelehealth: false
                        })
                      }
                    >
                      <strong>LMFT renewal</strong>
                      <span>Active license renewal path</span>
                    </button>
                  </div>
                </section>

                {requirementForm.licenseType === "lmft" ? (
                  <>
                    <section className="question-card">
                      <p className="question-number">Question 2</p>
                      <h3>Do you need to maintain supervisor status?</h3>
                      <div className="binary-row">
                        <button
                          type="button"
                          className={
                            requirementForm.maintainsSupervisorStatus
                              ? "pill-button selected"
                              : "pill-button"
                          }
                          onClick={() =>
                            setRequirementForm((current) => ({
                              ...current,
                              maintainsSupervisorStatus: true
                            }))
                          }
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={
                            !requirementForm.maintainsSupervisorStatus
                              ? "pill-button selected"
                              : "pill-button"
                          }
                          onClick={() =>
                            setRequirementForm((current) => ({
                              ...current,
                              maintainsSupervisorStatus: false
                            }))
                          }
                        >
                          No
                        </button>
                      </div>
                    </section>

                    <section className="question-card">
                      <p className="question-number">Question 3</p>
                      <h3>Do you provide telehealth services?</h3>
                      <div className="binary-row">
                        <button
                          type="button"
                          className={
                            requirementForm.providesTelehealth
                              ? "pill-button selected"
                              : "pill-button"
                          }
                          onClick={() =>
                            setRequirementForm((current) => ({
                              ...current,
                              providesTelehealth: true
                            }))
                          }
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={
                            !requirementForm.providesTelehealth
                              ? "pill-button selected"
                              : "pill-button"
                          }
                          onClick={() =>
                            setRequirementForm((current) => ({
                              ...current,
                              providesTelehealth: false
                            }))
                          }
                        >
                          No
                        </button>
                      </div>
                    </section>
                  </>
                ) : null}
              </div>
            </div>

            <div className="result-panel">
              <div className="mini-flow">
                <span className="mini-node active">Path</span>
                <span className="mini-link" />
                <span className="mini-node active">
                  {requirementForm.licenseType === "associate"
                    ? "Associate"
                    : "LMFT"}
                </span>
                {requirementForm.licenseType === "lmft" ? (
                  <>
                    <span className="mini-link" />
                    <span className="mini-node active">
                      {requirementForm.maintainsSupervisorStatus
                        ? "Supervisor"
                        : "No supervisor"}
                    </span>
                    <span className="mini-link" />
                    <span className="mini-node active">
                      {requirementForm.providesTelehealth
                        ? "Telehealth"
                        : "No telehealth"}
                    </span>
                  </>
                ) : null}
              </div>

              <div className="result-card prominent-card">
                <p className="result-label">Likely requirement summary</p>
                <h3>{requirementResult.headline}</h3>
                <p className="compressed-copy">{requirementResult.summary}</p>
                <div className="chip-list">
                  {requirementResult.checklist.map((item) => (
                    <span key={item} className="info-chip">
                      {item}
                    </span>
                  ))}
                </div>
                <details className="details-card">
                  <summary>Why this result is cautious</summary>
                  <p>{content.disclaimers.results}</p>
                  <ul>
                    {requirementResult.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </details>
                <p className="edge-case">{requirementResult.edgeCasePrompt}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="flow-layout">
            <div className="flow-panel">
              <div className="flow-header">
                <div>
                  <p className="eyebrow">Tool 2</p>
                  <h2>CE Eligibility Checker</h2>
                </div>
                <span className="step-badge">Step {checkerStep} of 5</span>
              </div>

              <ol className="stepper">
                {checkerPathSteps.map((label, index) => (
                  <li key={label} className={index + 1 <= checkerStep ? "current" : ""}>
                    <span>{index + 1}</span>
                    <p>{label}</p>
                  </li>
                ))}
              </ol>

              <div className="question-stack">
                <section className="question-card">
                  <p className="question-number">Question 1</p>
                  <h3>What are you trying to count this toward?</h3>
                  <div className="choice-grid compact-grid">
                    {[
                      ["general", "General CE"],
                      ["ethics", "Ethics"],
                      ["distinct-population", "Distinct population"],
                      ["supervision", "Supervision"],
                      ["telehealth", "Telehealth"]
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          checkerForm.intent === value
                            ? "choice-card selected"
                            : "choice-card"
                        }
                        onClick={() =>
                          setCheckerForm((current) => ({
                            ...current,
                            intent: value as CheckerFormState["intent"]
                          }))
                        }
                      >
                        <strong>{label}</strong>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="question-card">
                  <p className="question-number">Question 2</p>
                  <h3>What was the main topic?</h3>
                  <div className="choice-grid compact-grid">
                    {[
                      ["general-mft-practice", "General MFT practice"],
                      ["ethics", "Ethics"],
                      ["distinct-population", "Distinct population"],
                      ["supervision", "Supervision"],
                      ["technology-assisted-services", "Technology-assisted services"],
                      ["mixed-or-unclear", "Mixed or unclear"]
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          checkerForm.topicArea === value
                            ? "choice-card selected"
                            : "choice-card"
                        }
                        onClick={() =>
                          setCheckerForm((current) => ({
                            ...current,
                            topicArea: value as CheckerFormState["topicArea"]
                          }))
                        }
                      >
                        <strong>{label}</strong>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="question-card">
                  <p className="question-number">Question 3</p>
                  <h3>Who offered it?</h3>
                  <div className="choice-grid compact-grid">
                    {[
                      ["professional-association", "Professional association"],
                      ["government", "Government entity"],
                      ["higher-education", "Higher education"],
                      ["school-system", "School system"],
                      ["hospital-or-clinic", "Hospital or clinic"],
                      ["independent-provider", "Independent provider"],
                      ["unknown", "Not sure"]
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          checkerForm.providerType === value
                            ? "choice-card selected"
                            : "choice-card"
                        }
                        onClick={() =>
                          setCheckerForm((current) => ({
                            ...current,
                            providerType: value as CheckerFormState["providerType"]
                          }))
                        }
                      >
                        <strong>{label}</strong>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="question-card">
                  <p className="question-number">Question 4</p>
                  <h3>What kind of activity was it?</h3>
                  <div className="choice-grid compact-grid">
                    {[
                      ["live-course", "Live course"],
                      ["on-demand-course", "On-demand course"],
                      ["conference", "Conference session"],
                      ["self-study", "Self-study"],
                      ["other", "Other or not sure"]
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          checkerForm.activityType === value
                            ? "choice-card selected"
                            : "choice-card"
                        }
                        onClick={() =>
                          setCheckerForm((current) => ({
                            ...current,
                            activityType: value as CheckerFormState["activityType"]
                          }))
                        }
                      >
                        <strong>{label}</strong>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="result-panel">
              <div className="mini-flow">
                <span className="mini-node active">{checkerForm.intent}</span>
                <span className="mini-link" />
                <span className="mini-node active">{checkerForm.topicArea}</span>
                <span className="mini-link" />
                <span className="mini-node active">{checkerForm.providerType}</span>
                <span className="mini-link" />
                <span className="mini-node active">{checkerForm.activityType}</span>
              </div>

              <div className={`result-card prominent-card status-${checkerResult.status}`}>
                <p className="result-label">Conservative classification</p>
                <h3>{checkerResult.headline}</h3>
                <p className="compressed-copy">{checkerResult.explanation}</p>
                <div className="chip-list">
                  {checkerResult.reasons.map((reason) => (
                    <span key={reason} className="info-chip">
                      {reason}
                    </span>
                  ))}
                </div>
                <details className="details-card" open={checkerResult.status !== "likely"}>
                  <summary>What to do next</summary>
                  <p>{content.disclaimers.checker}</p>
                  <ul>
                    {checkerResult.nextSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          </section>
        )}

        <section className="ce-broker-section">
          <div className="section-heading">
            <p className="eyebrow">Reporting Help</p>
            <h2>{content.ceBroker.heading}</h2>
            <p>{content.ceBroker.summary}</p>
          </div>

          <div className="ce-broker-grid">
            <article className="info-panel">
              <h3>How to access it</h3>
              <ol>
                {content.ceBroker.accessSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>

            <article className="info-panel">
              <h3>What you will likely need</h3>
              <ul>
                {content.ceBroker.neededInfo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="info-panel">
              <h3>How reporting works</h3>
              <ol>
                {content.ceBroker.reportingSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          </div>

          <div className="ce-broker-footer">
            <div className="notice soft-notice">
              <p>{content.ceBroker.associateNote}</p>
            </div>

            <div className="info-panel">
              <h3>Important reminders</h3>
              <ul>
                {content.ceBroker.reminders.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="info-panel">
              <h3>Official CE Broker links</h3>
              <ul className="source-list">
                {content.ceBroker.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                    <span>Verified {link.lastVerified}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
