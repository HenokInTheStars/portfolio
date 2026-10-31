/**
 * Technical Editorial - Work Page Interactions
 * Deep dive architectural breakdown toggles and category filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  initDeepDiveToggles();
  initCategoryFilters();
});

function initDeepDiveToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-btn');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const icon = btn.querySelector('.toggle-icon');
      const label = btn.querySelector('.toggle-label');

      if (!content) return;

      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        content.classList.add('flex');
        if (icon) icon.style.transform = 'rotate(180deg)';
        if (label) label.textContent = 'HIDE DEEP DIVE';
      } else {
        content.classList.add('hidden');
        content.classList.remove('flex');
        if (icon) icon.style.transform = 'rotate(0deg)';
        if (label) label.textContent = 'VIEW DEEP DIVE';
      }
    });
  });
}

function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button visual states
      filterButtons.forEach(b => {
        b.classList.remove('bg-on-surface', 'text-inverse-on-surface');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-on-surface', 'text-inverse-on-surface');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

      // Filter project cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
