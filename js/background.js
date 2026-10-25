// ============================================================
// Ambient background: sparse code fragments drifting slowly upward
// on a fixed canvas behind the terminal. Purely decorative.
//
// - No dependencies on other scripts
// - Static (no animation) if the visitor prefers reduced motion
// - Pauses when the tab is hidden, capped at ~30fps
// The glows and grid live in CSS (body::before / body::after).
// ============================================================
(function () {
  const SNIPPETS = [
    // python / ai-ml
    'import torch', 'import numpy as np', 'import pandas as pd', 'loss.backward()',
    'optimizer.step()', 'nn.ReLU()', 'sigmoid(x)', 'tanh(x)', 'model.fit(X, y)',
    'sns.heatmap(df.corr())', 'plt.show()', 'pip install',
    // web / backend / automation
    'npx create-next-app', 'SELECT * FROM users;', 'await fetch("/api")', 'async/await',
    'webhook received', '0 9 * * *', '200 OK', '404', 'git push origin main', 'try { } catch',
    // hardware
    'void loop() {}', 'Serial.begin(9600);', '#include <Servo.h>', 'servo.write(90);',
    'digitalWrite(13, HIGH);', 'analogRead(A0)', 'GPIO.setup(18, GPIO.OUT)',
    // traffic lights, piano, misc
    'cars_waiting++', 'RED -> GREEN', '♪ C4 E4 G4', 'O(n log n)',
    '{ }', '=>', '&&', '</>', '0110 1001', '$ _', 'ls -la', 'sudo apt update'
  ];

  const canvas = document.createElement('canvas');
  canvas.className = 'bg-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, items = [], last = 0, raf = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function makeItem(fromBottom) {
    return {
      text: pick(SNIPPETS),
      x: rand(0, w),
      y: fromBottom ? h + 24 : rand(0, h),
      size: rand(11, 15),
      speed: rand(6, 18),           // px per second, upward
      phase: rand(0, Math.PI * 2),  // where in its fade cycle it starts
      rate: rand(0.15, 0.4),        // fade cycle speed
      peak: rand(0.22, 0.42),       // max opacity
      cream: Math.random() < 0.2    // a few cream-coloured ones among the amber
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(14, Math.min(48, Math.round((w * h) / 42000)));
    items = Array.from({ length: count }, () => makeItem(false));
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    items.forEach(it => {
      const alpha = it.peak * (0.5 + 0.5 * Math.sin(it.phase));
      ctx.font = `${it.size}px "IBM Plex Mono", "Courier New", monospace`;
      ctx.fillStyle = it.cream
        ? `rgba(232, 227, 211, ${alpha * 0.7})`
        : `rgba(255, 176, 0, ${alpha})`;
      ctx.fillText(it.text, it.x, it.y);
    });
  }

  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (t - last < 33) return;                       // ~30fps
    const dt = Math.min((t - last) / 1000, 0.1);
    last = t;
    items.forEach((it, i) => {
      it.y -= it.speed * dt;
      it.phase += it.rate * dt;
      if (it.y < -20) items[i] = makeItem(true);
    });
    draw();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  if (!reduceMotion) {
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = 0; raf = requestAnimationFrame(loop); }
    });
  }
})();
