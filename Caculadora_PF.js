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
function calcularTaxa() {
  let valorNF = parseFloat(document.getElementById('ValorNF').value.replace(/\./g, '').replace(',', '.'));
  
  if (isNaN(valorNF)) {
    alert('Por favor, insira um valor numérico válido.');
    return;
  }
  
  const tetoINSS = 8157.41;
  const percentualINSS = 0.11;
  const descontoMaxINSS = 897.32;
  
  let valorINSS = valorNF * percentualINSS;
  if (valorNF > tetoINSS) {
    valorINSS = descontoMaxINSS;
  }
  
  const faixasIR = [
    { limite: 2259.20, aliquota: 0, deducao: 0 },
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896 }
  ];
  
  let valorDescontadoINSS = valorNF - valorINSS;
  let valorIR = 0;
  
  for (let i = 0; i < faixasIR.length; i++) {
    if (valorDescontadoINSS <= faixasIR[i].limite) {
      valorIR = (valorDescontadoINSS * faixasIR[i].aliquota) - faixasIR[i].deducao;
      break;
    }
  }
  
  const valorLiquido = valorDescontadoINSS - valorIR;
  
  const resultadoFinal = document.getElementById('resultado');
  resultadoFinal.style.display = 'block';
  resultadoFinal.innerHTML = `
    <p>
      <span>Valor INSS:</span> 
      <span>R$ ${formatarNumero(valorINSS)}</span>
    </p>
    <p>
      <span>Valor IR:</span>
      <span>R$ ${formatarNumero(valorIR)}</span>
    </p>
    <p>
      <span>Valor Líquido:</span>
      <span>R$ ${formatarNumero(valorLiquido)} <span class="tooltip">? <span class="tooltiptext">Valor líquido após descontos de INSS e IR.</span></span></span>
    </p>
  `;
  
  const imprimirBtn = document.getElementById('imprimirBtn');
  imprimirBtn.style.display = 'flex';
  imprimirBtn.dataset.inss = valorINSS;
  imprimirBtn.dataset.ir = valorIR;
  imprimirBtn.dataset.liquido = valorLiquido;
  imprimirBtn.dataset.valorNF = valorNF;
  
  // Efeito de scroll suave até o resultado
  document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para formatar números
function formatarNumero(numero) {
  return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Função de impressão profissional
function imprimirRelatorio() {
  let valorNF = parseFloat(document.getElementById('imprimirBtn').dataset.valorNF);
  let valorINSS = parseFloat(document.getElementById('imprimirBtn').dataset.inss);
  let valorIR = parseFloat(document.getElementById('imprimirBtn').dataset.ir);
  let valorLiquidoNota = parseFloat(document.getElementById('imprimirBtn').dataset.liquido);
  
  let relatorioHTML = `
    <html>
      <head>
        <title>Relatório de Análise de Orçamento (NFSe-A)</title>
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
          <h1>Relatório de Análise de Orçamento (NFSe-A)</h1>
          <table>
            <tr><th>Item</th><th>Valor</th></tr>
            <tr><td>Valor Bruto da Nota</td><td>R$ ${formatarNumero(valorNF)}</td></tr>
            <tr><td>Desconto INSS</td><td>R$ ${formatarNumero(valorINSS)}</td></tr>
            <tr><td>Imposto de Renda (IR)</td><td>R$ ${formatarNumero(valorIR)}</td></tr>
            <tr class="total"><td>Valor Líquido</td><td>R$ ${formatarNumero(valorLiquidoNota)}</td></tr>
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