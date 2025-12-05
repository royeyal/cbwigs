/**
 * Display Count
 * Counts items in a group and displays the count in associated elements
 */

export function initDisplayCount() {
  // Find all count groups
  const groups = document.querySelectorAll('[data-count-group]');

  // Early return if no groups exist
  if (!groups.length) {
    return;
  }

  groups.forEach(group => {
    const name = group.dataset.countGroup;

    // Skip if group has no name attribute
    if (!name) {
      console.warn(
        'Display count group found without data-count-group name:',
        group
      );
      return;
    }

    // Count items within this group
    const items = group.querySelectorAll('[data-count-item]');
    const count = items.length;

    // Find all display elements for this group name
    const displays = document.querySelectorAll(
      `[data-count-display="${name}"]`
    );

    // Update all display elements
    if (displays.length) {
      displays.forEach(display => {
        display.textContent = count;
      });
    } else {
      console.warn(`No display elements found for count group "${name}"`);
    }
  });
}
