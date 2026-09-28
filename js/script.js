// ---- Boot line date (shown on Home) ----
const bootDateEl = document.getElementById('bootDate');
if (bootDateEl) {
  const now = new Date();
  bootDateEl.textContent = now.toDateString() + ' ' +
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---- Nav active state ----
// Each page sets <body data-page="home|about|projects|blogs|research|contact">
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });
});

// ---- Generic entry card renderer (projects / blogs / research) ----
function renderEntryCard(item, opts = {}) {
  const { metaField = null, linkLabels = {} } = opts;

  const meta = metaField && item[metaField]
    ? `<span class="entry-meta">${escapeHTML(item[metaField])}</span>`
    : '';

  const links = Object.entries(item.links || {})
    .filter(([, url]) => url)
    .map(([key, url]) => {
      const label = linkLabels[key] || key;
      return `<a href="${url}" target="_blank" rel="noopener">${escapeHTML(label)}</a>`;
    })
    .join('');

  const tags = (item.tags || [])
    .map(tag => `<span>${escapeHTML(tag)}</span>`)
    .join('');

  return `
    <div class="entry-card">
      <div class="entry-header">
        <span class="entry-name">${escapeHTML(item.name)}</span>
        ${meta}
      </div>
      <p class="entry-desc">${escapeHTML(item.description || '')}</p>
      <div class="entry-footer">
        <div class="entry-tags">${tags}</div>
        <div class="entry-links">${links}</div>
      </div>
    </div>
  `;
}

// ---- Render projects (projects.html) ----
const projectsGridEl = document.getElementById('projectsGrid');
if (projectsGridEl && typeof PROJECTS !== 'undefined') {
  projectsGridEl.innerHTML = PROJECTS.map(p =>
    renderEntryCard(p, { linkLabels: { github: 'github', demo: 'demo' } })
  ).join('');
}

// ---- Render blogs (blogs.html) ----
const blogsGridEl = document.getElementById('blogsGrid');
if (blogsGridEl && typeof BLOGS !== 'undefined') {
  blogsGridEl.innerHTML = BLOGS.map(b =>
    renderEntryCard(b, { metaField: 'date', linkLabels: { read: 'read' } })
  ).join('');
}

// ---- Render research (research.html) ----
const researchGridEl = document.getElementById('researchGrid');
if (researchGridEl && typeof RESEARCH !== 'undefined') {
  researchGridEl.innerHTML = RESEARCH.map(r =>
    renderEntryCard(r, { metaField: 'meta', linkLabels: { paper: 'paper' } })
  ).join('');
}

// ---- Utility ----
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
