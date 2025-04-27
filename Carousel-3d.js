// Configuração das calculadoras
const calculadoras = [
  { 
    id: 'btnDF',
    title: "Calculadora DIFAL 'PI' e 'MA'",
    href: "Calculadora_DIFAL.html" 
  },
  { 
    id: 'btnST',
    title: "Calculadora ST (Loja Timon)", 
    href: "Calculadora_ST.html" 
  },
  { 
    id: 'btnTV',
    title: "Calculadora ST (TVI)", 
    href: "calculadora_TVI.html" 
  },
  { 
    id: 'btnPF',
    title: "Calculadora NFSe-a (Pessoa Física)", 
    href: "Caculadora_PF.html" 
  },
  { 
    id: 'btnPJ',
    title: "Calculadora NFS-e (PJ)", 
    href: "Calculadora_PJ.html" 
  }
];

// Classe para gerenciar o carrossel 3D
class Carousel3D {
  constructor(options) {
    this.container = document.querySelector('.carousel-3d-stage');
    this.indicators = document.querySelector('.carousel-indicators');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.items = options.items || [];
    this.currentIndex = 0;
    this.visibleItems = 3;
    this.angle = 0;
    
    this.init();
  }
  
  init() {
    // Criar cards
    this.createCards();
    
    // Criar indicadores
    this.createIndicators();
    
    // Configurar eventos
    this.setupEvents();
    
    // Posicionar cards inicialmente
    this.updateCarousel();
    
    // Definir cards visíveis com base no tamanho da tela
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }
  
  createCards() {
    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.dataset.index = index;
      
      const cardContent = document.createElement('div');
      cardContent.className = 'carousel-card-content';
      
      // Ícone
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'card-icon';
      iconWrapper.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      
      // Título
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.textContent = item.title;
      
      cardContent.appendChild(iconWrapper);
      cardContent.appendChild(title);
      card.appendChild(cardContent);
      
      // Adicionar evento de clique para navegar
      card.addEventListener('click', () => {
        window.location.href = item.href;
      });
      
      this.container.appendChild(card);
    });
  }
  
  createIndicators() {
    this.items.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
      indicator.dataset.index = index;
      
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
      
      this.indicators.appendChild(indicator);
    });
  }
  
  setupEvents() {
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    
    // Adicionar controle por teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });
    
    // Adicionar controle por deslize (swipe) para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe esquerda
        this.next();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe direita
        this.prev();
      }
    };
  }
  
  handleResize() {
    if (window.innerWidth < 640) {
      this.visibleItems = 1; // Mobile
    } else if (window.innerWidth < 1024) {
      this.visibleItems = 2; // Tablet
    } else {
      this.visibleItems = 3; // Desktop
    }
    
    this.updateCarousel();
  }
  
  calculateCardPosition(index) {
    // Calcula a distância do centro (card atual)
    const distance = (this.currentIndex - index + this.items.length) % this.items.length;
    let adjustedDistance = distance;
    
    // Ajustamento para garantir o caminho mais curto ao redor do círculo
    if (distance > this.items.length / 2) {
      adjustedDistance = distance - this.items.length;
    }
    
    // Efeitos 3D com base na distância
    let zIndex = 20 - Math.abs(adjustedDistance);
    let opacity = Math.max(0.5, 1 - Math.abs(adjustedDistance) * 0.25);
    let scale = Math.max(0.7, 1 - Math.abs(adjustedDistance) * 0.1);
    let rotationY = adjustedDistance * 25; // Graus de rotação
    let translateZ = -Math.abs(adjustedDistance) * 60; // Profundidade
    
    return {
      zIndex,
      opacity,
      scale,
      rotationY,
      translateZ
    };
  }
  
  updateCarousel() {
    const cards = this.container.querySelectorAll('.carousel-card');
    
    cards.forEach((card, index) => {
      const position = this.calculateCardPosition(index);
      
      // Determinar se o card deve ser visível
      const totalItems = this.items.length;
      const absDistance = Math.abs((this.currentIndex - index + totalItems) % totalItems);
      const isVisible = absDistance <= Math.ceil(this.visibleItems / 2) || 
                         absDistance >= totalItems - Math.floor(this.visibleItems / 2);
      
      if (isVisible) {
        card.style.display = 'block';
        card.style.zIndex = position.zIndex;
        card.style.opacity = position.opacity;
        card.style.transform = `
          translateX(${position.rotationY * 4}px)
          rotateY(${position.rotationY}deg)
          scale(${position.scale})
          translateZ(${position.translateZ}px)
        `;
      } else {
        // Ocultar cards que estão muito longe para melhorar o desempenho
        card.style.display = 'none';
      }
    });
    
    // Atualizar indicadores
    const indicators = this.indicators.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateCarousel();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateCarousel();
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }
}

// Inicializar o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar o carrossel 3D
  const carousel = new Carousel3D({
    items: calculadoras
  });
  
  // Manter o código original do particles.js
  // Inicialização do Particles.js
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#38bdf8"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#38bdf8",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 0.5
          }
        },
        "push": {
          "particles_nb": 4
        }
      }
    },
    "retina_detect": true
  });

  // Redirecionamento para a página inicial
  document.querySelector('.menu-button').addEventListener('click', function() {
    window.location.href = 'index.html';
  });
});
