/* Datos editables. La foto provisional se puede reemplazar con un archivo
   propio dentro de dist/assets/ y su ruta en photo. */
const invitation = {
  name: 'Alex Morgan',
  degree: 'Licenciatura en Arquitectura',
  generation: '2022 — 2026',
  year: '2026',
  photo: 'assets/alex-morgan-provisional.png',
  photoAlt: 'Retrato provisional de un joven graduado con toga negra, sonriendo frente a la arquitectura de una universidad',
  nextSection: '#siguiente-seccion',
};

document.getElementById('graduate-name').textContent = invitation.name;
document.getElementById('graduate-degree').textContent = invitation.degree;
document.querySelector('#graduate-generation span').textContent = invitation.generation;
document.title = `El archivo de lo que viene — Graduación de ${invitation.name}`;
const portrait = document.getElementById('graduate-photo');
portrait.src = invitation.photo;
portrait.alt = invitation.photoAlt;
document.querySelector('.edition').lastChild.textContent = ` EDICIÓN ${invitation.year}`;
document.querySelector('.footer-date').textContent = `${invitation.year} / UN NUEVO COMIENZO`;
document.querySelector('.side-label').textContent = `ARCHIVO DE UN NUEVO COMIENZO — ${invitation.year}`;

document.querySelectorAll('.celebrate, .scroll-invitation').forEach(link => {
  link.setAttribute('href', invitation.nextSection);
  link.addEventListener('click', event => {
    const destination = document.querySelector(invitation.nextSection);
    if (!destination) return;
    event.preventDefault();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    destination.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    destination.focus({ preventScroll: true });
    history.replaceState(null, '', invitation.nextSection);
  });
});
