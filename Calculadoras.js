document.getElementById('btnPF').addEventListener('click', function() {
  window.location.href = 'Caculadora_PF.html';
});

document.getElementById('btnPJ').addEventListener('click', function() {
  window.location.href = 'Calculadora_PJ.html';
});

document.getElementById('btnDF').addEventListener('click', function() {
  window.location.href = 'Calculadora_DIFAL.html';
});

document.getElementById('btnST').addEventListener('click', function() {
  window.location.href = 'Calculadora_ST.html';
});

document.getElementById('btnTV').addEventListener('click', function() {
  window.location.href = 'calculadora_TVI.html';
});

document.querySelector('.menu-button').addEventListener('click', function() {
  window.location.href = 'index.html';
});

// Lógica do carrossel
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const buttons = document.querySelectorAll('.calculator-button');
const totalItems = buttons.length;
let currentIndex = 0;

// Criar os dots dinamicamente
for (let i = 0; i < totalItems; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    currentIndex = i;
    updateCarousel();
  });
  dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function updateCarousel() {
  const itemWidth = buttons[0].offsetWidth; // Largura do botão
  const offset = -currentIndex * itemWidth;
  carousel.style.transform = `translateX(${offset}px)`;
  
  // Atualizar dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
  
  // Habilitar/desabilitar setas
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalItems - 1;
}

nextBtn.addEventListener('click', () => {
  if (currentIndex < totalItems - 1) {
    currentIndex++;
    updateCarousel();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

// Iniciar o carrossel
updateCarousel();
