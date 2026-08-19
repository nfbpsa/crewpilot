export type LeadScoreInput = {
  customer_name?: string | null;
  phone?: string | null;
  email?: string | null;

  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;

  service?: string | null;
  project_type?: string | null;

  customer_type?: string | null;

  timeline?: string | null;
  callback_time?: string | null;

  decision_maker?: string | null;

  budget?: string | null;
  estimated_job_value?: string | null;

  materials?: string | null;
  next_action?: string | null;
  summary?: string | null;
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
  const decisionMaker = (lead.decision_maker ?? "").toLowerCase().trim();

  const hasName = Boolean(lead.customer_name?.trim());
  const hasPhone = Boolean(lead.phone?.trim());
  const hasEmail = Boolean(lead.email?.trim());

  const hasAddress =
    Boolean(lead.street_address?.trim()) ||
    Boolean(lead.city?.trim()) ||
    Boolean(lead.state?.trim()) ||
    Boolean(lead.zip_code?.trim());

  const hasService = Boolean(lead.service?.trim());
  const hasProjectType = Boolean(lead.project_type?.trim());
  const hasBudget = Boolean(lead.budget?.trim());
  const hasJobValue = Boolean(lead.estimated_job_value?.trim());
  const hasMaterials = Boolean(lead.materials?.trim());
  const hasNextAction = Boolean(lead.next_action?.trim());
  const hasSummary = Boolean(lead.summary?.trim());

  // ============================================================
  // CUSTOMER INFORMATION
  // ============================================================

  if (hasName) {
    score += 10;
    reasons.push("Customer name provided");
  }

  if (hasPhone) {
    score += 10;
    reasons.push("Phone number provided");
  }

  if (hasEmail) {
    score += 5;
    reasons.push("Email provided");
  }

  if (hasAddress) {
    score += 10;
    reasons.push("Project address provided");
  }

  // ============================================================
  // JOB INFORMATION
  // ============================================================

  if (hasService) {
    score += 10;
    reasons.push("Service identified");
  }

  if (hasProjectType) {
    score += 10;
    reasons.push("Project details provided");
  }

  if (hasBudget || hasJobValue) {
    score += 10;
    reasons.push("Project value or budget discussed");
  }

  if (hasMaterials) {
    score += 5;
    reasons.push("Materials discussed");
  }

  // ============================================================
  // BUYING INTENT
  // ============================================================

  if (
    decisionMaker.includes("yes") ||
    decisionMaker.includes("true") ||
    decisionMaker.includes("homeowner") ||
    decisionMaker.includes("owner") ||
    decisionMaker.includes("decision maker")
  ) {
    score += 10;
    reasons.push("Decision maker confirmed");
  }

  // ============================================================
  // TIMELINE / URGENCY
  // ============================================================

  if (
    timeline.includes("asap") ||
    timeline.includes("immediately") ||
    timeline.includes("right away") ||
    timeline.includes("today") ||
    timeline.includes("tonight")
  ) {
    score += 20;
    reasons.push("Urgent timeline");
  } else if (
    timeline.includes("tomorrow") ||
    timeline.includes("this week") ||
    timeline.includes("next few days")
  ) {
    score += 15;
    reasons.push("Near-term timeline");
  } else if (
    timeline.includes("next week") ||
    timeline.includes("within two weeks") ||
    timeline.includes("2 weeks") ||
    timeline.includes("couple weeks")
  ) {
    score += 10;
    reasons.push("Near-term project timeline");
  } else if (timeline) {
    score += 5;
    reasons.push("Timeline provided");
  }

  if (callback) {
    score += 5;
    reasons.push("Callback time provided");
  }

  // ============================================================
  // LEAD QUALITY
  // ============================================================

  if (hasNextAction) {
    score += 5;
    reasons.push("Next action identified");
  }

  if (hasSummary) {
    score += 5;
    reasons.push("Call summary available");
  }

  // ============================================================
  // FINAL SCORE
  // ============================================================

  score = Math.min(score, 100);

  let priority: "Low" | "Medium" | "High" = "Low";

  if (score >= 75) {
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