/**
 * NPC VIETNAM - OFFICIAL CHAMPIONSHIP SCRIPT
 * Pure Vanilla JavaScript (ES6+) - Zero External Libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initStickyHeader();
  initMobileMenu();
  initScrollSpy();
  initIntersectionObserver();
  initCounters();
  initCountdownTimer();
  initLightboxGallery();
  initRegistrationForm();
  initBackToTop();
  initVideoModal();
  initFaqAccordion();
  initHeroSlideshow();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile a');

  if (!hamburgerBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    navMenu.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. ACTIVE NAV SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.animate-on-scroll');

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers without observer
    revealElements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter');
  if (!counterElements.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = currentVal.toLocaleString('vi-VN');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('vi-VN');
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach((el) => counterObserver.observe(el));
  } else {
    counterElements.forEach((el) => animateCounter(el));
  }
}

/* ==========================================================================
   6. LIVE EVENT COUNTDOWN TIMER
   ========================================================================== */
function initCountdownTimer() {
  const clock = document.getElementById('countdownClock');
  if (!clock) return;

  const targetDateStr = clock.getAttribute('data-target-date') || '2026-10-03T08:00:00+07:00';
  let targetTime = new Date(targetDateStr).getTime();

  // If target date is past or invalid, set to 60 days ahead as safe live demo
  if (isNaN(targetTime) || targetTime <= Date.now()) {
    targetTime = Date.now() + 60 * 24 * 60 * 60 * 1000;
  }

  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

  const updateClock = () => {
    const now = Date.now();
    const distance = targetTime - now;

    if (distance <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    elDays.textContent = padZero(days);
    elHours.textContent = padZero(hours);
    elMinutes.textContent = padZero(minutes);
    elSeconds.textContent = padZero(seconds);
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   7. LIGHTBOX GALLERY
   ========================================================================== */
function initLightboxGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;
  const itemsData = [];

  galleryItems.forEach((item, index) => {
    const src = item.getAttribute('data-src');
    const caption = item.getAttribute('data-caption') || '';
    itemsData.push({ src, caption });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  const renderItem = (index) => {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const isEn = document.documentElement.lang === 'en';
    const itemEl = galleryItems[currentIndex];
    const src = itemEl.getAttribute('data-src');
    const caption = (isEn ? itemEl.getAttribute('data-caption-en') : itemEl.getAttribute('data-caption')) || itemEl.getAttribute('data-caption') || '';

    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  };

  const openLightbox = (index) => {
    renderItem(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const prevItem = () => renderItem(currentIndex - 1);
  const nextItem = () => renderItem(currentIndex + 1);

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevItem);
  if (lightboxNext) lightboxNext.addEventListener('click', nextItem);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevItem();
    if (e.key === 'ArrowRight') nextItem();
  });
}

/* ==========================================================================
   8. REGISTRATION FORM SIMULATION
   ========================================================================== */
function initRegistrationForm() {
  // Registration form replaced by static services/payment block — no form logic needed.
  return;
  /* eslint-disable no-unreachable */
  const form = document.getElementById('registerForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const division = document.getElementById('divisionSelect')?.value;
    const agreed = document.getElementById('agreeRules')?.checked;

    if (!fullName || !phone || !email || !division || !agreed) {
      const isEn = document.documentElement.lang === 'en';
      showFeedback(
        isEn
          ? 'Please fill in all required fields and accept the competition regulations!'
          : 'Vui lòng điền đầy đủ các thông tin bắt buộc và chấp thuận điều lệ!',
        'error'
      );
      return;
    }

    // Success response
    const isEn = document.documentElement.lang === 'en';
    showFeedback(
      isEn
        ? `Congratulations <strong>${fullName}</strong>! You have successfully registered for <strong>${division.toUpperCase()}</strong>. The NPC Vietnam Secretariat will contact you via phone ${phone} within 24h to verify your submission.`
        : `Chúc mừng <strong>${fullName}</strong>! Bạn đã đăng ký sơ bộ thành công cho hạng mục <strong>${division.toUpperCase()}</strong>. Ban thư ký NPC Vietnam sẽ liên hệ qua SĐT ${phone} trong vòng 24h để xác nhận hồ sơ.`,
      'success'
    );
    form.reset();
  });

  function showFeedback(message, type) {
    if (!feedback) return;
    feedback.innerHTML = message;
    feedback.className = `form-feedback ${type}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    },
    { passive: true }
  );

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ==========================================================================
   10. VIDEO TEASER MODAL
   ========================================================================== */
function initVideoModal() {
  const playBtn = document.getElementById('playVideoBtn');
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('videoModalClose');
  const backdrop = document.getElementById('videoModalBackdrop');
  const video = document.getElementById('teaserVideo');

  if (!playBtn || !modal || !video) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    video.pause();
  };

  playBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   11. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open FAQs
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          const otherAns = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   12. BILINGUAL LANGUAGE SWITCHER (VI / EN)
   ========================================================================== */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  if (!langButtons.length) return;

  // Get saved language or fallback to Vietnamese
  let currentLang = localStorage.getItem('npc_lang') || 'vi';

  function applyLanguage(lang) {
    if (!window.i18nData || !window.i18nData[lang]) return;

    const dict = window.i18nData[lang];

    // 1. Update content of data-i18n elements (support HTML tags like <strong>)
    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // 2. Update placeholders of data-i18n-ph elements
    const placeholderElements = document.querySelectorAll('[data-i18n-ph]');
    placeholderElements.forEach((el) => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // 3. Update HTML lang attribute
    document.documentElement.lang = lang;

    // 4. Update active button state on all switchers (desktop & mobile)
    langButtons.forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 5. Persist to localStorage
    localStorage.setItem('npc_lang', lang);
  }

  // Bind click event listeners to all lang buttons
  langButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetBtn = e.target.closest('.lang-btn') || btn;
      const selectedLang = targetBtn.getAttribute('data-lang');
      if (selectedLang) {
        applyLanguage(selectedLang);
      }
    });
  });

  // Apply initially (in case user already selected EN previously)
  if (currentLang !== 'vi') {
    applyLanguage(currentLang);
  }
}

/* ==========================================================================
   HERO SLIDER - PROFESSIONAL
   ========================================================================== */
function initHeroSlideshow() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const hero = slider.closest('.hero');
  const track = slider.querySelector('.hero-slider-track');
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = hero.querySelectorAll('.slider-dot');
  const prevBtn = hero.querySelector('.slider-prev');
  const nextBtn = hero.querySelector('.slider-next');
  const progressBar = hero.querySelector('.slider-progress-bar');

  let current = 0;
  const total = slides.length;
  let autoplayTimer = null;
  let progressInterval = null;
  const AUTOPLAY_DELAY = 6000;
  let progress = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetProgress() {
    progress = 0;
    progressBar.style.width = '0%';
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      progress += 100 / (AUTOPLAY_DELAY / 50);
      progressBar.style.width = progress + '%';
    }, 50);
  }

  function startAutoplay() {
    stopAutoplay();
    resetProgress();
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    clearInterval(progressInterval);
  }

  prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });

  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);

  let touchStartX = 0;
  hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
  hero.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}
