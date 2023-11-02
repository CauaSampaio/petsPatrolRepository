const carouselContainer = document.querySelector('.carousel-container');
const controls = document.querySelectorAll('.carousel-control');

let slideIndex = 0;

controls[slideIndex].classList.add('active');

controls.forEach((control, index) => {
  control.addEventListener('click', () => {
    slideIndex = index;
    updateCarousel();
  });
});

function updateCarousel() {
  carouselContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

  controls.forEach((control, index) => {
    if (index === slideIndex) {
      control.classList.add('active');
    } else {
      control.classList.remove('active');
    }
  });
}

// Carrossel de cards - eventos
const eventCardContainer = document.getElementById('event-card-container');
const eventCards = eventCardContainer.querySelectorAll('.event-card');

let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 0;

eventCards.forEach((eventCard, index) => {
    eventCard.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPosition = e.clientX - eventCardContainer.getBoundingClientRect().left;
        eventCard.style.cursor = 'grabbing';
    });

    eventCard.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentPosition = e.clientX - eventCardContainer.getBoundingClientRect().left;
        const translate = currentPosition - startPosition;
        currentTranslate = prevTranslate + translate;
        eventCardContainer.style.transform = `translateX(${currentTranslate}px)`;
    });

    eventCard.addEventListener('mouseup', () => {
        isDragging = false;
        eventCard.style.cursor = 'grab';
        prevTranslate = currentTranslate;
        checkBoundaries();
    });

    eventCard.addEventListener('mouseleave', () => {
        isDragging = false;
        eventCard.style.cursor = 'grab';
        prevTranslate = currentTranslate;
        checkBoundaries();
    });
});

function navigate(direction) {
    const eventCardWidth = eventCards[0].offsetWidth + 16; // Incluindo a margem
    const visibleEventCards = Math.floor(eventCardContainer.offsetWidth / eventCardWidth);

    if (direction === 'next') {
        currentIndex = Math.min(currentIndex + 1, eventCards.length - visibleEventCards);
    } else if (direction === 'prev') {
        currentIndex = Math.max(currentIndex - 1, 0);
    }

    currentTranslate = -currentIndex * eventCardWidth;
    eventCardContainer.style.transform = `translateX(${currentTranslate}px)`;
}

function checkBoundaries() {
    const eventCardWidth = eventCards[0].offsetWidth + 16; // Incluindo a margem
    const visibleEventCards = Math.floor(eventCardContainer.offsetWidth / eventCardWidth);
    const maxTranslate = (eventCards.length - visibleEventCards) * eventCardWidth;

    if (currentTranslate > 0) {
        currentTranslate = 0;
    } else if (currentTranslate < -maxTranslate) {
        currentTranslate = -maxTranslate;
    }

    currentIndex = Math.abs(Math.round(currentTranslate / eventCardWidth));
    currentTranslate = -currentIndex * eventCardWidth;

    eventCardContainer.style.transform = `translateX(${currentTranslate}px)`;
}



// Terceiro Carrossel 
const ongCardContainer = document.getElementById('ong-card-container');
const ongCards = ongCardContainer.querySelectorAll('.ong-card');

let isOngDragging = false;
let ongStartPosition = 0;
let ongCurrentTranslate = 0;
let ongPrevTranslate = 0;
let ongCurrentIndex = 0;

ongCards.forEach((ongCard, index) => {
  ongCard.addEventListener('mousedown', (e) => {
    isOngDragging = true;
    ongStartPosition = e.clientX - ongCardContainer.getBoundingClientRect().left;
    ongCard.style.cursor = 'grabbing';
  });

  ongCard.addEventListener('mousemove', (e) => {
    if (!isOngDragging) return;
    const ongCurrentPosition = e.clientX - ongCardContainer.getBoundingClientRect().left;
    const ongTranslate = ongCurrentPosition - ongStartPosition;
    ongCurrentTranslate = ongPrevTranslate + ongTranslate;
    ongCardContainer.style.transform = `translateX(${ongCurrentTranslate}px)`;
  });

  ongCard.addEventListener('mouseup', () => {
    isOngDragging = false;
    ongCard.style.cursor = 'grab';
    ongPrevTranslate = ongCurrentTranslate;
    ongCheckBoundaries();
  });

  ongCard.addEventListener('mouseleave', () => {
    isOngDragging = false;
    ongCard.style.cursor = 'grab';
    ongPrevTranslate = ongCurrentTranslate;
    ongCheckBoundaries();
  });
});

function ongNavigate(direction) {
  const ongCardWidth = ongCards[0].offsetWidth + 16; // Incluindo a margem
  const ongVisibleCards = Math.floor(ongCardContainer.offsetWidth / ongCardWidth);

  if (direction === 'next') {
    ongCurrentIndex = Math.min(ongCurrentIndex + 1, ongCards.length - ongVisibleCards);
  } else if (direction === 'prev') {
    ongCurrentIndex = Math.max(ongCurrentIndex - 1, 0);
  }

  ongCurrentTranslate = -ongCurrentIndex * ongCardWidth;
  ongCardContainer.style.transform = `translateX(${ongCurrentTranslate}px)`;
}

function ongCheckBoundaries() {
  const ongCardWidth = ongCards[0].offsetWidth + 16; // Incluindo a margem
  const ongVisibleCards = Math.floor(ongCardContainer.offsetWidth / ongCardWidth);
  const ongMaxTranslate = (ongCards.length - ongVisibleCards) * ongCardWidth;

  if (ongCurrentTranslate > 0) {
    ongCurrentTranslate = 0;
  } else if (ongCurrentTranslate < -ongMaxTranslate) {
    ongCurrentTranslate = -ongMaxTranslate;
  }

  ongCurrentIndex = Math.abs(Math.round(ongCurrentTranslate / ongCardWidth));
  ongCurrentTranslate = -ongCurrentIndex * ongCardWidth;

  ongCardContainer.style.transform = `translateX(${ongCurrentTranslate}px)`;
}

// Quarto Carrossel 

const animalCardContainer = document.getElementById('animal-card-container');
const animalCards = animalCardContainer.querySelectorAll('.animal-card');

let isAnimalDragging = false;
let animalStartPosition = 0;
let animalCurrentTranslate = 0;
let animalPrevTranslate = 0;
let animalCurrentIndex = 0;

animalCards.forEach((animalCard, index) => {
  animalCard.addEventListener('mousedown', (e) => {
    isAnimalDragging = true;
    animalStartPosition = e.clientX - animalCardContainer.getBoundingClientRect().left;
    animalCard.style.cursor = 'grabbing';
  });

  animalCard.addEventListener('mousemove', (e) => {
    if (!isAnimalDragging) return;
    const animalCurrentPosition = e.clientX - animalCardContainer.getBoundingClientRect().left;
    const animalTranslate = animalCurrentPosition - animalStartPosition;
    animalCurrentTranslate = animalPrevTranslate + animalTranslate;
    animalCardContainer.style.transform = `translateX(${animalCurrentTranslate}px)`;
  });

  animalCard.addEventListener('mouseup', () => {
    isAnimalDragging = false;
    animalCard.style.cursor = 'grab';
    animalPrevTranslate = animalCurrentTranslate;
    animalCheckBoundaries();
  });

  animalCard.addEventListener('mouseleave', () => {
    isAnimalDragging = false;
    animalCard.style.cursor = 'grab';
    animalPrevTranslate = animalCurrentTranslate;
    animalCheckBoundaries();
  });
});

function animalNavigate(direction) {
  const animalCardWidth = animalCards[0].offsetWidth + 16; // Incluindo a margem
  const animalVisibleCards = Math.floor(animalCardContainer.offsetWidth / animalCardWidth);

  if (direction === 'next') {
    animalCurrentIndex = Math.min(animalCurrentIndex + 1, animalCards.length - animalVisibleCards);
  } else if (direction === 'prev') {
    animalCurrentIndex = Math.max(animalCurrentIndex - 1, 0);
  }

  animalCurrentTranslate = -animalCurrentIndex * animalCardWidth;
  animalCardContainer.style.transform = `translateX(${animalCurrentTranslate}px)`;
}

function animalCheckBoundaries() {
  const animalCardWidth = animalCards[0].offsetWidth + 16; // Incluindo a margem
  const animalVisibleCards = Math.floor(animalCardContainer.offsetWidth / animalCardWidth);
  const animalMaxTranslate = (animalCards.length - animalVisibleCards) * animalCardWidth;

  if (animalCurrentTranslate > 0) {
    animalCurrentTranslate = 0;
  } else if (animalCurrentTranslate < -animalMaxTranslate) {
    animalCurrentTranslate = -animalMaxTranslate;
  }

  animalCurrentIndex = Math.abs(Math.round(animalCurrentTranslate / animalCardWidth));
  animalCurrentTranslate = -animalCurrentIndex * animalCardWidth;

  animalCardContainer.style.transform = `translateX(${animalCurrentTranslate}px)`;
}
