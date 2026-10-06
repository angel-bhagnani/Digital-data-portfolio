/**
 * PORTFOLIO JAVASCRIPT - ANGEL BHAGNANI
 * B.Tech Computer Science | JECRC University, Jaipur
 * Clean, lightweight, modular & zero-dependency
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // ========================================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // ========================================================
  // 2. MOBILE NAVIGATION MENU
  // ========================================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ========================================================
  // 3. HEADER SCROLL EFFECT & ACTIVE NAVIGATION SPY
  // ========================================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header blur/compact on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Spy
    let currentSectionId = '';
    const scrollPosition = scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top scroll handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================================
  // 4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ========================================================
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered reveal for smooth aesthetic
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, index * 40);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  // ========================================================
  // 5. COPY EMAIL FUNCTIONALITY
  // ========================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailPlaceholder = document.getElementById('emailPlaceholder');

  if (copyEmailBtn && emailPlaceholder) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailText = emailPlaceholder.textContent.trim();
      
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailText);
        } else {
          // Fallback selection copy
          const tempInput = document.createElement('textarea');
          tempInput.value = emailText;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('Email address copied to clipboard!');
      } catch (err) {
        showToast('Could not copy email automatically');
      }
    });
  }

  // ========================================================
  // 6. CONTACT FORM VALIDATION & INTERACTIVE SUBMIT
  // ========================================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Clear previous error states
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (input && input.parentElement) {
          input.parentElement.classList.remove('has-error');
        }
      });

      // Name validation
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Subject validation
      if (!subjectInput.value.trim()) {
        subjectInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Message validation
      if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        const originalBtnHTML = submitBtn.innerHTML;

        // Button sending state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          showToast('Thank you! Your message has been recorded.');
        }, 800);
      }
    });

    // Remove error class on input
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', () => {
        if (input.parentElement) {
          input.parentElement.classList.remove('has-error');
        }
      });
    });
  }

  // ========================================================
  // 7. TOAST NOTIFICATION UTILITY
  // ========================================================
  let toastTimeout;
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ========================================================
  // 8. DYNAMIC COPYRIGHT YEAR
  // ========================================================
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
