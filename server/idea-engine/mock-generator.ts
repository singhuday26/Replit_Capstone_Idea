import type { GeneratedIdea, QuestionnaireInput } from "@shared/idea-contract";

type IdeaTemplate = GeneratedIdea & {
  relevanceTokens: string[];
  preferredImpact: QuestionnaireInput["impact"];
  hardwareAffinity: "yes" | "no" | "any";
};

const IMPACT_LABELS: Record<QuestionnaireInput["impact"], string> = {
  grade: "Solid Grade & Resume",
  research: "Research Paper",
  startup: "Startup Potential",
  social: "Social Impact",
};

const IDEA_TEMPLATES: IdeaTemplate[] = [
  {
    id: "idea-1",
    title: "NeuroGuardian: Federated Learning for Edge IoT Security",
    tagline:
      "Detecting zero-day anomalies on microcontrollers without exposing raw telemetry.",
    difficulty: "Bleeding Edge",
    impact: "Research Paper",
    feasibilityScore: 85,
    innovationScore: 95,
    demoImpact: 90,
    tags: ["AI/ML", "IoT", "Cybersecurity", "Federated Learning"],
    problem:
      "IoT devices are increasingly targeted by botnets, but running traditional IDS on edge devices drains battery and sending raw data to the cloud compromises privacy.",
    novelty:
      "Implementing a lightweight federated learning model directly on ESP32 or Raspberry Pi hardware, allowing devices to collaboratively learn anomaly patterns without sharing raw network traffic.",
    architecture: [
      "Edge Node: C++ firmware running TensorFlow Lite for Microcontrollers.",
      "Aggregator: Python/FastAPI server managing model weight updates.",
      "Dashboard: React UI visualizing anomaly detection confidence across the fleet.",
      "Communication: MQTT over TLS for lightweight and secure updates.",
    ],
    datasets:
      "TON_IoT dataset and KDD Cup 1999 (subsampled for edge experiments).",
    deliverables: [
      "Working prototype on 3+ edge nodes.",
      "Centralized aggregation service.",
      "Latency and accuracy benchmark report.",
      "Research-oriented implementation report.",
    ],
    extensions:
      "Add differential privacy in model aggregation to mitigate membership inference attacks.",
    relevanceTokens: [
      "iot",
      "cybersecurity",
      "security",
      "edge",
      "federated",
      "ml",
    ],
    preferredImpact: "research",
    hardwareAffinity: "yes",
  },
  {
    id: "idea-2",
    title: "EchoScript: LLM-Assisted Legacy Code Translation Engine",
    tagline:
      "Automating the migration of COBOL and Fortran systems to modern microservices.",
    difficulty: "Challenging",
    impact: "Startup Potential",
    feasibilityScore: 92,
    innovationScore: 88,
    demoImpact: 95,
    tags: ["LLMs", "Compilers", "Web Dev", "Developer Tools"],
    problem:
      "Financial and public institutions rely on decades-old code that is expensive to maintain and difficult to modernize.",
    novelty:
      "A migration assistant that combines syntax translation with architecture recommendations and automatic unit test generation using retrieval-augmented prompts.",
    architecture: [
      "Frontend: React-based side-by-side translation editor with semantic diffs.",
      "Backend API: Node service orchestrating translation and validation.",
      "AI Pipeline: Retrieval-augmented prompt chains over migration examples.",
      "Static Validation: AST checks to ensure structural integrity.",
    ],
    datasets: "Open-source COBOL repositories and migration pattern corpora.",
    deliverables: [
      "Interactive translation workspace.",
      "CLI for batch conversions.",
      "Automated test scaffold generation.",
      "Demo migration of one real algorithmic module.",
    ],
    extensions:
      "Integrate security scanning to prevent introducing common vulnerabilities during translation.",
    relevanceTokens: ["llm", "compiler", "web", "devtools", "code", "software"],
    preferredImpact: "startup",
    hardwareAffinity: "no",
  },
  {
    id: "idea-3",
    title: "OmniSight: Accessible Spatial Awareness Wearable",
    tagline:
      "A low-cost haptic navigation assistant for visually impaired users using depth sensing.",
    difficulty: "Moderate",
    impact: "Social Impact",
    feasibilityScore: 78,
    innovationScore: 82,
    demoImpact: 100,
    tags: ["Computer Vision", "Accessibility", "Hardware", "Haptics"],
    problem:
      "Assistive navigation tools are often expensive or lack rich spatial awareness.",
    novelty:
      "Combining commodity depth sensors and a haptic belt to translate obstacle geometry into intuitive real-time tactile cues.",
    architecture: [
      "Hardware: Depth sensor + Raspberry Pi + vibration motor array.",
      "Vision Pipeline: OpenCV module converts depth maps into obstacle vectors.",
      "Controller: Microcontroller maps vectors to haptic PWM signals.",
      "Companion App: Mobile interface for configuration and emergency sharing.",
    ],
    datasets: "NYU Depth Dataset V2 for offline model tuning and simulation.",
    deliverables: [
      "Wearable prototype with haptic feedback.",
      "Real-time perception pipeline.",
      "Companion app configuration flow.",
      "User validation notes and demo script.",
    ],
    extensions:
      "Add lightweight object classification to distinguish moving and static hazards.",
    relevanceTokens: [
      "vision",
      "accessibility",
      "social",
      "hardware",
      "mobile",
      "haptics",
    ],
    preferredImpact: "social",
    hardwareAffinity: "yes",
  },
];

const clampScore = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((token) => token.length > 1);
}

function buildIntentTokens(input: QuestionnaireInput): Set<string> {
  const values = [
    input.branch,
    input.skills,
    input.customInterest,
    input.problemSpace,
    ...input.interests,
  ];

  const tokenSet = new Set<string>();
  for (const value of values) {
    for (const token of tokenize(value)) {
      tokenSet.add(token);
    }
  }

  return tokenSet;
}

function scoreTemplate(
  template: IdeaTemplate,
  input: QuestionnaireInput,
  tokens: Set<string>,
) {
  let score = 0;

  for (const token of template.relevanceTokens) {
    if (tokens.has(token)) {
      score += 6;
    }
  }

  if (template.preferredImpact === input.impact) {
    score += 8;
  }

  if (
    template.hardwareAffinity === "any" ||
    template.hardwareAffinity === input.hardware
  ) {
    score += 4;
  }

  if (input.teamSize === "1" && template.difficulty === "Bleeding Edge") {
    score -= 3;
  }

  if (
    input.timeframe === "3 months" &&
    template.difficulty === "Bleeding Edge"
  ) {
    score -= 4;
  }

  if (input.timeframe === "1 year" && template.difficulty !== "Moderate") {
    score += 2;
  }

  return score;
}

function adjustIdeaScores(
  template: IdeaTemplate,
  input: QuestionnaireInput,
  score: number,
): GeneratedIdea {
  const difficultyBoost =
    input.difficulty === "bleeding edge"
      ? 4
      : input.difficulty === "challenging"
        ? 2
        : -1;

  const feasibilityAdjustment =
    (input.timeframe === "1 year"
      ? 4
      : input.timeframe === "3 months"
        ? -5
        : 0) +
    (input.teamSize === "1" ? -2 : input.teamSize === "4+" ? 2 : 0) +
    (input.hardware === "yes" ? 1 : 0);

  return {
    ...template,
    impact: IMPACT_LABELS[input.impact],
    feasibilityScore: clampScore(
      template.feasibilityScore + Math.floor(score / 3) + feasibilityAdjustment,
    ),
    innovationScore: clampScore(
      template.innovationScore + Math.floor(score / 4) + difficultyBoost,
    ),
    demoImpact: clampScore(template.demoImpact + Math.floor(score / 5)),
  };
}

export function generateDeterministicIdeas(
  input: QuestionnaireInput,
): GeneratedIdea[] {
  const tokens = buildIntentTokens(input);

  return IDEA_TEMPLATES.map((template) => {
    const score = scoreTemplate(template, input, tokens);
    return {
      idea: adjustIdeaScores(template, input, score),
      score,
    };
  })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.idea);
}
