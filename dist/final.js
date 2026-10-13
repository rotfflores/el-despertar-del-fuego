import { finalConfig as config } from './final-config.mjs';

const section = document.getElementById('continuara');
const setText = (selector, value) => { section.querySelector(selector).textContent = value; };
const setLines = (selector, lines) => {
  const element = section.querySelector(selector);
  element.replaceChildren();
  lines.forEach((line, index) => {
    if (index) element.append(document.createElement('br'));
    const span = document.createElement(index === 2 && selector === '#final-title' ? 'em' : 'span');
    span.textContent = line;
    element.append(span);
  });
};

setText('#final-kicker', config.kicker);
const kickerDot = document.createElement('span');
kickerDot.textContent = '●';
kickerDot.setAttribute('aria-hidden', 'true');
section.querySelector('#final-kicker').prepend(kickerDot);
setLines('#final-title', config.titleLines);
setText('#final-thanks', config.thanks);
setText('#final-signature', config.signature);
setText('#final-generation', config.generation);
setLines('#final-photo-annotation', config.photoAnnotation);
setLines('#final-surprise-message', config.surpriseMessage);
setText('#final-surprise-note', config.surpriseNote);
setText('#final-footer-quote', config.footerQuote);
const mainPhoto = section.querySelector('#final-main-photo');
mainPhoto.src = config.mainPhoto;
mainPhoto.alt = config.mainPhotoAlt;
const surprisePhoto = section.querySelector('#final-funny-photo');
surprisePhoto.src = config.surprisePhoto;
surprisePhoto.alt = config.surprisePhotoAlt;

const stamp = section.querySelector('#final-stamp');
const stampLabel = section.querySelector('#final-stamp-label');
const surprise = section.querySelector('#final-surprise');
stampLabel.textContent = config.stampClosed;
let closingTimer;
stamp.addEventListener('click', () => {
  clearTimeout(closingTimer);
  const open = stamp.getAttribute('aria-expanded') !== 'true';
  stamp.setAttribute('aria-expanded', String(open));
  stampLabel.textContent = open ? config.stampOpen : config.stampClosed;
  if (open) {
    surprise.hidden = false;
    requestAnimationFrame(() => surprise.classList.add('is-open'));
  } else {
    surprise.classList.remove('is-open');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) surprise.hidden = true;
    else closingTimer = setTimeout(() => { surprise.hidden = true; }, 320);
  }
});

const rsvpLink = section.querySelector('#final-rsvp-link');
rsvpLink.firstChild.textContent = `${config.rsvpLabel} `;
setText('#final-top-link', config.topLabel);
for (const link of [rsvpLink, section.querySelector('#final-top-link')]) {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
    history.replaceState(null, '', link.getAttribute('href'));
  });
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, {threshold: .12});
  section.querySelectorAll('[data-final-reveal]').forEach(element => observer.observe(element));
}
