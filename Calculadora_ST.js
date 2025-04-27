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

// Ocultar botão de impressão e resultado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('imprimirBtn').style.display = 'none';
  document.getElementById('resultado').style.display = 'none';
});

// Função principal de cálculo
function calcularICMS_ST() {
  let baseNota = parseFloat(document.getElementById('baseNota').value.replace(/\./g, '').replace(',', '.'));
  let aliquota = parseFloat(document.getElementById('aliquota').value.replace(/\./g, '').replace(',', '.')) / 100;
  
  if (isNaN(baseNota) || isNaN(aliquota)) {
    alert('Por favor, digite valores numéricos válidos.');
    return;
  }
  
  let resultado = calcularICMS_ST_valor(baseNota, aliquota);
  exibirResultado(resultado.icmsST, resultado.baseST);
  
  const imprimirBtn = document.getElementById('imprimirBtn');
  imprimirBtn.style.display = 'flex';
  imprimirBtn.dataset.icmsST = resultado.icmsST;
  imprimirBtn.dataset.baseST = resultado.baseST;
  imprimirBtn.dataset.baseNota = baseNota;
  imprimirBtn.dataset.aliquota = aliquota * 100; // Armazena como percentual
  
  // Efeito de scroll suave até o resultado
  document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calcularICMS_ST_valor(baseNota, aliquota) {
  let ipi = 0 / 100; // Mantido como 0 conforme o código original
  let mva_aliquota = 0;
  
  let icms = baseNota * aliquota;
  let baseIPI = baseNota + (baseNota * ipi);
  
  if (aliquota <= 4 / 100) {
    mva_aliquota = 35.90 / 100;
  } else if (aliquota <= 7 / 100) {
    mva_aliquota = 31.65 / 100;
  } else {
    mva_aliquota = 24.57 / 100;
  }
  
  let mva_valor = baseIPI * mva_aliquota;
  let baseST = baseIPI + mva_valor;
  let icmsST = (baseST * 23 / 100) - icms;
  
  return { icmsST: icmsST, baseST: baseST };
}

function exibirResultado(icmsST, baseST) {
  const resultado = document.getElementById('resultado');
  resultado.style.display = 'block';
  resultado.innerHTML = `
    <p>
      <span>Base ST:</span> 
      <span>R$ ${formatarNumero(baseST)}</span>
    </p>
    <p>
      <span>Valor do ICMS-ST:</span>
      <span>R$ ${formatarNumero(icmsST)} <span class="tooltip">? <span class="tooltiptext">Valor do ICMS-ST calculado com base na alíquota e MVA.</span></span></span>
    </p>
  `;
}

function formatarNumero(numero) {
  return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Função de impressão profissional
function imprimirRelatorio() {
  let baseNota = parseFloat(document.getElementById('imprimirBtn').dataset.baseNota);
  let aliquota = parseFloat(document.getElementById('imprimirBtn').dataset.aliquota);
  let icmsST = parseFloat(document.getElementById('imprimirBtn').dataset.icmsST);
  let baseST = parseFloat(document.getElementById('imprimirBtn').dataset.baseST);
  
  let relatorioHTML = `
    <html>
      <head>
        <title>Relatório de Cálculo ICMS-ST</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          h1 { color: #0ea5e9; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f4f4f4; }
          .total { font-weight: bold; color: #0ea5e9; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Relatório de Cálculo ICMS-ST</h1>
          <table>
            <tr><th>Item</th><th>Valor</th></tr>
            <tr><td>Base da Nota</td><td>R$ ${formatarNumero(baseNota)}</td></tr>
            <tr><td>Alíquota (%)</td><td>${formatarNumero(aliquota)}</td></tr>
            <tr><td>Base ST</td><td>R$ ${formatarNumero(baseST)}</td></tr>
            <tr class="total"><td>Valor do ICMS-ST</td><td>R$ ${formatarNumero(icmsST)}</td></tr>
          </table>
          <div class="footer">
            © 2025 Contabilidade Pintos LTDA. Todos os direitos reservados.
          </div>
        </div>
      </body>
    </html>
  `;
  
  let relatorioWindow = window.open('', '_blank');
  relatorioWindow.document.write(relatorioHTML);
  relatorioWindow.document.close();
  relatorioWindow.print();
}
