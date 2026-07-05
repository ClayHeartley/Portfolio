const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const progressBar = document.getElementById('progressBar');
const glow = document.querySelector('.cursor-glow');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  themeToggle.textContent = body.classList.contains('light') ? '☀' : '☾';
});

document.addEventListener('mousemove', (event) => {
  glow.style.left = event.clientX + 'px';
  glow.style.top = event.clientY + 'px';
});

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrollTop / height) * 100}%`;
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealElements.forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('.counter');
let counted = false;
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || counted) return;
    counted = true;
    counters.forEach(counter => {
      const target = Number(counter.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 80);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString() + (target === 8735 || target === 1500 ? '+' : '');
          clearInterval(timer);
        } else {
          counter.textContent = current.toLocaleString();
        }
      }, 18);
    });
  });
}, { threshold: 0.3 });
const metrics = document.querySelector('.metrics-strip');
if (metrics) counterObserver.observe(metrics);

// UAlbany Athletics carousel
const athleticsSlides = document.querySelectorAll('.athletics-carousel .carousel-slide');
const athleticsPrev = document.getElementById('athleticsPrev');
const athleticsNext = document.getElementById('athleticsNext');
const athleticsDots = document.getElementById('athleticsDots');
let athleticsIndex = 0;
let athleticsTimer;

function showAthleticsSlide(index) {
  if (!athleticsSlides.length) return;
  athleticsIndex = (index + athleticsSlides.length) % athleticsSlides.length;
  athleticsSlides.forEach((slide, i) => slide.classList.toggle('active', i === athleticsIndex));
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => dot.classList.toggle('active', i === athleticsIndex));
}

function startAthleticsCarousel() {
  clearInterval(athleticsTimer);
  athleticsTimer = setInterval(() => showAthleticsSlide(athleticsIndex + 1), 4500);
}

if (athleticsSlides.length && athleticsDots) {
  athleticsSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to athletics image ${i + 1}`);
    dot.addEventListener('click', () => { showAthleticsSlide(i); startAthleticsCarousel(); });
    athleticsDots.appendChild(dot);
  });
  athleticsPrev?.addEventListener('click', () => { showAthleticsSlide(athleticsIndex - 1); startAthleticsCarousel(); });
  athleticsNext?.addEventListener('click', () => { showAthleticsSlide(athleticsIndex + 1); startAthleticsCarousel(); });
  document.querySelector('.athletics-carousel')?.addEventListener('mouseenter', () => clearInterval(athleticsTimer));
  document.querySelector('.athletics-carousel')?.addEventListener('mouseleave', startAthleticsCarousel);
  startAthleticsCarousel();
}
