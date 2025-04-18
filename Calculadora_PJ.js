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
  
  // Adiciona listeners para atualizar os elementos condicionais ao mudar a seleção
  ['irrf', 'iss', 'inss', 'pisCofinsCsll'].forEach(type => {
    document.querySelectorAll(`input[name="${type}Option"]`).forEach(input => {
      input.addEventListener('change', () => toggleElements(type));
    });
  });
});

function formatarNumero(numero) {
  return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function toggleElements(type) {
  const checkedInput = document.querySelector(`input[name="${type}Option"]:checked`);
  const optionValue = checkedInput ? checkedInput.value : 'Não';
  const elements = document.getElementById(`${type}Elements`);
  elements.style.display = optionValue === 'Sim' ? 'block' : 'none';
}

function calcularImpostos() {
  try {
    const valorNota = parseFloat(document.getElementById('valorNota').value.replace(/\./g, '').replace(',', '.'));
    
    const irrfChecked = document.querySelector('input[name="irrfOption"]:checked');
    const irrfOption = irrfChecked ? irrfChecked.value : 'Não';
    const irrfAliquota = irrfOption === 'Sim' ? parseFloat(document.getElementById('irrfAliquota').value) / 100 : 0;

    const issChecked = document.querySelector('input[name="issOption"]:checked');
    const issOption = issChecked ? issChecked.value : 'Não';
    const issAlquota = issOption === 'Sim' ? parseFloat(document.getElementById('issAlquota').value.replace(',', '.')) / 100 : 0;
    const issBase = issOption === 'Sim' ? parseFloat(document.getElementById('issBase').value.replace(/\./g, '').replace(',', '.')) : 0;

    const inssChecked = document.querySelector('input[name="inssOption"]:checked');
    const inssOption = inssChecked ? inssChecked.value : 'Não';
    const inssBase = inssOption === 'Sim' ? parseFloat(document.getElementById('inssBase').value.replace(/\./g, '').replace(',', '.')) : 0;
    const inssAliquota = inssOption === 'Sim' ? parseFloat(document.getElementById('inssAliquota').value) / 100 : 0;

    const pisCofinsCsllChecked = document.querySelector('input[name="pisCofinsCsllOption"]:checked');
    const pisCofinsCsllOption = pisCofinsCsllChecked ? pisCofinsCsllChecked.value : 'Não';

    let pis = 0, cofins = 0, csll = 0;
    if (pisCofinsCsllOption === 'Sim') {
      pis = valorNota * 0.0065;
      cofins = valorNota * 0.03;
      csll = valorNota * 0.01;
    }

    let irrf = 0, inss = 0, iss = 0;
    if (irrfOption === 'Sim') irrf = valorNota * irrfAliquota;
    if (inssOption === 'Sim') inss = inssBase * inssAliquota;
    if (issOption === 'Sim') iss = issBase * issAlquota;

    const pisarred = Math.round(pis * 100) / 100;
    const cofinsarred = Math.round(cofins * 100) / 100;
    const csllarred = Math.round(csll * 100) / 100;
    const irrfarred = Math.round(irrf * 100) / 100;
    const inssarred = Math.round(inss * 100) / 100;
    const issarred = Math.round(iss * 100) / 100;
    const valorFinal = valorNota - pisarred - cofinsarred - csllarred - irrfarred - inssarred - issarred;

    const resultado = document.getElementById('resultado');
    resultado.style.display = 'block';
    resultado.innerHTML = `
      <p><span>Valor PIS:</span> <span>R$ ${formatarNumero(pisarred)}</span></p>
      <p><span>Valor COFINS:</span> <span>R$ ${formatarNumero(cofinsarred)}</span></p>
      <p><span>Valor CSLL:</span> <span>R$ ${formatarNumero(csllarred)}</span></p>
      <p><span>Valor IRRF:</span> <span>R$ ${formatarNumero(irrfarred)}</span></p>
      <p><span>Valor INSS:</span> <span>R$ ${formatarNumero(inssarred)}</span></p>
      <p><span>Valor ISS:</span> <span>R$ ${formatarNumero(issarred)}</span></p>
      <p><span>Valor Final da Nota:</span> <span>R$ ${formatarNumero(valorFinal)} <span class="tooltip">? <span class="tooltiptext">Valor líquido após descontos de impostos.</span></span></span></p>
    `;

    const imprimirBtn = document.getElementById('imprimirBtn');
    imprimirBtn.style.display = 'flex';
    imprimirBtn.dataset.pis = pisarred;
    imprimirBtn.dataset.cofins = cofinsarred;
    imprimirBtn.dataset.csll = csllarred;
    imprimirBtn.dataset.irrf = irrfarred;
    imprimirBtn.dataset.inss = inssarred;
    imprimirBtn.dataset.iss = issarred;
    imprimirBtn.dataset.final = valorFinal;
    imprimirBtn.dataset.valorNota = valorNota;

    // Efeito de scroll suave até o resultado
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    alert('Insira valores válidos.');
  }
}

function imprimirRelatorio() {
  const valorNota = parseFloat(document.getElementById('imprimirBtn').dataset.valorNota);
  const pis = parseFloat(document.getElementById('imprimirBtn').dataset.pis);
  const cofins = parseFloat(document.getElementById('imprimirBtn').dataset.cofins);
  const csll = parseFloat(document.getElementById('imprimirBtn').dataset.csll);
  const irrf = parseFloat(document.getElementById('imprimirBtn').dataset.irrf);
  const inss = parseFloat(document.getElementById('imprimirBtn').dataset.inss);
  const iss = parseFloat(document.getElementById('imprimirBtn').dataset.iss);
  const valorFinal = parseFloat(document.getElementById('imprimirBtn').dataset.final);

  let relatorioHTML = `
    <html>
      <head>
        <title>Relatório de Análise de NFS-e (PJ)</title>
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
          <h1>Relatório de Análise de NFS-e (PJ)</h1>
          <table>
            <tr><th>Item</th><th>Valor</th></tr>
            <tr><td>Valor Bruto da Nota</td><td>R$ ${formatarNumero(valorNota)}</td></tr>
            <tr><td>PIS</td><td>R$ ${formatarNumero(pis)}</td></tr>
            <tr><td>COFINS</td><td>R$ ${formatarNumero(cofins)}</td></tr>
            <tr><td>CSLL</td><td>R$ ${formatarNumero(csll)}</td></tr>
            <tr><td>IRRF</td><td>R$ ${formatarNumero(irrf)}</td></tr>
            <tr><td>INSS</td><td>R$ ${formatarNumero(inss)}</td></tr>
            <tr><td>ISS</td><td>R$ ${formatarNumero(iss)}</td></tr>
            <tr class="total"><td>Valor Líquido</td><td>R$ ${formatarNumero(valorFinal)}</td></tr>
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