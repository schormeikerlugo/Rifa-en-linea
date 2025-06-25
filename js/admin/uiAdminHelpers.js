// uiAdminHelpers.js

export function mostrarElemento(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.classList.add('transicion', 'visible');
    el.classList.remove('oculto');
    el.style.display = 'block';

    // Espera una renderización antes de forzar la animación
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.body.style.overflow = calcularOverflow() ? 'auto' : 'hidden';
  }
}

export function ocultarElemento(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.classList.add('transicion', 'oculto');
    el.classList.remove('visible');
    setTimeout(() => {
      el.style.display = 'none';
      document.body.style.overflow = calcularOverflow() ? 'auto' : 'hidden';
    }, 300);
  }
}

function calcularOverflow() {
  return [...document.querySelectorAll('.visible')].some(el => el.scrollHeight > window.innerHeight);
}
