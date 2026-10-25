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
    description: "Smarter traffic lights, built in two halves. Software: a pygame simulation of a four-way intersection, used as a proof of concept to pit my lights (a custom cost function weighing how long cars have waited against how many are queued, with emergency-vehicle priority) against fixed timings. The drop in wait times was statistically significant. Hardware: a model intersection where a camera and a YOLO model I fine-tuned on Hot Wheels cars count the traffic on each side, and an Arduino switches 12 LEDs to match. Won the 2025 ADF Future Innovators Award and a 2026 Geelong Innovation Award. (The repo has the simulation; hardware code coming soon.)",
    tags: ["python", "pygame", "yolo", "computer-vision", "arduino"],
    links: { github: "https://github.com/RevantProgrammer/AdaptiveLightsSimulator", demo: "" }
  },
  {
    name: "ai-planner",
    description: "A Streamlit app that pulls business data from Google Sheets, has an LLM turn it into a structured plan, lets you refine it with follow-up prompts, then exports the result as a PDF. Includes login with bcrypt-hashed passwords. This is the early prototype; the version I've built since is a lot better.",
    tags: ["python", "streamlit", "google-sheets-api", "llm", "pdf"],
    links: { github: "https://github.com/RevantProgrammer/AIPlanner", demo: "" }
  }
];

// Empty for now: the blogs page shows a "coming soon" note until posts are added
const BLOGS = [];

// Empty for now: the research page shows a "coming soon" note until entries are added
const RESEARCH = [];
