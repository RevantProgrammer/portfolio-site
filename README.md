# Portfolio

A terminal-themed personal site. Plain HTML, CSS and JS: no build step, no dependencies.

## Run locally

Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

## Where to edit things

| What                                   | Where                                      |
| -------------------------------------- | ------------------------------------------ |
| Name, tagline, email/GitHub/LinkedIn   | `SITE` in `js/data.js`                     |
| Projects, blog posts, research entries | `PROJECTS`, `BLOGS`, `RESEARCH` in `js/data.js` |
| Bio, education, skills                 | `about.html`, `index.html`                 |
| Colors, spacing                        | CSS variables at the top of `css/style.css` |
| Background glows and grid              | `body::before` / `body::after` in `css/style.css` |
| Background code fragments              | `SNIPPETS` list in `js/background.js`      |

## File layout

    index.html, about.html, ...   one page each (same nav + titlebar markup)
    css/style.css                 all styling; colors are CSS variables at the top
    js/data.js                    YOUR CONTENT (SITE, PROJECTS, BLOGS, RESEARCH)
    js/script.js                  shared helpers, nav highlight, renders cards from data.js
    js/terminal.js                the live prompt (commands, tab-complete, history)
    js/background.js              drifting code-fragment canvas behind the terminal

Script order matters: `data.js` -> `script.js` -> `terminal.js` -> `background.js`.
`terminal.js` reuses helpers defined in `script.js`; `background.js` is standalone.

## The live prompt

Every page has a working prompt at the bottom. Try `help`, `ls`, `cd projects`,
`cat <project-name>`, `whoami`, `clear`. Tab autocompletes, up/down recalls history.
Commands live in `js/terminal.js`.

## Deploy

Static site, so GitHub Pages, Netlify or Vercel all work with zero config.
