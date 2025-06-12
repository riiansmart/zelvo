document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.feature-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 10; // Max 10 degrees
      const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees

      // Calculate pointer distance from center for intensity
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const pointerFromCenter = distance / maxDistance;

      // Update CSS variables
      card.style.setProperty('--card-rotate-x', `${rotateX}deg`);
      card.style.setProperty('--card-rotate-y', `${rotateY}deg`);
      card.style.setProperty('--card-angle', `${Math.atan2(dy, dx)}rad`);
      card.style.setProperty('--card-pointer-from-center', pointerFromCenter);
    });

    card.addEventListener('mouseleave', () => {
      // Reset transforms
      card.style.setProperty('--card-rotate-x', '0deg');
      card.style.setProperty('--card-rotate-y', '0deg');
      card.style.setProperty('--card-angle', '0deg');
      card.style.setProperty('--card-pointer-from-center', '0');
    });
  });
}); 