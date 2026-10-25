// ============================================================
// Edit the arrays below to update site content.
// Each entry follows a plain object structure — no build step,
// just save and refresh the page.
// ============================================================

// Personal info used across the site (name, tagline, contact links)
const SITE = {
  name: "Revant Pandey",
  tagline: "High-schooler building backends, robots and AI workflows. Most of them work on the first try. Most.",
  contact: [
    { key: "email",    label: "revant_pandey@outlook.com",            url: "mailto:revant_pandey@outlook.com" },
    { key: "github",   label: "github.com/RevantProgrammer",      url: "https://github.com/RevantProgrammer" },
    { key: "linkedin", label: "LinkedIn not yet created", url: "#" }
  ]
};

const PROJECTS = [
  {
    name: "adaptive-traffic-lights",
    description: "A pygame simulation of a four-way intersection that pits fixed-timing traffic lights against smart ones. The smart lights use my own cost function, which weighs how long cars have waited against how many are queued, and give emergency vehicles priority. Won the 2025 ADF Future Innovators Award and a 2026 Geelong Innovation Award.",
    tags: ["python", "pygame", "simulation", "optimisation"],
    links: { github: "https://github.com/RevantProgrammer/AdaptiveLightsSimulator", demo: "" }
  }
];

// Empty for now: the blogs page shows a "coming soon" note until posts are added
const BLOGS = [];

// Empty for now: the research page shows a "coming soon" note until entries are added
const RESEARCH = [];
