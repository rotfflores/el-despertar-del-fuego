import {writeFile} from 'node:fs/promises';
import {graduationEvent} from '../dist/event-config.mjs';
import {buildCalendar} from '../dist/event-utils.mjs';
await writeFile(new URL('../dist/assets/graduacion-alex-morgan.ics', import.meta.url), buildCalendar(graduationEvent), 'utf8');
console.log('Calendario de respaldo actualizado.');
