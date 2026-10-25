// ============================================================
// Interactive terminal prompt (the live prompt at the bottom of each page)
//
// Load order matters: this file must come AFTER script.js, because it
// reuses these shared globals defined there:
//   USER, HOST, PAGES, currentPage, currentPath, has(), escapeHTML()
// It also reads PROJECTS / BLOGS / RESEARCH / SITE from data.js.
//
// Sections below: build prompt -> helpers -> commands -> tab completion -> input handling
// ============================================================
function initTerminal() {
  const screen = document.querySelector('.screen');
  const oldPrompt = document.querySelector('.end-prompt');
  if (!screen || !oldPrompt) return;

  const promptText = `${USER}@${HOST} <span class="path">${currentPath}</span> %`;

  // What lives in each "directory" (used by ls / cat / tab completion)
  const SECTION_DATA = {
    projects: typeof PROJECTS !== 'undefined' ? PROJECTS : [],
    blogs: typeof BLOGS !== 'undefined' ? BLOGS : [],
    research: typeof RESEARCH !== 'undefined' ? RESEARCH : []
  };
  const sectionItems = () => SECTION_DATA[currentPage] || [];
  const DIRS = ['about', 'projects', 'blogs', 'research'];
  const FILE_PAGES = {
    'contact.txt': 'contact',
    'about.md': 'about',
    'education.txt': 'about',
    'skills.txt': 'about',
    'achievements.txt': 'about',
    'leadership.txt': 'about',
    'offline.txt': 'about'
  };

  // ---- build the live prompt ----
  const log = document.createElement('div');
  log.className = 'term-log';
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');

  const live = document.createElement('div');
  live.className = 'prompt end-prompt live-prompt';
  live.innerHTML =
    `<label class="prompt-label" for="termInput">${promptText} </label>` +
    `<span class="input-wrap">` +
      `<input id="termInput" class="term-input" type="text" placeholder=" " ` +
      `autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ` +
      `aria-label="Terminal prompt. Type help to see available commands.">` +
      `<span class="cursor" aria-hidden="true">&nbsp;</span>` +
    `</span>`;

  const hint = document.createElement('p');
  hint.className = 'term-hint';
  hint.innerHTML = 'tip: this prompt is live. type <code>help</code> to see what it can do, or just click around.';

  oldPrompt.replaceWith(log, live, hint);

  const input = live.querySelector('input');
  const history = [];
  let histIdx = 0;

  const line = (html, cls = '') => `<div class="out-line ${cls}">${html}</div>`;
  const print = html => {
    const d = document.createElement('div');
    d.className = 'cmd-log';
    d.innerHTML = html;
    log.appendChild(d);
  };
  const echo = text => print(line(`${promptText} <span class="cmd">${escapeHTML(text)}</span>`, 'echo'));

  // ---- navigation helpers ----
  function resolve(arg) {
    if (arg === undefined) return 'home';
    let t = arg.trim().toLowerCase();
    if (t === '' || t === '~' || t === '~/' || t === '/') return 'home';
    t = t.replace(/^~\//, '').replace(/^\/+/, '');
    const stack = [];
    t.split('/').filter(p => p && p !== '.').forEach(p => {
      if (p === '..') stack.pop(); else stack.push(p);
    });
    if (!stack.length) return 'home';
    const name = stack[stack.length - 1].replace(/\.(txt|md|html)$/, '');
    if (name === 'index') return 'home';
    return has(PAGES, name) ? name : null;
  }

  function go(page, quietIfSame) {
    if (page === currentPage) {
      return quietIfSame ? '' : line('already here. scroll up ↑', 'dim');
    }
    setTimeout(() => { window.location.href = PAGES[page]; }, 120);
    return line(`opening ${page}…`, 'dim');
  }

  // ---- commands ----
  function cmdHelp() {
    const row = (c, d) => `<div class="help-row"><span class="hl">${escapeHTML(c)}</span><span class="dim">${escapeHTML(d)}</span></div>`;
    return line('available commands', 'dim') +
      row('help', 'show this message') +
      row('ls', "list what's in the current directory") +
      row('cd <dir>', 'go to a page: about, projects, blogs, research, contact') +
      row('cat <file>', 'read a file, or a project / post by name') +
      row('pwd', 'where am I?') +
      row('whoami', 'who is this person') +
      row('history', "commands you've run") +
      row('clear', 'clear the screen (or ctrl+L)') +
      line('tab autocompletes · ↑/↓ recalls history · "cd .." goes home', 'dim');
  }

  function cmdLs() {
    let items;
    if (currentPage === 'home') {
      items = DIRS.map(d => `<a class="dirname" href="${PAGES[d]}">${d}/</a>`)
        .concat(`<a class="filename" href="${PAGES.contact}">contact.txt</a>`);
    } else if (has(SECTION_DATA, currentPage)) {
      items = sectionItems().map(i => `<span class="filename">${escapeHTML(i.name)}</span>`);
    } else if (currentPage === 'about') {
      items = ['about.md', 'education.txt', 'skills.txt', 'achievements.txt', 'leadership.txt', 'offline.txt'].map(f => `<span class="filename">${f}</span>`);
    } else {
      items = ['<span class="filename">contact.txt</span>'];
    }
    if (!items.length) return line('total 0', 'dim');
    return `<div class="ls-row">${items.map(i => `<span>${i}</span>`).join('')}</div>`;
  }

  function cmdCd(args) {
    if (args[0] === undefined) return go('home', true);
    const key = resolve(args[0]);
    if (!key) return line(`cd: no such file or directory: ${escapeHTML(args[0])}`, 'err');
    return go(key, true);
  }

  function itemDetails(i) {
    const stamp = i.date || i.meta;
    let out = line(`<span class="hl">${escapeHTML(i.name)}</span>${stamp ? ` <span class="dim">${escapeHTML(stamp)}</span>` : ''}`);
    out += line(escapeHTML(i.description || ''), 'dim');
    if (i.tags && i.tags.length) {
      out += line(`<span class="dim">tags:</span> ${i.tags.map(t => escapeHTML(t)).join(', ')}`);
    }
    Object.entries(i.links || {}).filter(([, u]) => u).forEach(([k, u]) => {
      out += line(`<span class="dim">${escapeHTML(k)}:</span> <a href="${escapeHTML(u)}" target="_blank" rel="noopener">${escapeHTML(u)}</a>`);
    });
    return out;
  }

  function cmdCat(args) {
    if (!args.length) return line('cat: missing file operand', 'err');
    const query = args.join(' ').toLowerCase().replace(/\/$/, '');
    const items = sectionItems();
    const item = items.find(i => i.name.toLowerCase() === query) ||
                 items.find(i => i.name.toLowerCase().startsWith(query));
    if (item) return itemDetails(item);
    if (DIRS.includes(query) || query === 'home' || query === '~') {
      return line(`cat: ${escapeHTML(query)}: Is a directory. try <span class="hl">cd ${escapeHTML(query)}</span>`, 'err');
    }
    if (has(FILE_PAGES, query)) return go(FILE_PAGES[query], false);
    return line(`cat: ${escapeHTML(args.join(' '))}: No such file or directory`, 'err');
  }

  const COMMANDS = {
    help: cmdHelp,
    ls: cmdLs,
    cd: cmdCd,
    open: cmdCd,
    cat: cmdCat,
    pwd: () => line('/home/' + USER + (currentPage === 'home' ? '' : '/' + currentPage)),
    whoami: () => {
      const name = typeof SITE !== 'undefined' ? SITE.name : USER;
      const tag = typeof SITE !== 'undefined' ? SITE.tagline : '';
      return line(`<span class="hl">${escapeHTML(name)}</span>`) + (tag ? line(escapeHTML(tag), 'dim') : '');
    },
    history: () => history.length
      ? history.map((h, n) => line(`<span class="dim">${String(n + 1).padStart(3)}</span>  ${escapeHTML(h)}`)).join('')
      : line('nothing yet', 'dim'),
    clear: () => { log.innerHTML = ''; return ''; },
    echo: (args) => line(escapeHTML(args.join(' '))),
    date: () => line(escapeHTML(new Date().toString())),
    sudo: () => line(`${USER} is not in the sudoers file. This incident will be reported.`, 'err'),
    rm: () => line('rm: permission denied. nice try though.', 'err'),
    exit: () => line("logout. there's nowhere to go, just close the tab. i won't be offended.", 'dim')
  };
  const PUBLIC_COMMANDS = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'history', 'clear'];

  function run(raw) {
    echo(raw);
    const trimmed = raw.trim();
    if (!trimmed) return;
    history.push(trimmed);
    histIdx = history.length;

    const [cmd, ...args] = trimmed.split(/\s+/);
    const name = cmd.toLowerCase();
    if (has(COMMANDS, name)) {
      const out = COMMANDS[name](args);
      if (out) print(out);
    } else {
      print(line(`command not found: ${escapeHTML(cmd)}. try <span class="hl">help</span>`, 'err'));
    }
  }

  // ---- tab completion ----
  function complete() {
    const value = input.value.replace(/^\s+/, '');
    const spaceIdx = value.search(/\s/);

    const apply = (prefix, candidates, build, addSpace) => {
      const p = prefix.toLowerCase();
      const matches = candidates.filter(c => c.toLowerCase().startsWith(p));
      if (!matches.length) return;
      if (matches.length === 1) {
        input.value = build(matches[0]) + (addSpace ? ' ' : '');
        return;
      }
      let common = matches[0];
      matches.forEach(m => {
        while (!m.toLowerCase().startsWith(common.toLowerCase())) common = common.slice(0, -1);
      });
      if (common.length > prefix.length) {
        input.value = build(common);
      } else {
        echo(input.value);
        print(line(matches.map(m => escapeHTML(m)).join('   '), 'dim'));
      }
    };

    if (spaceIdx === -1) {
      apply(value, PUBLIC_COMMANDS, c => c, true);
      return;
    }
    const cmd = value.slice(0, spaceIdx).toLowerCase();
    const rest = value.slice(spaceIdx).replace(/^\s+/, '');
    if (cmd === 'cd' || cmd === 'open') {
      apply(rest, DIRS.map(d => d + '/').concat('contact/', '..'), c => `${cmd} ${c}`, false);
    } else if (cmd === 'cat') {
      const names = Object.keys(FILE_PAGES).concat(sectionItems().map(i => i.name));
      apply(rest, names, c => `${cmd} ${c}`, false);
    }
  }

  // ---- input handling ----
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = input.value;
      input.value = '';
      hint.remove();
      run(raw);
      live.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Tab' && input.value.trim()) {
      e.preventDefault();          // only intercept Tab when there's something to complete
      complete();
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      histIdx = Math.max(0, histIdx - 1);
      input.value = history[histIdx];
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      histIdx = Math.min(history.length, histIdx + 1);
      input.value = history[histIdx] || '';
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      log.innerHTML = '';
    } else if (e.key === 'Escape') {
      input.blur();                // lets keyboard users leave the prompt
    }
  });

  live.addEventListener('click', () => input.focus());

  // On desktop: start typing anywhere and it lands in the prompt
  const canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const a = document.activeElement;
      if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
      if (/^[a-z0-9]$/i.test(e.key)) input.focus();
    });
  }
}

initTerminal();
