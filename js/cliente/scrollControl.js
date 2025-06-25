export function activarScroll() {
  document.body.classList.remove('sin-scroll');
  document.body.classList.add('con-scroll');
}

export function desactivarScroll() {
  document.body.classList.remove('con-scroll');
  document.body.classList.add('sin-scroll');
}
