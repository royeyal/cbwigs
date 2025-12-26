/**
 * Initialize leading zero formatter for accordion item counts
 * Adds leading zeros to single-digit numbers (1 → 01, 2 → 02, etc.)
 * Only runs if accordion count elements exist
 */
export function initLeadingZero() {
  const countElements = document.querySelectorAll('.accordion-css__item-count');

  if (countElements.length === 0) return;

  countElements.forEach(el => {
    const num = parseInt(el.textContent.trim(), 10);
    if (!isNaN(num) && num < 10) {
      el.textContent = num.toString().padStart(2, '0');
    }
  });
}
