export type Locale = "th" | "en";

export type Content = {
  locale: Locale;
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    links: { href: string; label: string }[];
    requestDemo: string;
    langSwitch: string;
    langSwitchTarget: Locale;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageAlt: string;
    alerts: { title: string; severity: "high" | "medium" | "low" }[];
    trustBadges: string[];
  };
  problem: {
    badge: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  solution: {
    badge: string;
    title: string;
    bodyBefore: string;
    highlight: string;
    bodyAfter: string;
    metaphors: { role: string; icon: string; desc: string }[];
  };
  story: {
    badge: string;
    title: string;
    description: string;
    deployHighlight: string;
    deploySub: string;
    chapters: {
      chapter: string;
      timing: string;
      title: string;
      narrative: string;
      bullets: string[];
      agents: string[];
      icon: string;
    }[];
  };
  pack: {
    badge: string;
    title: string;
    description: string;
    agentPrefix: string;
    poweredBy: string;
    members: {
      role: string;
      agentName: string;
      breed: string;
      tool: string;
      image: string;
      imageAlt: string;
      color: string;
      borderColor: string;
      description: string;
      features: string[];
    }[];
  };
  workflow: {
    badge: string;
    title: string;
    steps: {
      step: string;
      title: string;
      subtitle: string;
      description: string;
      icon: string;
    }[];
  };
  features: {
    badge: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  guardrails: {
    badge: string;
    title: string;
    description: string;
    items: {
      title: string;
      subtitle: string;
      description: string;
      icon: string;
    }[];
  };
  tech: {
    badge: string;
    title: string;
    description: string;
    stack: { category: string; items: string[] }[];
  };
  useCases: {
    badge: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  roadmap: {
    badge: string;
    title: string;
    description: string;
    inProgress: string;
    phases: {
      phase: string;
      title: string;
      description: string;
      status: "current" | "upcoming";
    }[];
  };
  cta: {
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
};
