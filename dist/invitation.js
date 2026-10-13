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

/* Sección 2: los tres recuerdos. Para agregar una fotografía, colócala en
   dist/assets/ y escribe su ruta en photo (y una descripción en photoAlt). */
const memories = {
  afterSection: '#detalles-del-evento',
  items: [
    {
      title: 'El día que casi renuncié',
      teaser: 'También hubo un ‘ya no puedo’.',
      story: 'Hubo una entrega que salió mal y un momento en el que dudé de todo. Descansé, pedí ayuda y volví a intentarlo. Hoy también celebro haber seguido.',
      photo: 'assets/recuerdos/01-estudio.jpg',
      photoAlt: 'Un joven estudiante corta con cuidado un bloque de espuma para una maqueta en el taller.',
    },
    {
      title: 'El caos que ahora extraño',
      teaser: 'Una última entrega. Tres cafés. Cero horas de sueño.',
      story: 'Entre maquetas, mensajes de madrugada y risas a destiempo, terminamos construyendo algo más que proyectos: recuerdos que me llevo para siempre.',
      photo: 'assets/recuerdos/02-companeros.jpg',
      photoAlt: 'Un grupo de compañeros de universidad conversa y ríe en un salón de clases.',
    },
    {
      title: 'Quienes me sostuvieron',
      teaser: 'Este logro también tiene otros nombres.',
      story: 'A quienes me escucharon, me acompañaron y confiaron en mí cuando yo dudaba: gracias. En este logro hay un poquito de cada uno.',
      photo: 'assets/recuerdos/03-familia.jpg',
      photoAlt: 'Un graduado con toga y birrete abraza a su padre al terminar la ceremonia.',
    },
  ],
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

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Confeti con los colores del fondo al presionar el botón principal. */
const confettiColors = ['#1F4441', '#C7693A', '#183431', '#E2A47C', '#F8F6F1'];
function celebrate(originX, originY) {
  if (reducedMotion()) return;
  for (let i = 0; i < 46; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.background = confettiColors[i % confettiColors.length];
    if (i % 3 === 0) piece.style.borderRadius = '50%';
    document.body.appendChild(piece);
    const angle = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.1;
    const speed = 240 + Math.random() * 320;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    const spin = (Math.random() - .5) * 900;
    piece.animate([
      {transform: `translate(${originX}px, ${originY}px) rotate(0deg) scale(${.6 + Math.random() * .6})`, opacity: 1},
      {transform: `translate(${originX + dx}px, ${originY + dy}px) rotate(${spin / 2}deg)`, opacity: 1, offset: .45},
      {transform: `translate(${originX + dx * 1.3}px, ${originY + dy + 420}px) rotate(${spin}deg)`, opacity: 0},
    ], {duration: 1500 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards'}).onfinish = () => piece.remove();
  }
}

function goTo(target) {
  const destination = document.querySelector(target);
  if (!destination) return;
  destination.scrollIntoView({behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start'});
  destination.focus({preventScroll: true});
  history.replaceState(null, '', target);
}

document.querySelectorAll('.celebrate, .scroll-invitation').forEach(link => {
  link.setAttribute('href', invitation.nextSection);
  link.addEventListener('click', event => {
    if (!document.querySelector(invitation.nextSection)) return;
    event.preventDefault();
    let delay = 0;
    if (link.classList.contains('celebrate') && !reducedMotion()) {
      const box = link.getBoundingClientRect();
      celebrate(box.left + box.width / 2, box.top + box.height / 2);
      delay = 650;
    }
    setTimeout(() => goTo(invitation.nextSection), delay);
  });
});

/* El birrete sigue suavemente al cursor (solo con mouse). */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const layers = [{el: document.querySelector('.cap-holder'), depth: 18}];
  let frame = 0;
  window.addEventListener('pointermove', event => {
    if (reducedMotion() || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const x = event.clientX / window.innerWidth - .5;
      const y = event.clientY / window.innerHeight - .5;
      layers.forEach(({el, depth}) => {
        el.style.setProperty('--px', `${(-x * depth).toFixed(1)}px`);
        el.style.setProperty('--py', `${(-y * depth).toFixed(1)}px`);
      });
    });
  });
}

/* ---------- Sección 2: fichas que se abren y cierran ---------- */
document.querySelectorAll('.ficha').forEach((ficha, index) => {
  const memory = memories.items[index];
  if (memory) {
    const number = String(index + 1).padStart(2, '0');
    ficha.querySelector('.ficha-title').lastChild.textContent = memory.title;
    ficha.querySelector('.ficha-teaser').textContent = memory.teaser;
    ficha.querySelector('.ficha-body').textContent = memory.story;
    ficha.querySelector('.slot-desc').textContent = memory.photoAlt;
    if (memory.photo) {
      const img = document.createElement('img');
      img.src = memory.photo;
      img.alt = memory.photoAlt;
      img.loading = 'lazy';
      ficha.querySelector('[data-photo-slot]').replaceWith(img);
    }
    ficha.querySelector('.ficha-number').textContent = number;
  }

  const button = ficha.querySelector('.ficha-toggle');
  const label = button.querySelector('.toggle-text');
  const setOpen = open => {
    ficha.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Cerrar recuerdo' : 'Abrir recuerdo';
  };
  setOpen(false);
  button.addEventListener('click', () => setOpen(!ficha.classList.contains('is-open')));
  // Tocar cualquier parte de la ficha cerrada también la abre.
  ficha.addEventListener('click', event => {
    if (event.target.closest('.ficha-toggle, a') || ficha.classList.contains('is-open')) return;
    setOpen(true);
  });
});

const afterLink = document.querySelector('.archive-link');
afterLink.setAttribute('href', memories.afterSection);
afterLink.addEventListener('click', event => {
  if (!document.querySelector(memories.afterSection)) return;
  event.preventDefault();
  goTo(memories.afterSection);
});

/* Aparición suave de la sección al llegar a ella. Todo lo que ya quedó
   arriba de la pantalla (por ejemplo, tras un salto con enlace) también aparece. */
let pending = [...document.querySelectorAll('.archive [data-reveal], .ficha')];
let revealFrame = 0;
function revealInView() {
  revealFrame = 0;
  const limit = window.innerHeight * .9;
  pending = pending.filter(el => {
    if (el.getBoundingClientRect().top > limit) return true;
    el.classList.add('is-visible');
    return false;
  });
  if (!pending.length) window.removeEventListener('scroll', onRevealScroll);
}
function onRevealScroll() {
  if (!revealFrame) revealFrame = requestAnimationFrame(revealInView);
}
window.addEventListener('scroll', onRevealScroll, {passive: true});
window.addEventListener('resize', onRevealScroll);
revealInView();

/* Cuadritos y rayas de cada página: se dibujan al llegar a ellos. */
let decos = [...document.querySelectorAll('.deco')];
let decoFrame = 0;
function drawDecos() {
  decoFrame = 0;
  decos = decos.filter(deco => {
    const box = deco.getBoundingClientRect();
    if (box.top > innerHeight * .92) return true;
    deco.classList.add('is-in');
    return false;
  });
  if (!decos.length) removeEventListener('scroll', onDecoScroll);
}
function onDecoScroll() {
  if (!decoFrame) decoFrame = requestAnimationFrame(drawDecos);
}
addEventListener('scroll', onDecoScroll, {passive: true});
addEventListener('resize', onDecoScroll);
drawDecos();
