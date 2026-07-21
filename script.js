/* Michael Peacock — portfolio
   Three small jobs: the day/night lamp, drawing the rhumb line as you
   scroll, and revealing waypoints as they're reached.

   Everything degrades: with JS off the page is complete and the course
   line is already drawn. With reduced motion, nothing animates. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ── lamp: day / night passage ───────────────────────────── */
  var KEY = 'wl-theme';
  var lamp = document.getElementById('lamp');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* The button is labelled with the passage it will switch you TO,
     so it always reads as the action rather than the state. */
  function label() {
    var night = effective() === 'night';
    lamp.setAttribute('aria-pressed', night ? 'true' : 'false');
    lamp.querySelector('.lamp__text').textContent = night ? 'Day passage' : 'Night passage';
  }

  function effective() {
    return root.getAttribute('data-theme') || (systemDark.matches ? 'night' : 'day');
  }

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  if (stored === 'night' || stored === 'day') root.setAttribute('data-theme', stored);
  label();

  lamp.addEventListener('click', function () {
    var next = effective() === 'night' ? 'day' : 'night';
    root.setAttribute('data-theme', next);
    label();
    try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
  });

  /* Track the system setting while no explicit choice is stored. */
  systemDark.addEventListener('change', function () {
    if (!root.hasAttribute('data-theme')) label();
  });

  /* ── motion-sensitive behaviour ──────────────────────────── */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  var waypoints = Array.prototype.slice.call(document.querySelectorAll('.wp'));
  var ink = document.querySelector('.rhumb__ink');
  var track = document.querySelector('.track');
  if (!waypoints.length || !ink || !track) return;

  /* Reveal each waypoint once it's reached.

     The `js` class is added HERE, not at the top of the file: it is what
     arms `opacity: 0` on the waypoints, so it must not be set until the
     observer that clears it is confirmed available. If anything above
     this point throws, the work stays visible. */
  if (!('IntersectionObserver' in window)) return;

  root.classList.add('js');

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-fixed');
      seen.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  waypoints.forEach(function (wp) { seen.observe(wp); });

  /* Failsafe: if the observer somehow never fires, show everything. */
  window.setTimeout(function () {
    waypoints.forEach(function (wp) { wp.classList.add('is-fixed'); });
  }, 3000);

  /* Draw the course line to match scroll progress through the track.
     stroke-dasharray is 1000 to match the SVG's 0–1000 viewBox height. */
  var ticking = false;

  function draw() {
    ticking = false;
    var rect = track.getBoundingClientRect();
    var vh = window.innerHeight || root.clientHeight;

    // 0 when the track's top reaches mid-viewport, 1 when its bottom does.
    var span = rect.height;
    if (span <= 0) return;
    var progress = (vh * 0.5 - rect.top) / span;
    progress = Math.max(0, Math.min(1, progress));

    ink.style.setProperty('--draw', String(1000 - progress * 1000));
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(draw);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  draw();
})();
