/* Convierte una fecha/hora de la zona IANA indicada a un instante absoluto,
   sin depender de la zona horaria del celular del invitado. */
export function zonedDate(date, time, timeZone) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  let instant = wallTime;
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(formatter.formatToParts(instant).map(part => [part.type, part.value]));
    const displayed = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    const difference = wallTime - displayed;
    instant += difference;
    if (difference === 0) break;
  }
  return new Date(instant);
}

export function countdownParts(target, now = Date.now()) {
  const difference = Number(target) - Number(now);
  if (difference <= 0) return null;
  const total = Math.ceil(difference / 1000);
  return {days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60, seconds: total % 60};
}

const calendarEscape = text => String(text).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const utcStamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
function foldLine(line) {
  const encoder = new TextEncoder();
  let result = '', size = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (size + bytes > 75) {result += '\r\n '; size = 1;}
    result += character;
    size += bytes;
  }
  return result;
}

export function buildCalendar(event, now = new Date()) {
  const start = zonedDate(event.date, event.reception, event.timeZone);
  const end = zonedDate(event.date, event.provisionalEnd, event.timeZone);
  if (end <= start) throw new Error('El fin provisional debe ser posterior al inicio.');
  const description = `Recepción: ${event.reception}. Cena: ${event.dinner}.\n${event.attire}\n${event.address}\nFin provisional: ${event.provisionalEnd}.\nHorario de ${event.timeZone}.`;
  // Fechas UTC inequívocas: 19:00 en México = 01:00 UTC del día siguiente.
  // No requieren una definición VTIMEZONE ni dependen del huso del dispositivo.
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//El archivo de lo que viene//Graduacion//ES',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-TIMEZONE:${event.timeZone}`,
    'BEGIN:VEVENT', `UID:graduacion-${event.date}-${encodeURIComponent(event.graduate)}@archivo-personal.invalid`,
    `DTSTAMP:${utcStamp(now)}`, `DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(end)}`,
    `SUMMARY:${calendarEscape(event.name)}`, `LOCATION:${calendarEscape(`${event.venue}, ${event.city}, ${event.address}`)}`,
    `DESCRIPTION:${calendarEscape(description)}`, 'STATUS:TENTATIVE', 'TRANSP:OPAQUE', 'END:VEVENT', 'END:VCALENDAR']
    .map(foldLine).join('\r\n') + '\r\n';
}
