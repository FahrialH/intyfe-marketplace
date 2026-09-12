/**
 * Intyfe Marketplace - Interactive Slider & Progress Bar
 */

class IntyfeSlider {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.track = this.container.querySelector('.slider-track');
    this.slides = Array.from(this.track.children);
    this.prevBtn = this.container.closest('.section')?.querySelector('.arrow-prev') || this.container.querySelector('.arrow-prev');
    this.nextBtn = this.container.closest('.section')?.querySelector('.arrow-next') || this.container.querySelector('.arrow-next');
    this.progressBar = this.container.closest('.section')?.querySelector('.progress-bar') || this.container.querySelector('.progress-bar');

    this.currentIndex = 0;
    this.options = Object.assign({
      gap: 24,
      perPageDesktop: 3,
      perPageTablet: 2,
      perPageMobile: 1
    }, options);

    this.init();
  }

  getVisibleSlidesCount() {
    const width = window.innerWidth;
    if (width <= 767) return this.options.perPageMobile;
    if (width <= 991) return this.options.perPageTablet;
    return this.options.perPageDesktop;
  }

  getMaxIndex() {
    const visibleCount = this.getVisibleSlidesCount();
    return Math.max(0, this.slides.length - visibleCount);
  }

  init() {
    if (this.slides.length === 0) return;

    this.updateLayout();

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    window.addEventListener('resize', () => {
      this.updateLayout();
      this.goTo(this.currentIndex);
    });

    // Touch & Swipe Support
    let startX = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (diff > 50) this.next();
      else if (diff < -50) this.prev();
      isDragging = false;
    });
  }

  updateLayout() {
    const visibleCount = this.getVisibleSlidesCount();
    const gap = this.options.gap;
    const containerWidth = this.container.offsetWidth;
    const slideWidth = (containerWidth - (gap * (visibleCount - 1))) / visibleCount;

    this.slides.forEach(slide => {
      slide.style.minWidth = `${slideWidth}px`;
      slide.style.maxWidth = `${slideWidth}px`;
      slide.style.flexShrink = '0';
    });

    this.updateProgress();
  }

  goTo(index) {
    const maxIndex = this.getMaxIndex();
    this.currentIndex = Math.max(0, Math.min(index, maxIndex));

    const visibleCount = this.getVisibleSlidesCount();
    const gap = this.options.gap;
    const containerWidth = this.container.offsetWidth;
    const slideWidth = (containerWidth - (gap * (visibleCount - 1))) / visibleCount;
    const offset = this.currentIndex * (slideWidth + gap);

    this.track.style.transform = `translateX(-${offset}px)`;
    this.updateProgress();
  }

  next() {
    const maxIndex = this.getMaxIndex();
    if (this.currentIndex < maxIndex) {
      this.goTo(this.currentIndex + 1);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  updateProgress() {
    const maxIndex = this.getMaxIndex();

    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
      this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.4' : '1';
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
      this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.4' : '1';
    }

    if (this.progressBar) {
      const percentage = maxIndex > 0 ? ((this.currentIndex + 1) / (maxIndex + 1)) * 100 : 100;
      this.progressBar.style.width = `${Math.min(100, Math.max(10, percentage))}%`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider-container');
  sliders.forEach(slider => new IntyfeSlider(slider));
});
