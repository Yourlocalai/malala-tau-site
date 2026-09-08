const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const revealItems = document.querySelectorAll('.reveal');
const filterSelects = document.querySelectorAll('[data-filter]');
const tourCards = document.querySelectorAll('.tour-card');
const experienceDialog = document.querySelector('#experience-detail');
const experienceLinks = document.querySelectorAll('.experience-link');
const bookingForm = document.querySelector('#booking-form');
const contactForm = document.querySelector('#contact-form');
const registrationForm = document.querySelector('#registration-form');
const shuttleBookingForm = document.querySelector('#shuttle-booking-form');
const shuttleVehicle = document.querySelector('#shuttle-vehicle');
const shuttleEstimate = document.querySelector('#shuttle-estimate');
const heroSlides = document.querySelectorAll('.hero-slide');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);

const scrollItems = document.querySelectorAll(
  '.feature-grid > *, .tour-grid > *, .destination-grid > *, .wellness-grid > *, .story-highlights > *'
);

scrollItems.forEach((item, index) => {
  item.classList.add('scroll-item');
  item.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 90}ms`);
});

let lastScrollY = window.scrollY;
let scrollTicking = false;

const updateScrollEffects = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);

  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
    header.classList.toggle('scrolling-up', window.scrollY < lastScrollY && window.scrollY > 120);
  }

  if (!motionQuery.matches) {
    const heroMedia = document.querySelector('.hero-media');
    if (heroMedia && window.scrollY < window.innerHeight) {
      heroMedia.style.transform = `scale(1.08) translateY(${window.scrollY * 0.08}px)`;
    }
  }

  lastScrollY = window.scrollY;
  scrollTicking = false;
};

const requestScrollUpdate = () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollEffects);
    scrollTicking = true;
  }
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 20);
};

setHeaderState();
updateScrollEffects();
window.addEventListener('scroll', requestScrollUpdate, { passive: true });

if (heroSlides.length > 1 && !motionQuery.matches) {
  let activeSlide = 0;
  window.setInterval(() => {
    heroSlides[activeSlide].classList.remove('is-active');
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add('is-active');
  }, 6500);
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('is-open');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    });
  });
}

const closeExperienceDialog = () => {
  if (experienceDialog?.open) experienceDialog.close();
};

experienceLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const card = link.closest('.tour-card');
    if (!card || !experienceDialog) return;

    const title = card.querySelector('h3')?.textContent.trim() || 'Experience details';
    const description = card.querySelector('p')?.textContent.trim() || '';
    const destination = card.querySelector('.badge')?.textContent.trim() || '';
    const meta = [...card.querySelectorAll('.tour-meta span')].map((item) => item.textContent.trim());

    document.querySelector('#detail-title').textContent = title;
    document.querySelector('#detail-description').textContent = description;
    document.querySelector('#detail-destination').textContent = destination;
    document.querySelector('#detail-duration').textContent = meta[0] || '';
    document.querySelector('#detail-price').textContent = meta[1] || '';
    document.querySelector('#booking-experience').value = title;
    document.querySelector('[name="subject"]').value = `Booking enquiry: ${title}`;
    bookingForm?.querySelector('.booking-success')?.setAttribute('hidden', '');
    experienceDialog.showModal();
  });
});

experienceDialog?.addEventListener('click', (event) => {
  if (event.target === experienceDialog) closeExperienceDialog();
});
experienceDialog?.querySelector('.dialog-close')?.addEventListener('click', closeExperienceDialog);
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const experience = formData.get('experience') || 'Website booking enquiry';
  const subject = formData.get('subject') || `Booking enquiry: ${experience}`;
  const message = [
    `Experience: ${experience}`,
    `Name: ${formData.get('name') || ''}`,
    `Email: ${formData.get('email') || ''}`,
    `Country: ${formData.get('country') || ''}`,
    `Contact number: ${formData.get('phone') || ''}`,
    `Adults: ${formData.get('adults') || ''}`,
    `Children: ${formData.get('children') || ''}`,
    '',
    'Message:',
    formData.get('message') || '',
  ].join('\n');

  window.location.href = `mailto:info@malala-tau.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const topic = formData.get('topic') || 'General enquiry';
  const message = [
    `Full name: ${formData.get('fullName') || ''}`,
    `Email address: ${formData.get('email') || ''}`,
    `Contact number: ${formData.get('phone') || ''}`,
    `Company / organisation: ${formData.get('company') || ''}`,
    `What is this about?: ${topic}`,
    `Group size: ${formData.get('groupSize') || ''}`,
    '',
    'Message:',
    formData.get('message') || '',
  ].join('\n');

  window.location.href = `mailto:info@malala-tau.co.za?subject=${encodeURIComponent(`Website enquiry: ${topic}`)}&body=${encodeURIComponent(message)}`;
});

registrationForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(registrationForm);
  const message = [
    `First name: ${formData.get('firstName') || ''}`,
    `Surname: ${formData.get('surname') || ''}`,
    `Email address: ${formData.get('email') || ''}`,
    `Mobile number: ${formData.get('mobile') || ''}`,
    `ID / passport number: ${formData.get('identity') || ''}`,
    `Town / city: ${formData.get('city') || ''}`,
    `Programme: ${formData.get('programme') || ''}`,
    `Preferred intake: ${formData.get('intake') || ''}`,
    `Study mode: ${formData.get('studyMode') || ''}`,
    '',
    'Anything we should know:',
    formData.get('notes') || '',
  ].join('\n');

  window.location.href = `mailto:info@malala-tau.co.za?subject=${encodeURIComponent(`Academy registration: ${formData.get('programme') || 'New registration'}`)}&body=${encodeURIComponent(message)}`;
});

shuttleVehicle?.addEventListener('change', () => {
  shuttleEstimate.textContent = shuttleVehicle.value ? 'Enter addresses to confirm your quote' : 'Enter addresses & select vehicle';
});

shuttleBookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(shuttleBookingForm);
  const message = [
    `First name: ${formData.get('firstName') || ''}`,
    `Surname: ${formData.get('surname') || ''}`,
    `Email address: ${formData.get('email') || ''}`,
    `Phone number: ${formData.get('phone') || ''}`,
    `Pickup address: ${formData.get('pickup') || ''}`,
    `Drop-off address: ${formData.get('dropoff') || ''}`,
    `Vehicle type: ${formData.get('vehicle') || ''}`,
    '',
    'Additional notes:',
    formData.get('notes') || '',
  ].join('\n');

  window.location.href = `mailto:info@malala-tau.co.za?subject=${encodeURIComponent('Shuttle booking request')}&body=${encodeURIComponent(message)}`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));
scrollItems.forEach((item) => observer.observe(item));

if (!motionQuery.matches) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const filterTours = () => {
  const selected = {};
  filterSelects.forEach((select) => {
    selected[select.dataset.filter] = select.value;
  });

  let visibleCount = 0;

  tourCards.forEach((card) => {
    const destination = card.dataset.destination;
    const type = card.dataset.type;
    const price = Number(card.dataset.price);
    const duration = Number(card.dataset.duration);
    const name = card.dataset.name || card.querySelector('h3')?.textContent.toLowerCase() || '';

    const matchesDestination = selected.destination === 'all' || destination === selected.destination;
    const matchesType = selected.type === 'all' || type === selected.type;

    let matchesPrice = true;
    if (selected.price === 'under-5000') matchesPrice = price < 5000;
    if (selected.price === '5000-10000') matchesPrice = price >= 5000 && price <= 10000;
    if (selected.price === 'over-10000') matchesPrice = price > 10000;

    let matchesDuration = true;
    if (selected.duration === 'one-day') matchesDuration = duration === 1;
    if (selected.duration === 'two-three-days') matchesDuration = duration >= 2 && duration <= 3;
    if (selected.duration === 'four-plus-days') matchesDuration = duration >= 4;

    const matches = matchesDestination && matchesType && matchesPrice && matchesDuration;
    card.classList.toggle('hidden', !matches);

    if (matches) visibleCount += 1;
  });

  const grid = document.querySelector('#tour-grid');
  if (grid && visibleCount === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No experiences match these filters right now.';
    emptyState.style.gridColumn = '1 / -1';
    emptyState.style.padding = '2rem';
    emptyState.style.textAlign = 'center';
    emptyState.style.color = 'rgba(17,20,18,0.7)';
    emptyState.style.fontWeight = '600';
    grid.appendChild(emptyState);
  } else {
    const emptyState = grid?.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
  }
};

filterSelects.forEach((select) => {
  select.addEventListener('change', () => {
    const sortType = document.querySelector('[data-filter="sort"]')?.value || 'recommended';
    if (sortType !== 'recommended') {
      const grid = document.querySelector('#tour-grid');
      const cards = Array.from(grid.querySelectorAll('.tour-card:not(.hidden)'));
      const sorted = [...cards].sort((a, b) => {
        const aPrice = Number(a.dataset.price);
        const bPrice = Number(b.dataset.price);
        const aDuration = Number(a.dataset.duration);
        const bDuration = Number(b.dataset.duration);
        const aName = (a.dataset.name || '').toLowerCase();
        const bName = (b.dataset.name || '').toLowerCase();

        switch (sortType) {
          case 'price-low':
            return aPrice - bPrice;
          case 'price-high':
            return bPrice - aPrice;
          case 'duration':
            return aDuration - bDuration;
          case 'az':
            return aName.localeCompare(bName);
          default:
            return 0;
        }
      });

      sorted.forEach((card) => grid.appendChild(card));
    }
    filterTours();
  });
});

const sortSelect = document.querySelector('[data-filter="sort"]');
sortSelect?.addEventListener('change', () => {
  const grid = document.querySelector('#tour-grid');
  const cards = Array.from(grid.querySelectorAll('.tour-card'));
  const sortType = sortSelect.value;

  cards.sort((a, b) => {
    const aPrice = Number(a.dataset.price);
    const bPrice = Number(b.dataset.price);
    const aDuration = Number(a.dataset.duration);
    const bDuration = Number(b.dataset.duration);
    const aName = (a.dataset.name || '').toLowerCase();
    const bName = (b.dataset.name || '').toLowerCase();

    switch (sortType) {
      case 'price-low':
        return aPrice - bPrice;
      case 'price-high':
        return bPrice - aPrice;
      case 'duration':
        return aDuration - bDuration;
      case 'az':
        return aName.localeCompare(bName);
      default:
        return 0;
    }
  });

  cards.forEach((card) => grid.appendChild(card));
  filterTours();
});

const forms = document.querySelectorAll('form');
forms.forEach((form) => {
  if (form === bookingForm || form === contactForm || form === registrationForm || form === shuttleBookingForm) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
});

filterTours();
