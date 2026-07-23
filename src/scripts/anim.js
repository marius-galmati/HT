import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || new URLSearchParams(window.location.search).has('noanim');

function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const lines = hero.querySelectorAll('.line');
  const fades = hero.querySelectorAll('[data-hero-fade]');
  const rule = hero.querySelector('[data-hero-rule]');
  const mono = hero.querySelector('[data-hero-mono]');

  if (reduced) {
    gsap.set(lines, { y: 0 });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (mono) tl.fromTo(mono, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 0.9, scale: 1, duration: 1.4 }, 0);
  tl.to(lines, { y: 0, duration: 1.15, stagger: 0.14 }, 0.25);
  if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, transformOrigin: 'left center' }, 0.9);
  if (fades.length) tl.fromTo(fades, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.05);

  if (mono) {
    gsap.to(mono, {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

function initReveals() {
  const els = document.querySelectorAll('[data-reveal]');
  els.forEach((el) => {
    if (reduced) return;
    const kind = el.dataset.reveal;
    const from = { autoAlpha: 0, y: 28 };
    if (kind === 'left') { from.y = 0; from.x = -36; }
    if (kind === 'right') { from.y = 0; from.x = 36; }
    if (kind === 'zoom') { from.y = 0; from.scale = 0.96; }
    gsap.fromTo(el, from, {
      autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });

  document.querySelectorAll('[data-stagger]').forEach((group) => {
    if (reduced) return;
    const items = group.children;
    gsap.fromTo(items, { autoAlpha: 0, y: 26 }, {
      autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 84%', once: true },
    });
  });

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    if (reduced) return;
    const speed = parseFloat(el.dataset.parallax || '12');
    gsap.to(el, {
      yPercent: speed, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  document.querySelectorAll('[data-rule]').forEach((el) => {
    if (reduced) return;
    gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1, duration: 1.2, ease: 'power3.inOut', transformOrigin: 'left center',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function initAll() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  initNav();
  initHero();
  initReveals();
}

document.addEventListener('astro:page-load', initAll);
if (document.readyState !== 'loading') initAll();
else document.addEventListener('DOMContentLoaded', initAll, { once: true });
