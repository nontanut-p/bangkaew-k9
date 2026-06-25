import type { Content } from "./types";

export const en: Content = {
  locale: "en",
  metadata: {
    title: "Bangkaew K9 | Agentic Cybersecurity Guard Platform",
    description:
      "An Agentic Cybersecurity platform that detects, analyzes, recommends responses, and generates incident reports from Wazuh, Shuffle, Kali, and AI Agents — all in one place.",
  },
  nav: {
    links: [
      { href: "#problem", label: "Problem" },
      { href: "#solution", label: "Solution" },
      { href: "#story", label: "How It Works" },
      { href: "#pack", label: "The Pack" },
      { href: "#features", label: "Features" },
      { href: "#tech", label: "Tech Stack" },
    ],
    requestDemo: "Go to Demo",
    langSwitch: "TH",
    langSwitchTarget: "th",
  },
  hero: {
    badge: "🐕 Agentic Cybersecurity Guard Platform",
    title: "Bangkaew",
    titleHighlight: "K9",
    subtitle: "Intelligent cyber guard for the AI-powered enterprise",
    description:
      "An Agentic Cybersecurity platform that detects, analyzes, recommends responses, and generates incident reports from Wazuh, Shuffle, Kali, and AI Agents — all in one unified view.",
    ctaPrimary: "See How It Works",
    ctaSecondary: "Go to Demo",
    imageAlt: "Bangkaew K9 — Intelligent cyber guard platform",
    alerts: [
      { title: "Brute Force Detected", severity: "high" },
      { title: "AI Triage: Critical", severity: "medium" },
      { title: "Playbook Ready", severity: "low" },
    ],
    trustBadges: [
      "1-Click Deploy",
      "Human-in-the-loop",
      "Open-source Stack",
    ],
  },
  problem: {
    badge: "Common Pain Points",
    title: "Too many security tools — and the people using them are more exhausted than ever",
    items: [
      {
        icon: "🔔",
        title: "Alert overload",
        description:
          "Hard to tell what actually matters — teams drown in noise instead of real threats.",
      },
      {
        icon: "📋",
        title: "Logs are unreadable",
        description:
          "Requires expert interpretation. New team members can barely keep up.",
      },
      {
        icon: "⏱️",
        title: "Slow response",
        description:
          "Jumping between multiple systems and screens wastes critical time before you even understand what happened.",
      },
      {
        icon: "⚠️",
        title: "Risky automation",
        description:
          "One wrong command can impact the entire organization — blocking the wrong IP or isolating a critical server.",
      },
      {
        icon: "📊",
        title: "Executives left in the dark",
        description:
          "Reports are too technical. Leadership can't grasp the real business risk.",
      },
    ],
  },
  solution: {
    badge: "Solution",
    title:
      "Bangkaew K9 makes security operations as intuitive as having a guard dog for your digital home",
    bodyBefore:
      "The platform doesn't replace your existing security tools. It acts as the",
    highlight: "central brain and UX layer",
    bodyAfter:
      "that connects Wazuh, Shuffle, Kali, and AI Agents — helping IT teams understand incidents, make decisions, and respond faster.",
    metaphors: [
      {
        role: "Digital Home",
        icon: "🏠",
        desc: "Your organization's systems and servers",
      },
      { role: "The Wolf", icon: "🐺", desc: "Threats and intruders" },
      {
        role: "The Guard Dog",
        icon: "🐕",
        desc: "Bangkaew K9 watching over everything 24/7",
      },
    ],
  },
  story: {
    badge: "How It Works",
    title: "From zero to a guarded digital home — just keep scrolling",
    description:
      "Imagine your organization has 10 computers — servers, IT laptops, executive PCs. Here's what happens from the moment you hit Deploy to the day a real threat shows up.",
    deployHighlight: "1-Click Deploy the Whole Pack",
    deploySub:
      "Install Wazuh agents, connect Shuffle, activate the AI layer, link GitHub, and dashboard — the entire pack ready in one command. No per-machine setup. No juggling five dashboards.",
    chapters: [
      {
        chapter: "Chapter 1",
        timing: "Day 1 — 5 minutes",
        title: "Deploy the entire pack at once",
        narrative:
          "IT opens Bangkaew K9 and hits Deploy — the system pushes agents to every machine in the organization automatically.",
        bullets: [
          "2 servers, 5 IT laptops, 3 office PCs — 10 endpoints total",
          "Agent Shepherd (Wazuh) installs on every machine, streaming logs to central hub",
          "Agent Collie (Shuffle) connects baseline playbooks — notify, open ticket",
          "Agent Bangkaew (AI) stands ready to analyze — waiting for events",
          "Agent Retriever links GitHub + baseline code scan (Semgrep, Trivy, Gitleaks) on every repo",
        ],
        agents: ["Shepherd", "Collie", "Bangkaew", "Retriever"],
        icon: "🚀",
      },
      {
        chapter: "Chapter 2",
        timing: "Within 30 minutes",
        title: "When are you actually 'secure'",
        narrative:
          "The dashboard shows each endpoint's status — green = online and logging, yellow = syncing, red = needs attention.",
        bullets: [
          "When all 10/10 endpoints are green and baseline is complete = your digital home is guarded",
          "Agent Shepherd starts 'learning' normal behavior per machine — login hours, typical processes",
          "No incidents yet, but the system is live — IT monitors everything from one page, no SSH per machine",
        ],
        agents: ["Shepherd"],
        icon: "🛡️",
      },
      {
        chapter: "Chapter 3",
        timing: "2:14 AM — someone tries to break in",
        title: "Incident detected — who does what",
        narrative:
          "Shepherd detects abnormal login from a foreign IP on an executive PC — barks immediately.",
        bullets: [
          "Agent Shepherd → sends alert: Brute Force Detected, Severity High",
          "Agent Bangkaew → correlates related alerts, sets severity Critical, summarizes in plain language",
          "IT opens one page, sees the full picture — no Wazuh console, no raw log reading",
          "Executives get a short summary: 'Someone tried to log into your PC from overseas'",
        ],
        agents: ["Shepherd", "Bangkaew"],
        icon: "🔔",
      },
      {
        chapter: "Chapter 4",
        timing: "2:18 AM — 4 minutes later",
        title: "Respond safely — humans decide",
        narrative:
          "Bangkaew recommends 3 actions with reasoning — but won't execute until you hit Approve.",
        bullets: [
          "Recommends: Block IP + notify admin via LINE/Email + temporarily isolate host",
          "IT approves 2 of 3 — Block IP and notify admin",
          "Agent Collie runs Shuffle playbook instantly — block IP, send alert, log ticket",
          "Every decision is audit-logged — fully traceable who approved what, when",
        ],
        agents: ["Bangkaew", "Collie"],
        icon: "✅",
      },
      {
        chapter: "Chapter 5",
        timing: "The following week",
        title: "Prove your defenses actually work",
        narrative:
          "Agent Pitbull simulates the same attack again — testing whether Shepherd detects it and Collie responds fast enough.",
        bullets: [
          "Pitbull (Kali/Caldera) runs attack simulation mapped to MITRE ATT&CK",
          "Scorecard: Detected in 12 seconds, responded in 3 minutes — improved from last run",
          "Report sent to leadership — plain language, not a technical dump",
        ],
        agents: ["Pitbull", "Shepherd", "Collie"],
        icon: "⚔️",
      },
      {
        chapter: "Chapter 6",
        timing: "After incident — CVE in production",
        title: "Fix code, open PR, then redeploy",
        narrative:
          "Shepherd finds a CVE in a running container — Bangkaew recommends a patch → Retriever takes the fix job.",
        bullets: [
          "Retriever scans the affected repo — finds vulnerable dependency and files",
          "Customer's chosen LLM (Claude, Codex, DeepSeek, GLM, etc.) generates patch from scan results",
          "Opens PR with scan report + plain-language explanation — never pushes straight to main",
          "IT reviews + merges → rescan passes → Collie triggers server redeploy",
        ],
        agents: ["Retriever", "Bangkaew", "Collie"],
        icon: "🔧",
      },
    ],
  },
  pack: {
    badge: "The Pack",
    title: "Meet the K9 Pack from the story",
    description:
      "These are the agents you just read about — each with a clear role, working together to protect your digital home.",
    agentPrefix: "Agent",
    poweredBy: "Powered by",
    members: [
      {
        role: "Watchdog",
        agentName: "Shepherd",
        breed: "German Shepherd",
        tool: "Wazuh",
        image: "/pack/shepherd.png",
        imageAlt: "Agent Shepherd — German Shepherd Watchdog powered by Wazuh",
        color: "from-blue-500 to-cyan-500",
        borderColor: "border-blue-500/30",
        description:
          "The watchdog that barks when something's wrong — shepherd of the flock, guarding endpoints and logs.",
        features: [
          "Detects endpoint, server, log, and security events",
          "Sends alerts when anomalous behavior is found",
        ],
      },
      {
        role: "Pack Leader",
        agentName: "Bangkaew",
        breed: "Thai Bangkaew Dog",
        tool: "Agentic AI",
        image: "/pack/bangkaew.png",
        imageAlt: "Agent Bangkaew — Thai Bangkaew AI Pack Leader",
        color: "from-cyan-500 to-teal-500",
        borderColor: "border-cyan-500/30",
        description:
          "The Bangkaew pack leader — thinks, analyzes, and decides what to do.",
        features: [
          "Analyzes alerts and correlates related incidents",
          "Assigns severity levels",
          "Recommends actions with reasoning",
        ],
      },
      {
        role: "Fixer",
        agentName: "Retriever",
        breed: "Golden Retriever",
        tool: "GitHub + Semgrep / Trivy",
        image: "/pack/retriever.png",
        imageAlt: "Agent Retriever — Golden Retriever Fixer, code scan, PR, redeploy",
        color: "from-emerald-500 to-green-500",
        borderColor: "border-emerald-500/30",
        description:
          "The golden retriever that fetches fixes — scans code from setup, patches via customer's LLM, opens PR before deploy.",
        features: [
          "GitHub integration — baseline scan every repo with Semgrep, Trivy, Gitleaks",
          "Pluggable LLM: Claude, Codex, DeepSeek, GLM, or local LLM",
          "Opens PR + rescan before merge — Collie redeploys after approval",
        ],
      },
      {
        role: "Handler",
        agentName: "Collie",
        breed: "Border Collie",
        tool: "Shuffle",
        image: "/pack/collie.png",
        imageAlt: "Agent Collie — Border Collie Handler powered by Shuffle",
        color: "from-violet-500 to-purple-500",
        borderColor: "border-violet-500/30",
        description:
          "The border collie that takes orders and executes playbooks with precision — never misses a step.",
        features: [
          "Receives approved commands",
          "Runs playbooks: notify, block IP, open ticket, isolate host",
        ],
      },
      {
        role: "Sparring Dog",
        agentName: "Pitbull",
        breed: "American Pitbull Terrier",
        tool: "Kali / Caldera",
        image: "/pack/pitbull.png",
        imageAlt: "Agent Pitbull — Pitbull Sparring Dog for Red Team",
        color: "from-amber-500 to-orange-500",
        borderColor: "border-amber-500/30",
        description:
          "The pitbull that simulates attacks to train and validate defenses — fierce, but works for the team.",
        features: [
          "Simulates attacks to test the system",
          "Validates detection and response capabilities",
          "Generates scorecards on real defense effectiveness",
        ],
      },
    ],
  },
  workflow: {
    badge: "Workflow",
    title: "The story in 7 steps — safe and fully auditable",
    steps: [
      {
        step: "01",
        title: "Detect",
        subtitle: "Detection",
        description: "Wazuh detects anomalies",
        icon: "🔍",
      },
      {
        step: "02",
        title: "Triage",
        subtitle: "Prioritize",
        description: "AI correlates and prioritizes alerts",
        icon: "📊",
      },
      {
        step: "03",
        title: "Explain",
        subtitle: "Summarize",
        description: "Summarize incidents in plain language",
        icon: "💬",
      },
      {
        step: "04",
        title: "Recommend",
        subtitle: "Suggest",
        description: "Propose actions with reasoning",
        icon: "💡",
      },
      {
        step: "05",
        title: "Approve",
        subtitle: "Human gate",
        description: "Human approval required before high-impact actions",
        icon: "✅",
      },
      {
        step: "06",
        title: "Respond",
        subtitle: "Execute",
        description: "Shuffle runs the approved playbook",
        icon: "⚡",
      },
      {
        step: "07",
        title: "Learn",
        subtitle: "Memory",
        description: "Store incidents as memory for future case comparison",
        icon: "🧠",
      },
    ],
  },
  features: {
    badge: "Features",
    title: "Built for IT teams and executives alike",
    items: [
      {
        icon: "🔧",
        title: "Code Scan + PR Fix Loop",
        description:
          "Agent Retriever scans code from setup, fixes via customer's LLM, opens PR before redeploy.",
      },
      {
        icon: "📊",
        title: "Unified Security Dashboard",
        description:
          "View all alerts, incidents, and system status in one place.",
      },
      {
        icon: "🤖",
        title: "AI Incident Triage",
        description:
          "AI automatically prioritizes and correlates related alerts.",
      },
      {
        icon: "💬",
        title: "Natural Language Security Chat",
        description:
          "Ask about incidents in plain language, get clear answers.",
      },
      {
        icon: "🛡️",
        title: "Human-in-the-loop Remediation",
        description:
          "High-impact actions always require human approval first.",
      },
      {
        icon: "📄",
        title: "Executive Incident Reports",
        description:
          "Generate business-friendly incident reports for leadership.",
      },
      {
        icon: "🗺️",
        title: "MITRE ATT&CK Coverage Map",
        description: "Visualize detection coverage against the MITRE framework.",
      },
      {
        icon: "🔴",
        title: "Red Team Validation Loop",
        description: "Test defenses with real attack simulation.",
      },
      {
        icon: "📝",
        title: "Audit Log & Explainability",
        description:
          "Every decision logged with reasoning — fully auditable.",
      },
      {
        icon: "🧠",
        title: "Incident Memory / RAG",
        description:
          "Learn from past incidents to improve future analysis.",
      },
    ],
  },
  guardrails: {
    badge: "Guardrails",
    title: "AI that assists — never acts recklessly",
    description:
      "Bangkaew K9 is designed so AI analyzes and recommends — it never shuts down systems autonomously without boundaries.",
    items: [
      {
        title: "Treat logs as untrusted data",
        subtitle: "Prompt injection protection",
        description:
          "Guards against prompt injection from logs, filenames, user-agents, or embedded payloads.",
        icon: "🔒",
      },
      {
        title: "Approval required",
        subtitle: "Human gate for impact",
        description:
          "High-impact actions like block IP, isolate host, or kill process require explicit approval.",
        icon: "✋",
      },
      {
        title: "Explain before execute",
        subtitle: "No black boxes",
        description:
          "Every recommendation includes reasoning — no opaque decisions.",
        icon: "📖",
      },
      {
        title: "Audit everything",
        subtitle: "Full traceability",
        description:
          "Every decision, approval, and playbook execution is logged and reviewable.",
        icon: "📋",
      },
      {
        title: "Cost control",
        subtitle: "Smart AI usage",
        description:
          "Deduplicate and correlate alerts before sending to LLM — no wasted tokens.",
        icon: "💰",
      },
    ],
  },
  tech: {
    badge: "Technology",
    title: "Built on proven open-source tools",
    description:
      "Industry-proven open-source foundations — no need to start from scratch.",
    stack: [
      { category: "Detection", items: ["Wazuh"] },
      { category: "SOAR", items: ["Shuffle"] },
      {
        category: "Code Security",
        items: ["Semgrep", "Trivy", "Gitleaks", "OWASP Top 10", "GitHub"],
      },
      {
        category: "Attack Simulation",
        items: ["Kali Linux", "Caldera", "Atomic Red Team"],
      },
      {
        category: "AI Orchestration",
        items: ["LangGraph", "Claude / Codex / DeepSeek / GLM / Local LLM"],
      },
      {
        category: "Backend",
        items: ["FastAPI", "Redis Streams", "PostgreSQL / TimescaleDB"],
      },
      { category: "Memory", items: ["Qdrant"] },
      { category: "Frontend", items: ["Next.js", "Tailwind CSS"] },
    ],
  },
  useCases: {
    badge: "Use Cases",
    title: "Who is it for?",
    items: [
      {
        icon: "🏢",
        title: "SMEs without a full SOC",
        description:
          "Small to mid-size companies without a dedicated SOC team that need real, usable protection.",
      },
      {
        icon: "🖥️",
        title: "Internal IT teams",
        description:
          "IT teams managing servers and endpoints who need help handling security events.",
      },
      {
        icon: "🔐",
        title: "Starting security automation",
        description:
          "Organizations ready to adopt security automation safely, with human approval built in.",
      },
      {
        icon: "🔬",
        title: "R&D and demo teams",
        description:
          "Teams that need end-to-end cybersecurity demos from detection to response.",
      },
      {
        icon: "👔",
        title: "Executives",
        description:
          "Leaders who need to understand cyber risk in plain language, not just technical reports.",
      },
    ],
  },
  roadmap: {
    badge: "Roadmap",
    title: "Starting with a real, buildable MVP",
    description:
      "Built incrementally, tested for real — not just a slide deck.",
    inProgress: " — In Progress",
    phases: [
      {
        phase: "Phase 1",
        title: "Alert Pipeline",
        description: "Wazuh Alert → FastAPI Webhook → Shuffle Notification",
        status: "current",
      },
      {
        phase: "Phase 2",
        title: "AI Triage",
        description: "AI Triage + Incident Summary",
        status: "upcoming",
      },
      {
        phase: "Phase 3",
        title: "Human Approval",
        description: "Human Approval + Recommended Playbook",
        status: "upcoming",
      },
      {
        phase: "Phase 4",
        title: "Red Team Loop",
        description: "Kali/Caldera Validation Loop",
        status: "upcoming",
      },
      {
        phase: "Phase 5",
        title: "Full Dashboard",
        description: "Dashboard + Report + MITRE Coverage",
        status: "upcoming",
      },
    ],
  },
  cta: {
    title: "Let Bangkaew K9 guard your organization's digital home",
    description:
      "Detect faster, understand easier, respond safely — with AI analyzing every incident.",
    primary: "Go to Demo",
    secondary: "View Architecture",
  },
  footer: {
    tagline: "Agentic Cybersecurity Guard Platform — Intelligent cyber guard",
    copyright: "© {year} Bangkaew K9",
  },
};
