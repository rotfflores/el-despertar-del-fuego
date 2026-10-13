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
function updateAttendance() {
  guestsField.hidden = !yes.checked;
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
submit.disabled = !canSend;
submit.textContent = canSend ? config.submitLabel : config.unavailableLabel;

function validate() {
  const nameOk = validateName();
  const attendanceOk = validateAttendance();
  const guestsOk = validateGuests();
  const noteOk = validateNote();
  if (!nameOk) {nameInput.focus();return false;}
  if (!attendanceOk) {yes.focus();return false;}
  if (!guestsOk) {guests.focus();return false;}
  if (!noteOk) {noteInput.focus();return false;}
  return true;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!canSend || !validate()) return;
  const name = nameInput.value.trim();
  const note = noteInput.value.trim();
  const noteLine = note ? `\nNota: ${note}` : '';
  const message = yes.checked
    ? `¡Hola, ${config.graduateName}! Quiero confirmar mi asistencia a tu celebración de graduación.\n\nNombre: ${name}\nPersonas que asistirán, incluyéndome: ${guests.value}${noteLine}\n\n¡Nos vemos para celebrar!`
    : `Hola, ${config.graduateName}. Esta vez no podré acompañarte en tu celebración de graduación.\n\nNombre: ${name}${noteLine}\n\n¡Muchas felicidades por este logro!`;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('rsvp-in-view');
      observer.unobserve(entry.target);
    });
  }, {threshold: .08});
  section.querySelectorAll('[data-rsvp-reveal]').forEach(element => observer.observe(element));
}
