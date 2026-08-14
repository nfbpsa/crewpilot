export type LeadScoreInput = {
  timeline?: string | null;
  callback_time?: string | null;
  decision_maker?: string | null;
  budget?: string | null;
  service?: string | null;
};

export type LeadScoreResult = {
  score: number;
  priority: "Low" | "Medium" | "High";
  reasons: string[];
};

export function calculateLeadScore(
  lead: LeadScoreInput
): LeadScoreResult {
  let score = 0;
  const reasons: string[] = [];

  const timeline = (lead.timeline ?? "").toLowerCase();
  const callback = (lead.callback_time ?? "").trim();
  const decisionMaker = (lead.decision_maker ?? "").toLowerCase();
  const budget = (lead.budget ?? "").trim();
  const service = (lead.service ?? "").trim();

  if (
    timeline.includes("asap") ||
    timeline.includes("today") ||
    timeline.includes("tomorrow")
  ) {
    score += 30;
    reasons.push("Urgent timeline");
  }

  if (callback) {
    score += 20;
    reasons.push("Callback time provided");
  }

  if (
    decisionMaker === "yes" ||
    decisionMaker === "true"
  ) {
    score += 20;
    reasons.push("Decision maker confirmed");
  }

  if (budget) {
    score += 15;
    reasons.push("Budget discussed");
  }

  if (service) {
    score += 15;
    reasons.push("Service identified");
  }

  score = Math.min(score, 100);

  let priority: "Low" | "Medium" | "High" = "Low";

  if (score >= 80) {
    priority = "High";
  } else if (score >= 50) {
    priority = "Medium";
  }

  return {
    score,
    priority,
    reasons,
  };
}