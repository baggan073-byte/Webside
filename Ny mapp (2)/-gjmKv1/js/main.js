const contentUrl = '../data/site_content.json'.replace('..', '.');

const state = {
  menuOpen: false
};

async function loadContent() {
  const response = await fetch(contentUrl);
  if (!response.ok) {
    throw new Error('Kunde inte läsa innehåll');
  }
  return response.json();
}

function createNavLinks(items, container, closeMenuOnClick = false) {
  container.innerHTML = items.map((item) => (
    `<a class="nav-link" href="${item.href}">${item.label}</a>`
  )).join('');

  if (closeMenuOnClick) {
    container.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMobileMenu(false);
      });
    });
  }
}

function createSolutions(items) {
  const grid = document.getElementById('solutions-grid');
  grid.innerHTML = items.map((item) => (
    `<article class="solution-card reveal">
      <div class="card-icon"><i data-lucide="${item.icon}"></i></div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-text">${item.text}</p>
    </article>`
  )).join('');
}

function createReasons(items) {
  const grid = document.getElementById('reasons-list');
  grid.innerHTML = items.map((item) => (
    `<article class="reason-card reveal">
      <div class="card-icon"><i data-lucide="${item.icon}"></i></div>
      <p class="reason-text">${item.text}</p>
    </article>`
  )).join('');
}

function createReviews(items) {
  const grid = document.getElementById('reviews-grid');
  grid.innerHTML = items.map((item) => (
    `<article class="review-card reveal">
      <div class="review-stars">★★★★★</div>
      <p class="review-quote">"${item.quote}"</p>
      <span class="review-author">– ${item.author}</span>
    </article>`
  )).join('');
}

function createContact(contact) {
  const el = document.getElementById('contact-details');
  el.innerHTML = `
    <div class="contact-item">
      <strong>${contact.company}</strong>
      Org.nr: ${contact.org}
    </div>
    <div class="contact-item">
      <strong>Telefon</strong>
      <a href="tel:${contact.phone.replaceAll(' ', '')}">${contact.phone}</a>
    </div>
    <div class="contact-item">
      <strong>Adress</strong>
      <span>${contact.address}</span>
    </div>
  `;
}

function setMobileMenu(open) {
  state.menuOpen = open;
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('menu-toggle');
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
}

function initMenu() {
  const toggle = document.getElementById('menu-toggle');
  toggle.addEventListener('click', () => {
    setMobileMenu(!state.menuOpen);
  });
}

function initHeader() {
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 16);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const emailPattern = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      status.textContent = 'Vänligen fyll i alla fält.';
      return;
    }

    if (!emailPattern.test(email)) {
      status.textContent = 'Ange en giltig e-postadress.';
      return;
    }

    status.textContent = 'Tack! Ditt meddelande är redo att skickas. Kontakta gärna Spirec AB direkt via telefon för snabbast svar.';
    form.reset();
  });
}

function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.hero-copy', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.to('.hero-stat-card', {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.18,
    ease: 'power3.out'
  });

  gsap.utils.toArray('.content-section .reveal').forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%'
      }
    });
  });
}

async function init() {
  try {
    const data = await loadContent();
    createNavLinks(data.navigation, document.getElementById('nav-links'));
    createNavLinks(data.navigation, document.getElementById('mobile-nav-links'), true);
    createSolutions(data.solutions);
    createReasons(data.reasons);
    createReviews(data.reviews);
    createContact(data.contact);
    initMenu();
    initHeader();
    initForm();
    if (window.lucide) {
      lucide.createIcons();
    }
    initAnimations();
  } catch (error) {
    console.error(error);
  }
}

init();
