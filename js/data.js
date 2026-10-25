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
    name: "project-one",
    description: "One or two sentences on what this project does and why you built it.",
    tags: ["python", "postgres", "docker"],
    links: { github: "https://github.com/yourhandle/project-one", demo: "" }
  },
  {
    name: "project-two",
    description: "Another short description. Focus on the interesting technical decision, not just what it does.",
    tags: ["go", "redis"],
    links: { github: "https://github.com/yourhandle/project-two", demo: "" }
  },
  {
    name: "project-three",
    description: "Third project placeholder — swap in your real work here.",
    tags: ["rust", "cli-tool"],
    links: { github: "https://github.com/yourhandle/project-three", demo: "" }
  }
];

const BLOGS = [
  {
    name: "why-i-write-my-own-cli-tools",
    date: "2026-08-14",
    description: "A short excerpt or summary of the post goes here — a sentence or two that pulls readers in.",
    tags: ["tooling", "opinion"],
    links: { read: "#" }
  },
  {
    name: "debugging-a-race-condition-at-2am",
    date: "2026-06-02",
    description: "War story placeholder. Swap in a real post title, date, and link when ready.",
    tags: ["debugging", "backend"],
    links: { read: "#" }
  },
  {
    name: "notes-on-learning-rust",
    date: "2026-03-19",
    description: "Placeholder excerpt for a learning-in-public style post.",
    tags: ["rust", "learning"],
    links: { read: "#" }
  }
];

// Empty for now: the research page shows a "coming soon" note until entries are added
const RESEARCH = [];
