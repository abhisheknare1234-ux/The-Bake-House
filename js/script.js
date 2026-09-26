/* =========================================================
   THE BAKE HOUSE PUNE — Shared frontend behaviour
   No backend / no storage — everything resolves client-side.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile navigation ---------- */
  var hamburger = document.querySelector('.hamburger');
  var navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.classList.toggle('is-active', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal (single orchestrated pass, not per-card noise) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  window.showToast = function (message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 3200);
  };

  /* ---------- Category / menu filtering ---------- */
  var filterChips = document.querySelectorAll('[data-filter-chip]');
  var filterItems = document.querySelectorAll('[data-filter-item]');
  if (filterChips.length && filterItems.length) {
    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterChips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var target = chip.getAttribute('data-filter-chip');
        filterItems.forEach(function (item) {
          var cats = (item.getAttribute('data-filter-item') || '').split(' ');
          var show = target === 'all' || cats.indexOf(target) !== -1;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Generic form validation helper ---------- */
  function validateField(field) {
    var wrap = field.closest('.field');
    var errorEl = wrap ? wrap.querySelector('.field-error') : null;
    var message = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      message = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim()) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) message = 'Enter a valid email address.';
    } else if (field.type === 'tel' && field.value.trim()) {
      var phonePattern = /^[0-9+\-\s]{7,15}$/;
      if (!phonePattern.test(field.value.trim())) message = 'Enter a valid phone number.';
    }

    if (wrap) wrap.classList.toggle('error', !!message);
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  function bindFormValidation(form) {
    if (!form) return;
    var fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (valid) {
        var successMessage = form.getAttribute('data-success') || 'Thank you! We have received your message.';
        window.showToast(successMessage);
        form.reset();
        fields.forEach(function (field) {
          var wrap = field.closest('.field');
          if (wrap) wrap.classList.remove('error');
        });
      } else {
        window.showToast('Please check the highlighted fields.');
      }
    });
  }

  bindFormValidation(document.getElementById('contact-form'));
  bindFormValidation(document.getElementById('custom-cake-form'));
  bindFormValidation(document.getElementById('newsletter-form'));

  /* ---------- Order Now quick action (frontend-only) ---------- */
  document.querySelectorAll('[data-order-btn]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item = btn.getAttribute('data-order-btn');
      window.showToast('"' + item + '" added — we will confirm over WhatsApp shortly!');
    });
  });

});
