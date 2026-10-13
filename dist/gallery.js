import {galleryPhotos as photos} from './gallery-config.mjs';

const section = document.getElementById('archivo-fotografico');
// Solo se oculta para animar si este módulo cargó (sin él, la sección se ve completa).
section.classList.add('is-ready');
const track = document.getElementById('film-track');
const frames = [...track.querySelectorAll('.film-frame')];
const previous = document.getElementById('gallery-prev');
const next = document.getElementById('gallery-next');
const progress = document.getElementById('gallery-progress');
const lastNote = document.getElementById('gallery-last-note');
const meter = document.getElementById('gallery-meter-fill');
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const label = index => String(index + 1).padStart(2, '0');
const total = String(frames.length).padStart(2, '0');
let activeIndex = 0;
let scrollFrame = 0;

frames.forEach((frame, index) => {
  const photo = photos[index];
  if (!photo) return;
  frame.className = `film-frame film-frame--${photo.orientation}`;
  frame.querySelector('img').src = photo.src;
  frame.querySelector('img').alt = photo.alt;
  frame.querySelector('figcaption span').textContent = `${label(index)} / ${photo.stage}`;
  frame.querySelector('figcaption p').textContent = photo.caption;
  const opener = frame.querySelector('.film-image');
  opener.setAttribute('aria-label', `Ampliar fotografía ${label(index)}: ${photo.caption}`);
  opener.addEventListener('click', () => openViewer(index, opener));
});

function updateProgress(index) {
  activeIndex = index;
  progress.textContent = `${label(index)} / ${total}`;
  progress.setAttribute('aria-label', `Fotografía ${label(index)} de ${total}`);
  previous.disabled = index === 0;
  next.disabled = index === frames.length - 1;
  lastNote.hidden = index !== frames.length - 1;
  meter?.style.setProperty('--progress', ((index + 1) / frames.length).toFixed(4));
  frames.forEach((frame, i) => frame.classList.toggle('is-current', i === index));
}

function currentFromScroll() {
  const maximum = track.scrollWidth - track.clientWidth;
  if (track.scrollLeft >= maximum - 4) return frames.length - 1;
  const leftEdge = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
  let closest = 0;
  let distance = Infinity;
  frames.forEach((frame, index) => {
    const delta = Math.abs(frame.getBoundingClientRect().left - leftEdge);
    if (delta < distance) {distance = delta; closest = index;}
  });
  return closest;
}

function goTo(index) {
  const nextIndex = Math.max(0, Math.min(frames.length - 1, index));
  const padding = parseFloat(getComputedStyle(track).paddingLeft);
  track.scrollTo({left: frames[nextIndex].offsetLeft - padding,
    behavior: reducedMotion() ? 'instant' : 'smooth'});
  updateProgress(nextIndex);
}

track.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    updateProgress(currentFromScroll());
  });
}, {passive: true});
window.addEventListener('resize', () => updateProgress(currentFromScroll()));
previous.addEventListener('click', () => goTo(activeIndex - 1));
next.addEventListener('click', () => goTo(activeIndex + 1));
track.addEventListener('keydown', event => {
  if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  goTo(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
updateProgress(0);

/* Arrastrar la tira con el mouse (en pantallas táctiles ya se desliza con el dedo). */
let drag = null;
let suppressClick = false;
track.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = {x: event.clientX, left: track.scrollLeft, moved: false};
});
window.addEventListener('pointermove', event => {
  if (!drag) return;
  const dx = event.clientX - drag.x;
  if (!drag.moved && Math.abs(dx) < 6) return;
  if (!drag.moved) {drag.moved = true; track.classList.add('is-dragging');}
  track.scrollLeft = drag.left - dx;
});
window.addEventListener('pointerup', () => {
  if (!drag) return;
  const moved = drag.moved;
  drag = null;
  if (!moved) return;
  suppressClick = true;
  setTimeout(() => {suppressClick = false;}, 0);
  track.classList.remove('is-dragging');
  goTo(currentFromScroll());
});
track.addEventListener('click', event => {
  if (!suppressClick) return;
  event.preventDefault();
  event.stopPropagation();
}, true);
track.addEventListener('dragstart', event => event.preventDefault());

const viewer = document.getElementById('photo-viewer');
const viewerImage = document.getElementById('photo-viewer-image');
const viewerTitle = document.getElementById('photo-viewer-title');
const viewerIndex = document.getElementById('photo-viewer-index');
const viewerText = document.getElementById('photo-viewer-text');
const viewerPrevious = viewer.querySelector('.photo-viewer-prev');
const viewerNext = viewer.querySelector('.photo-viewer-next');
const viewerClose = viewer.querySelector('.photo-viewer-close');
let viewedIndex = 0;
let returnFocus;

function showInViewer(index) {
  const target = Math.max(0, Math.min(photos.length - 1, index));
  viewerImage.style.setProperty('--swap-from', target > viewedIndex ? '28px' : target < viewedIndex ? '-28px' : '0px');
  viewerImage.classList.remove('is-changing');
  void viewerImage.offsetWidth;
  viewerImage.classList.add('is-changing');
  viewedIndex = target;
  const photo = photos[viewedIndex];
  viewerImage.src = photo.src;
  viewerImage.alt = photo.alt;
  viewerTitle.textContent = `EL ARCHIVO DE LO QUE VIENE / ${label(viewedIndex)} DE ${total}`;
  viewerIndex.textContent = `${label(viewedIndex)} / ${photo.stage}`;
  viewerText.textContent = photo.caption;
  viewerPrevious.disabled = viewedIndex === 0;
  viewerNext.disabled = viewedIndex === photos.length - 1;
}

function openViewer(index, opener) {
  returnFocus = opener;
  showInViewer(index);
  viewer.hidden = false;
  viewerClose.focus();
}

function closeViewer() {
  if (viewer.hidden || viewer.classList.contains('is-closing')) return;
  const finish = () => {
    viewer.classList.remove('is-closing');
    viewer.hidden = true;
    if (returnFocus?.isConnected) returnFocus.focus();
  };
  if (reducedMotion()) {finish(); return;}
  viewer.classList.add('is-closing');
  setTimeout(finish, 280);
}

viewerPrevious.addEventListener('click', () => showInViewer(viewedIndex - 1));
viewerNext.addEventListener('click', () => showInViewer(viewedIndex + 1));
viewerClose.addEventListener('click', closeViewer);
viewer.addEventListener('click', event => {if (event.target === viewer) closeViewer();});
viewer.addEventListener('keydown', event => {
  if (event.key === 'Escape') {event.preventDefault();closeViewer();return;}
  if (event.key === 'ArrowLeft' && viewedIndex > 0) {event.preventDefault();showInViewer(viewedIndex - 1);return;}
  if (event.key === 'ArrowRight' && viewedIndex < photos.length - 1) {event.preventDefault();showInViewer(viewedIndex + 1);return;}
  if (event.key !== 'Tab') return;
  const focusable = [...viewer.querySelectorAll('button:not(:disabled)')];
  const first = focusable[0], last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
  else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
});

/* Entrada de la sección: se activa al llegar a ella (o si ya se pasó de largo). */
function revealGallery() {
  if (section.getBoundingClientRect().top > innerHeight * .78) return false;
  section.classList.add('is-inview');
  removeEventListener('scroll', onGalleryScroll);
  return true;
}
let galleryFrame = 0;
function onGalleryScroll() {
  if (!galleryFrame) galleryFrame = requestAnimationFrame(() => {galleryFrame = 0; revealGallery();});
}
if (reducedMotion()) section.classList.add('is-inview');
else if (!revealGallery()) addEventListener('scroll', onGalleryScroll, {passive: true});
