import {letterConfig as config} from './letter-config.mjs';

const section = document.getElementById('carta-al-futuro');
const form = document.getElementById('future-letter-form');
const nameInput = document.getElementById('letter-name');
const messageInput = document.getElementById('letter-message');
const fromName = document.getElementById('letter-from-name');
const suggestion = document.getElementById('letter-suggestion');
const counter = document.getElementById('letter-counter');
const submit = document.getElementById('letter-submit');
const nameError = document.getElementById('letter-name-error');
const messageError = document.getElementById('letter-message-error');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const textTargets = {
  chapter: '#letter-chapter', titleFirst: '#letter-title-first', titleSecond: '#letter-title-second',
  intro: '#letter-intro', sideNote: '#letter-side-note', tab: '#letter-tab', folio: '#letter-folio', toLabel: '#letter-to-label',
  fromLabel: '#letter-from-label', choiceLegend: '#letter-choice-legend', suggestionLabel: '#letter-suggestion-label',
  nameLabel: '#letter-name-label', messageLabel: '#letter-message-label',
  whatsappNote: '#letter-whatsapp-note', footerNote: '#letter-footer-note', stamp: '#letter-stamp',
  bottomBrand: '#letter-bottom-brand', pageNumber: '#letter-page-number',
};
for (const [key, selector] of Object.entries(textTargets)) {
  section.querySelector(selector).textContent = config[key];
}
document.getElementById('letter-to-name').textContent = config.graduateName;
nameInput.maxLength = 60;
messageInput.maxLength = 600;

const choices = [...form.querySelectorAll('input[name="letter-type"]')];
choices.forEach((input, index) => {
  const type = config.types[index];
  input.value = type.value;
  input.nextElementSibling.textContent = type.label;
});

function selectedType() {
  const value = choices.find(input => input.checked)?.value;
  return config.types.find(type => type.value === value) || config.types[0];
}
function updateSuggestion() {
  suggestion.textContent = selectedType().prompt;
}
choices.forEach(input => input.addEventListener('change', updateSuggestion));
updateSuggestion();

function updateName() {
  if (nameInput.value.length > 60) nameInput.value = nameInput.value.slice(0, 60);
  fromName.textContent = nameInput.value.trim() || config.emptyFrom;
  if (!nameError.hidden && nameInput.value.trim() && nameInput.value.trim().length <= 60) clearError(nameInput, nameError);
}
function updateCounter() {
  if (messageInput.value.length > 600) messageInput.value = messageInput.value.slice(0, 600);
  counter.textContent = `${messageInput.value.length} / 600`;
  if (!messageError.hidden && messageInput.value.trim() && messageInput.value.trim().length <= 600) clearError(messageInput, messageError);
}
nameInput.addEventListener('input', updateName);
messageInput.addEventListener('input', updateCounter);
updateName();
updateCounter();

function setError(input, element, message) {
  element.textContent = message;
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
  clearError(nameInput, nameError);
  if (!name) setError(nameInput, nameError, config.nameRequiredError);
  else if (name.length > 60) setError(nameInput, nameError, config.nameTooLongError);
  return !!name && name.length <= 60;
}
function validateMessage() {
  const message = messageInput.value.trim();
  clearError(messageInput, messageError);
  if (!message) setError(messageInput, messageError, config.messageRequiredError);
  else if (message.length > 600) setError(messageInput, messageError, config.messageTooLongError);
  return !!message && message.length <= 600;
}
nameInput.addEventListener('blur', validateName);
messageInput.addEventListener('blur', validateMessage);
function validate() {
  const nameOk = validateName();
  const messageOk = validateMessage();
  if (!nameOk) {nameInput.focus();return null;}
  if (!messageOk) {messageInput.focus();return null;}
  return {name: nameInput.value.trim(), message: messageInput.value.trim()};
}

const rawNumber = config.whatsappNumber.trim();
const number = /^\+?[\d\s().-]+$/.test(rawNumber) ? rawNumber.replace(/\D/g, '') : '';
const canSend = /^\d{8,15}$/.test(number);
submit.disabled = !canSend;
submit.textContent = canSend ? config.submitLabel : config.unavailableLabel;
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!canSend) return;
  const fields = validate();
  if (!fields) return;
  const text = `Hola, ${config.graduateName}. Te dejo unas palabras para tu siguiente etapa.\n\nDe: ${fields.name}\nTipo: ${selectedType().value}\n\n${fields.message}`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('letter-in-view');
      observer.unobserve(entry.target);
    });
  }, {threshold: .08});
  section.querySelectorAll('[data-letter-reveal]').forEach(element => observer.observe(element));
}
