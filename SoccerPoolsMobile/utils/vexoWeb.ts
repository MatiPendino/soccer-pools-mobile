
export function vexoWeb() {
  if (typeof document === 'undefined') return;          
  if (document.querySelector('script[data-vexo]')) return; // Avoid duplicates

  const script = document.createElement('script');
  script.src = 'https://www.vexo.co/analytics.js';
  script.defer = true;
  document.head.appendChild(script);
}
