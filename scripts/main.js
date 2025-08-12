// Main JS for Nakedi Physiotherapy Homepage
// Add interactivity here if needed

document.addEventListener('DOMContentLoaded', function() {
  // Example: Smooth scroll for nav links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
