'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const section4 = document.querySelector('#section--4');
const sections = document.querySelectorAll('.section');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    if (event.target.classList.contains('nav__link')) {
      // for eliminate the event on parent element
      document
        .querySelector(event.target.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });

      console.log(event.target.getAttribute('href'));
    }
  });

tabsContainer.addEventListener('click', function (event) {
  event.preventDefault();
  const clicked = event.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked?.classList.add('operations__tab--active');

  document
    .querySelectorAll(`.operations__content`)
    .forEach(content =>
      content.classList.remove('operations__content--active')
    );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (event, opacity) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element != link) element.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', event => handleHover(event, 0.5));

nav.addEventListener('mouseout', event => handleHover(event, 1));

const initialCoords = section1.getBoundingClientRect();

const stickyNav = function (entries) {
  const entry = entries[0];
  if (entry.isIntersecting === false) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});

headerObserver.observe(header);

const sectionHide = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
};

const sectionObserver = new IntersectionObserver(sectionHide, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function (event) {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
imgTarget.forEach(img => imgObserver.observe(img));

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
