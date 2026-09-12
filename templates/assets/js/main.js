/**
 * Intyfe Marketplace - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('is-open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('is-open');
      }
    });
  }

  // 2. Tab Switchers
  const tabContainers = document.querySelectorAll('.tabs-container, .woocommerce-tabs, .auth-container');
  tabContainers.forEach((container) => {
    const titles = container.querySelectorAll('.tab-title, .tab-btn, .auth-tab-btn');
    const panes = container.querySelectorAll('.tab-pane, .auth-pane');

    titles.forEach((title, index) => {
      title.addEventListener('click', () => {
        titles.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        title.classList.add('active');
        if (panes[index]) {
          panes[index].classList.add('active');
        }
      });
    });
  });

  // 3. Product Gallery Image Switcher
  const thumbItems = document.querySelectorAll('.product-thumb-item');
  const mainImage = document.querySelector('.product-main-image img');

  if (thumbItems.length > 0 && mainImage) {
    thumbItems.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbItems.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const newSrc = thumb.getAttribute('data-img-src') || thumb.querySelector('img').src;
        mainImage.src = newSrc;
      });
    });
  }

  // 4. Quantity Increment/Decrement
  const quantityPickers = document.querySelectorAll('.quantity-picker');
  quantityPickers.forEach(picker => {
    const minusBtn = picker.querySelector('.quantity-btn.minus');
    const plusBtn = picker.querySelector('.quantity-btn.plus');
    const input = picker.querySelector('.quantity-input');

    if (input) {
      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          let val = parseInt(input.value, 10) || 1;
          if (val > 1) {
            input.value = val - 1;
            input.dispatchEvent(new Event('change'));
          }
        });
      }
      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          let val = parseInt(input.value, 10) || 1;
          input.value = val + 1;
          input.dispatchEvent(new Event('change'));
        });
      }
    }
  });

  // 5. Sticky Header Scroll Effect
  const headerPill = document.querySelector('.header-pill-inner');
  if (headerPill) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        headerPill.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
        headerPill.style.borderColor = 'rgba(216, 19, 149, 0.3)';
      } else {
        headerPill.style.backgroundColor = 'rgba(10, 10, 10, 0.85)';
        headerPill.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    });
  }

  // 6. Simple Toast Notification helper
  window.showToast = function (message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #151515;
      border: 1px solid var(--gl-primary);
      color: #fff;
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 0.9rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(216,19,149,0.3);
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };
});
