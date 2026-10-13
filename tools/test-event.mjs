import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {graduationEvent as event} from '../dist/event-config.mjs';
import {zonedDate, countdownParts, buildCalendar} from '../dist/event-utils.mjs';

const start = zonedDate(event.date, event.reception, event.timeZone);
assert.equal(start.toISOString(), '2026-12-20T01:00:00.000Z');
assert.equal(zonedDate(event.date, event.provisionalEnd, event.timeZone).toISOString(), '2026-12-20T05:00:00.000Z');
assert.deepEqual(countdownParts(start, start.getTime() - 90061000), {days: 1, hours: 1, minutes: 1, seconds: 1});
assert.equal(countdownParts(start, start.getTime()), null);
assert.equal(countdownParts(start, start.getTime() + 1000), null);
assert.deepEqual(countdownParts(start, start.getTime() - 1), {days: 0, hours: 0, minutes: 0, seconds: 1});

const calendar = buildCalendar({...event, name: 'Graduación, arquitectura; edición\\2026\nNos vemos'});
const unfolded = calendar.replace(/\r\n /g, '');
assert.ok(unfolded.includes('DTSTART:20261220T010000Z\r\n'));
assert.ok(unfolded.includes('DTEND:20261220T050000Z\r\n'));
assert.ok(unfolded.includes('X-WR-TIMEZONE:America/Mexico_City\r\n'));
assert.ok(unfolded.includes('SUMMARY:Graduación\\, arquitectura\\; edición\\\\2026\\nNos vemos\r\n'));
assert.ok(!calendar.replaceAll('\r\n', '').includes('\n'));
for (const line of calendar.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
assert.throws(() => buildCalendar({...event, provisionalEnd: '18:00'}));
const fallback = await readFile(new URL('../dist/assets/graduacion-alex-morgan.ics', import.meta.url), 'utf8');
assert.ok(fallback.includes('DTSTART:20261220T010000Z'));
assert.ok(fallback.includes('DTEND:20261220T050000Z'));
console.log('Verificado: zona de México, duración, cuenta regresiva, fecha cumplida y calendario .ics.');
