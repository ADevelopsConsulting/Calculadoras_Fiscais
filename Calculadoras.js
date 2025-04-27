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

// Redirecionamentos para as páginas das calculadoras
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
