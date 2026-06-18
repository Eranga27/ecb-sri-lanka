document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Counter Animation
        if (entry.target.classList.contains('stat-card') && !entry.target.dataset.animated) {
          const numberElement = entry.target.querySelector('.stat-number');
          const targetValue = parseInt(numberElement.dataset.target);
          animateValue(numberElement, 0, targetValue, 2000);
          entry.target.dataset.animated = true;
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .stat-card').forEach(el => {
    observer.observe(el);
  });

  // Number animation function
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      let currentValue = Math.floor(easeOutQuart * (end - start) + start);
      
      // Add '+' for numbers over 1000 or specific format if needed
      if(end > 100) {
          obj.innerHTML = currentValue + "+";
      } else {
          obj.innerHTML = currentValue;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
});
