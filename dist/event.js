import {graduationEvent as event} from './event-config.mjs';
import {zonedDate, countdownParts, buildCalendar} from './event-utils.mjs';

const section = document.getElementById('detalles-del-evento');
const start = zonedDate(event.date, event.reception, event.timeZone);
const dinner = zonedDate(event.date, event.dinner, event.timeZone);
const dateParts = Object.fromEntries(new Intl.DateTimeFormat('es-MX', {
  timeZone: event.timeZone, day: 'numeric', month: 'long', year: 'numeric',
}).formatToParts(start).map(part => [part.type, part.value]));
const timeFormat = new Intl.DateTimeFormat('es-MX', {
  timeZone: event.timeZone, hour: 'numeric', minute: '2-digit', hour12: true,
});
const formattedTime = date => timeFormat.format(date).replace(/([ap])\.\s*m\./i, '$1. m.');
const values = {...event, ...dateParts,
  reception: `Recepción · ${formattedTime(start)}`,
  dinner: `Cena · ${formattedTime(dinner)}`,
};
section.querySelectorAll('[data-event]').forEach(el => {el.textContent = values[el.dataset.event];});
document.getElementById('event-date').dateTime = event.date;

const calendarLink = document.getElementById('save-event-date');
const calendarUrl = URL.createObjectURL(new Blob([buildCalendar(event)], {type: 'text/calendar;charset=utf-8'}));
calendarLink.href = calendarUrl;
calendarLink.download = event.calendarFile;
window.addEventListener('pagehide', event => {
  if (!event.persisted) URL.revokeObjectURL(calendarUrl);
});

// Sin dirección confirmada, conserva un botón nativo desactivado y sin enlace.
let locationUrl;
try {locationUrl = event.locationUrl ? new URL(event.locationUrl) : null;} catch {locationUrl = null;}
if (locationUrl && (locationUrl.protocol === 'https:' || locationUrl.protocol === 'http:')) {
    const disabledButton = document.getElementById('event-location');
    const link = document.createElement('a');
    link.id = disabledButton.id;
    link.className = disabledButton.className;
    link.href = locationUrl.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = disabledButton.innerHTML;
    link.querySelector('span').textContent = 'Cómo llegar';
    disabledButton.replaceWith(link);
}

const counter = document.getElementById('event-countdown');
const arrived = document.getElementById('event-arrived');
let timer;
function updateCountdown() {
  const remaining = countdownParts(start);
  counter.hidden = !remaining;
  arrived.hidden = !!remaining;
  if (!remaining) {
    section.querySelector('.countdown-intro').hidden = true;
    clearInterval(timer);
    return;
  }
  for (const [unit, value] of Object.entries(remaining)) {
    document.getElementById(`countdown-${unit}`).textContent = String(value).padStart(2, '0');
  }
  counter.setAttribute('aria-label', `${remaining.days} días, ${remaining.hours} horas, ${remaining.minutes} minutos y ${remaining.seconds} segundos`);
}
updateCountdown();
if (!arrived.hidden) timer = undefined;
else timer = setInterval(updateCountdown, 1000);
document.addEventListener('visibilitychange', () => {if (!document.hidden) updateCountdown();});

// La base CSS es visible: sin JavaScript o sin animaciones se lee todo.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('event-entered');
      observer.unobserve(entry.target);
    });
  }, {threshold: .08});
  section.querySelectorAll('[data-event-reveal]').forEach(el => observer.observe(el));
}
