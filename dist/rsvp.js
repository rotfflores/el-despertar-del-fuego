import {rsvpConfig as config} from './rsvp-config.mjs';

const section = document.getElementById('confirmacion-asistencia');
const form = document.getElementById('rsvp-form');
const nameInput = document.getElementById('rsvp-name');
const yes = document.getElementById('rsvp-yes');
const no = document.getElementById('rsvp-no');
const attendanceOptions = [yes, no];
const guestsField = document.getElementById('rsvp-guests-field');
const guests = document.getElementById('rsvp-guests');
const noteInput = document.getElementById('rsvp-note');
const submit = document.getElementById('rsvp-submit');
const deadline = document.getElementById('rsvp-deadline');
const register = section.querySelector('.rsvp-register');
const more = document.getElementById('rsvp-more');
let opened = false;
const panel = document.getElementById('rsvp-panel');
const thanks = document.getElementById('rsvp-thanks');
const thanksTitle = document.getElementById('rsvp-thanks-title');
const thanksMessage = document.getElementById('rsvp-thanks-message');
const thanksNote = document.getElementById('rsvp-thanks-note');
const thanksStamp = document.getElementById('rsvp-thanks-stamp');
const place = document.getElementById('rsvp-place');
const placeName = document.getElementById('rsvp-place-name');
const placeStamp = document.getElementById('rsvp-place-stamp');
const annotation = document.getElementById('rsvp-annotation');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const errors = {
  name: document.getElementById('rsvp-name-error'),
  attendance: document.getElementById('rsvp-attendance-error'),
  guests: document.getElementById('rsvp-guests-error'),
  note: document.getElementById('rsvp-note-error'),
};

const textTargets = {
  chapter: '#rsvp-chapter', titleFirst: '#rsvp-title-first', titleSecond: '#rsvp-title-second',
  intro: '#rsvp-intro', registerLabel: '#rsvp-register-label', annotation: '#rsvp-annotation',
  nameLabel: '#rsvp-name-label', attendanceLabel: '#rsvp-attendance-label',
  yesLabel: '#rsvp-yes-label', noLabel: '#rsvp-no-label', guestCountLabel: '#rsvp-guests-label',
  noteLabel: '#rsvp-note-label', noteHelp: '#rsvp-note-help', whatsappNote: '#rsvp-whatsapp-note',
  closing: '#rsvp-closing',
  editLabel: '#rsvp-edit',
};
for (const [key, selector] of Object.entries(textTargets)) {
  section.querySelector(selector).textContent = config[key];
}

nameInput.maxLength = 60;
noteInput.maxLength = 300;
const maxGuests = Math.max(1, Number.parseInt(config.maxGuests, 10) || 1);
guests.replaceChildren(...Array.from({length: maxGuests}, (_, index) => {
  const option = document.createElement('option');
  option.value = String(index + 1);
  option.textContent = String(index + 1);
  return option;
}));
guests.value = '1';

function setError(input, element, text) {
  element.textContent = text;
  element.hidden = false;
  input.setAttribute('aria-invalid', 'true');
}
function clearError(input, element) {
  element.textContent = '';
  element.hidden = true;
  input.removeAttribute('aria-invalid');
}
function validateName() {
  const name = nameInput.value.trim();
  clearError(nameInput, errors.name);
  if (!name) setError(nameInput, errors.name, config.nameRequiredError);
  else if (name.length > 60) setError(nameInput, errors.name, config.nameTooLongError);
  return !!name && name.length <= 60;
}
function validateAttendance() {
  clearError(yes, errors.attendance);
  clearError(no, errors.attendance);
  if (!yes.checked && !no.checked) {
    setError(yes, errors.attendance, config.attendanceRequiredError);
    no.setAttribute('aria-invalid', 'true');
    return false;
  }
  return true;
}
function validateGuests() {
  clearError(guests, errors.guests);
  if (!yes.checked) return true;
  const count = Number(guests.value);
  if (!Number.isInteger(count) || count < 1 || count > maxGuests) {
    setError(guests, errors.guests, config.guestCountError);
    return false;
  }
  return true;
}
function validateNote() {
  clearError(noteInput, errors.note);
  if (noteInput.value.trim().length > 300) {
    setError(noteInput, errors.note, config.noteTooLongError);
    return false;
  }
  return true;
}
// Las filas visibles se numeran en orden (la 03 solo existe si la respuesta es sí).
function renumberRows() {
  [...form.querySelectorAll('.rsvp-row')].filter(row => !row.hidden).forEach((row, index) => {
    row.querySelector('.rsvp-row-number').textContent = String(index + 1).padStart(2, '0');
  });
}
// Tarjeta de lugar: el nombre aparece mientras se escribe.
function updatePlaceName() {
  const name = nameInput.value.trim();
  placeName.textContent = name || config.nameLabel;
  placeName.classList.toggle('is-empty', !name);
  placeName.classList.toggle('is-long', name.length > 18);
}
function updateAttendance() {
  const wasHidden = guestsField.hidden;
  guestsField.hidden = !yes.checked;
  if (wasHidden && !guestsField.hidden && opened && !reducedMotion.matches) {
    guestsField.classList.remove('is-entering');
    void guestsField.offsetWidth;
    guestsField.classList.add('is-entering');
  }
  renumberRows();
  guests.required = yes.checked;
  clearError(yes, errors.attendance);
  clearError(no, errors.attendance);
  if (!yes.checked) clearError(guests, errors.guests);
}
attendanceOptions.forEach(input => input.addEventListener('change', updateAttendance));
section.querySelector('.rsvp-options').addEventListener('focusout', event => {
  if (!event.currentTarget.contains(event.relatedTarget)) validateAttendance();
});
nameInput.addEventListener('input', () => {
  if (nameInput.value.length > 60) nameInput.value = nameInput.value.slice(0, 60);
  updatePlaceName();
  if (!errors.name.hidden && nameInput.value.trim()) clearError(nameInput, errors.name);
});
nameInput.addEventListener('blur', validateName);
noteInput.addEventListener('input', () => {
  if (noteInput.value.length > 300) noteInput.value = noteInput.value.slice(0, 300);
  if (!errors.note.hidden) validateNote();
});
noteInput.addEventListener('blur', validateNote);
guests.addEventListener('change', validateGuests);
updateAttendance();
updatePlaceName();

const deadlineMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(config.deadlineDate);
if (deadlineMatch) {
  const [, year, month, day] = deadlineMatch;
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: config.timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const displayDate = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12)));
  const updateDeadline = () => {
    const todayParts = Object.fromEntries(dateFormatter.formatToParts(new Date()).map(part => [part.type, part.value]));
    const today = `${todayParts.year}-${todayParts.month}-${todayParts.day}`;
    deadline.textContent = today > config.deadlineDate
      ? config.deadlineAfter : config.deadlineBefore.replace('{date}', displayDate);
  };
  updateDeadline();
  setInterval(updateDeadline, 60_000);
} else {
  deadline.textContent = config.deadlineAfter;
}

const rawNumber = String(config.whatsappNumber || '').trim();
const number = /^\+?[\d\s().-]+$/.test(rawNumber) ? rawNumber.replace(/\D/g, '') : '';
const canSend = /^\d{8,15}$/.test(number);
// Sin número, el botón solo funciona en la vista previa local (node preview.mjs) para
// revisar la animación y el agradecimiento; publicado, sigue desactivado.
const isPreview = !canSend && ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
submit.disabled = !(canSend || isPreview);
submit.textContent = canSend || isPreview ? config.submitLabel : config.unavailableLabel;

function validate() {
  const nameOk = validateName();
  const attendanceOk = validateAttendance();
  const guestsOk = validateGuests();
  const noteOk = validateNote();
  if (!attendanceOk) {yes.focus();return false;}
  if (!nameOk) {nameInput.focus();return false;}
  if (!guestsOk) {guests.focus();return false;}
  if (!noteOk) {noteInput.focus();return false;}
  return true;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!(canSend || isPreview) || !validate()) return;
  const name = nameInput.value.trim();
  const note = noteInput.value.trim();
  const noteLine = note ? `\nNota: ${note}` : '';
  const message = yes.checked
    ? `¡Hola, ${config.graduateName}! Quiero confirmar mi asistencia a tu celebración de graduación.\n\nNombre: ${name}\nPersonas que asistirán, incluyéndome: ${guests.value}${noteLine}\n\n¡Nos vemos para celebrar!`
    : `Hola, ${config.graduateName}. Esta vez no podré acompañarte en tu celebración de graduación.\n\nNombre: ${name}${noteLine}\n\n¡Muchas felicidades por este logro!`;
  if (canSend) window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  showThanks();
});

// Primero solo se ve la pregunta; al responder, se abre el resto del formulario.
// Sin JavaScript, el formulario se ve completo.
const wait = ms => new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : ms));
function settle(after) {
  register.classList.add('is-moving');
  return wait(after).then(() => register.classList.remove('is-moving'));
}
opened = yes.checked;
more.inert = !opened;
async function toggleMore() {
  if (!yes.checked) {
    opened = false;
    more.inert = true;
    return;
  }
  if (opened) return;
  opened = true;
  register.classList.add('is-opening');
  more.inert = false;
  await settle(850);
  nameInput.focus({preventScroll: true});
  await wait(900);
  register.classList.remove('is-opening');
}
attendanceOptions.forEach(input => input.addEventListener('change', toggleMore));

// Al enviar: la hoja se cierra, aparece el agradecimiento con su sello y, si viene,
// el birrete sale volando entre confeti con los colores del fondo.
// La anotación del registro cambia: «nos falta tu nombre» → «tu nombre ya está en la lista».
function setAnnotation(text) {
  annotation.textContent = text;
  annotation.classList.remove('is-swapping');
  void annotation.offsetWidth;
  annotation.classList.add('is-swapping');
}
async function showThanks() {
  const attending = yes.checked;
  thanksTitle.textContent = config.thanksTitle.replace('{name}', nameInput.value.trim());
  thanksMessage.textContent = attending ? config.thanksYes : config.thanksNo;
  thanksStamp.textContent = placeStamp.textContent = attending ? config.stampYes : config.stampNo;
  thanksNote.textContent = canSend ? config.thanksWhatsapp : config.previewNote;
  thanksNote.hidden = false;
  register.classList.toggle('is-declined', !attending);
  place.classList.toggle('is-declined', !attending);
  submit.classList.add('is-sending');
  await wait(480);
  register.classList.add('is-sent');
  panel.inert = true;
  await settle(700);
  thanks.hidden = false;
  void thanks.offsetWidth;
  thanks.classList.add('is-in');
  place.classList.add('is-confirmed');
  setAnnotation(config.annotationDone);
  thanks.focus({preventScroll: true});
  const box = thanks.getBoundingClientRect();
  if (box.top < innerHeight * .18 || box.top > innerHeight * .6) {
    scrollBy({top: box.top - innerHeight * .32, behavior: reducedMotion.matches ? 'auto' : 'smooth'});
  }
  await wait(820);
  if (attending && !reducedMotion.matches) {
    const stamp = thanksStamp.getBoundingClientRect();
    tossCap(stamp.left + stamp.width / 2, stamp.top + stamp.height / 2);
  }
}
document.getElementById('rsvp-edit').addEventListener('click', async () => {
  thanks.classList.remove('is-in');
  thanks.hidden = true;
  place.classList.remove('is-confirmed');
  setAnnotation(config.annotation);
  submit.classList.remove('is-sending');
  register.classList.remove('is-sent');
  panel.inert = false;
  await settle(850);
  nameInput.focus({preventScroll: true});
});

const confettiColors = ['#164B46', '#D76A35', '#0F332F', '#E2A47C', '#7C9C98'];
function tossCap(x, y) {
  const cap = document.createElement('img');
  cap.src = 'assets/fondo/birrete.png';
  cap.alt = '';
  cap.className = 'rsvp-flying-cap';
  document.body.appendChild(cap);
  const drift = (Math.random() < .5 ? -1 : 1) * (40 + Math.random() * 40);
  const rise = Math.max(140, Math.min(330, y - 40));
  cap.animate([
    {transform: `translate(${x - 60}px, ${y - 45}px) rotate(-8deg) scale(.5)`, opacity: 0},
    {transform: `translate(${x - 60}px, ${y - 90}px) rotate(-20deg) scale(.9)`, opacity: 1, offset: .12},
    {transform: `translate(${x - 60 + drift}px, ${y - rise}px) rotate(330deg) scale(1)`, opacity: 1, offset: .5},
    {transform: `translate(${x - 60 + drift * 1.4}px, ${y - 120}px) rotate(700deg) scale(.95)`, opacity: 0},
  ], {duration: 1900, easing: 'cubic-bezier(.25,.7,.35,1)', fill: 'forwards'}).onfinish = () => cap.remove();
  for (let i = 0; i < 42; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.background = confettiColors[i % confettiColors.length];
    if (i % 4 === 1) {piece.style.width = '5px';piece.style.height = '18px';}
    else if (i % 4 === 2) {piece.style.width = '8px';piece.style.height = '8px';}
    document.body.appendChild(piece);
    const angle = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.2;
    const speed = 200 + Math.random() * 300;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    const spin = (Math.random() - .5) * 900;
    piece.animate([
      {transform: `translate(${x}px, ${y}px) rotate(0deg) scale(${.6 + Math.random() * .6})`, opacity: 1},
      {transform: `translate(${x + dx}px, ${y + dy}px) rotate(${spin / 2}deg)`, opacity: 1, offset: .45},
      {transform: `translate(${x + dx * 1.3}px, ${y + dy + 380}px) rotate(${spin}deg)`, opacity: 0},
    ], {duration: 1500 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards'}).onfinish = () => piece.remove();
  }
}

// Entrada: cada bloque se anima al llegar a él (con scroll, para no saltarse ninguno).
if (!reducedMotion.matches) {
  section.classList.add('is-ready');
  let pending = [...section.querySelectorAll('[data-rsvp-reveal]')];
  let frame = 0;
  const reveal = () => {
    frame = 0;
    pending = pending.filter(element => {
      if (element.getBoundingClientRect().top > innerHeight * .86) return true;
      element.classList.add('is-inview');
      return false;
    });
    if (!pending.length) {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    }
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(reveal);
  };
  addEventListener('scroll', onScroll, {passive: true});
  addEventListener('resize', onScroll);
  reveal();
}
