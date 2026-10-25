// ============================================================
// Site scripts: shared helpers, nav state and content rendering.
// (The interactive prompt lives in terminal.js, the background in background.js)
// ============================================================

const USER = 'guest';      // keep in sync with the prompts written in the HTML
const HOST = 'portfolio';

const PAGES = {
  home: 'index.html',
  about: 'about.html',
  projects: 'projects.html',
  blogs: 'blogs.html',
  research: 'research.html',
  contact: 'contact.html'
};

const currentPage = document.body.getAttribute('data-page') || 'home';
const currentPath = currentPage === 'home' ? '~' : '~/' + currentPage;

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

// ---- Utility ----
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- Boot line date (shown on Home) ----
const bootDateEl = document.getElementById('bootDate');
if (bootDateEl) {
  const now = new Date();
  bootDateEl.textContent = now.toDateString() + ' ' +
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---- Nav active state ----
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('data-page') === currentPage) link.classList.add('active');
});

// ---- Personal info from SITE (name, tagline, contact links) ----
if (typeof SITE !== 'undefined') {
  document.querySelectorAll('[data-site]').forEach(el => {
    const value = SITE[el.getAttribute('data-site')];
    if (typeof value === 'string') el.textContent = value;
  });

  const contactEl = document.getElementById('contactList');
  if (contactEl) {
    contactEl.innerHTML = (SITE.contact || []).map(c => {
      const external = c.url.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"';
      return `<li><span class="key">${escapeHTML(c.key)}</span> ` +
             `<a href="${escapeHTML(c.url)}"${external}>${escapeHTML(c.label)}</a></li>`;
    }).join('');
  }

  // footer under the terminal window
  const term = document.querySelector('.terminal');
  if (term) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.textContent = `© ${new Date().getFullYear()} ${SITE.name} · hand-built with html, css & a little js`;
    term.insertAdjacentElement('afterend', footer);
  }
}

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
      return `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(label)}</a>`;
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

const projectsGridEl = document.getElementById('projectsGrid');
if (projectsGridEl && typeof PROJECTS !== 'undefined') {
  projectsGridEl.innerHTML = PROJECTS.map(p =>
    renderEntryCard(p, { linkLabels: { github: 'github', demo: 'demo' } })
  ).join('');
}

const blogsGridEl = document.getElementById('blogsGrid');
if (blogsGridEl && typeof BLOGS !== 'undefined') {
  blogsGridEl.innerHTML = BLOGS.map(b =>
    renderEntryCard(b, { metaField: 'date', linkLabels: { read: 'read' } })
  ).join('');
}

const researchGridEl = document.getElementById('researchGrid');
if (researchGridEl && typeof RESEARCH !== 'undefined') {
  researchGridEl.innerHTML = RESEARCH.length
    ? RESEARCH.map(r =>
        renderEntryCard(r, { metaField: 'meta', linkLabels: { paper: 'paper' } })
      ).join('')
    : `<p class="bio">total 0</p>
       <p class="bio"># coming soon: research in progress, nothing published yet. check back later.</p>`;
}
