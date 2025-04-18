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
function calcularDesconto() {
  // Obter e formatar o salário inserido
  let ValorSalario = parseFloat(document.getElementById('ValorSalario').value.replace(/\./g, '').replace(',', '.'));
  let dependentes = parseInt(document.getElementById('dependentes').value);
  let categoria = document.getElementById('categoria').value;
  
  // Validar entradas
  if (isNaN(ValorSalario) || ValorSalario <= 0) {
    alert('Por favor, insira um valor numérico válido para o salário.');
    return;
  }
  if (isNaN(dependentes) || dependentes < 0) {
    alert('Por favor, insira um número válido de dependentes.');
    return;
  }
  
  // Definição das faixas do INSS (valores de 2025)
  const faixasINSS = [
    { limite: 1518.00, aliquota: 0.075, deducao: 0 },
    { limite: 2793.88, aliquota: 0.09, deducao: 22.77 },
    { limite: 4190.83, aliquota: 0.12, deducao: 83.85 },
    { limite: 8157.41, aliquota: 0.14, deducao: 167.70 }
  ];
  
  // Cálculo do INSS
  let ValorINSS = 0;
  if (categoria === 'aprendiz') {
    ValorINSS = ValorSalario * 0.02; // 2% pago pela empresa, sem desconto
  } else {
    for (let i = 0; i < faixasINSS.length; i++) {
      if (ValorSalario <= faixasINSS[i].limite) {
        ValorINSS = (ValorSalario * faixasINSS[i].aliquota) - faixasINSS[i].deducao;
        break;
      }
    }
    if (ValorSalario > faixasINSS[faixasINSS.length - 1].limite) {
      const ultimaFaixa = faixasINSS[faixasINSS.length - 1];
      ValorINSS = (ultimaFaixa.limite * ultimaFaixa.aliquota) - ultimaFaixa.deducao;
    }
    ValorINSS = Math.min(ValorINSS, 951.63); // Teto do INSS
  }
  
  // Ajuste para o valor base do IR (desconta INSS apenas se não for aprendiz)
  let valorDescontadoINSS = categoria === 'aprendiz' ? ValorSalario : ValorSalario - ValorINSS;
  
  // Dedução por dependente (R$ 189,59 por dependente por mês em 2025)
  const deducaoDependente = 189.59;
  let deducaoTotalDependentes = dependentes * deducaoDependente;
  
  // Base de cálculo do IR após dedução de dependentes
  let baseCalculoIR = Math.max(valorDescontadoINSS - deducaoTotalDependentes, 0);
  
  // Definição das faixas do IR (valores de 2025)
  const faixasIR = [
    { limite: 2259.20, aliquota: 0, deducao: 0 },
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896 }
  ];
  
  // Cálculo do IR
  let ValorIR = 0;
  for (let i = 0; i < faixasIR.length; i++) {
    if (baseCalculoIR <= faixasIR[i].limite) {
      ValorIR = (baseCalculoIR * faixasIR[i].aliquota) - faixasIR[i].deducao;
      break;
    }
  }
  ValorIR = Math.max(ValorIR, 0); // Garantir que o IR não seja negativo
  
  // Cálculo do FGTS
  let aliquotaFGTS = 0.08; // Padrão para trabalhador geral
  if (categoria === 'domestico') {
    aliquotaFGTS = 0.112; // 8% + 3,2% reserva
  } else if (categoria === 'aprendiz') {
    aliquotaFGTS = 0.02; // Jovem aprendiz
  }
  let ValorFGTS = ValorSalario * aliquotaFGTS;
  
  // Cálculo do valor líquido
  const valorLiquido = categoria === 'aprendiz' ? ValorSalario - ValorIR : valorDescontadoINSS - ValorIR;
  
  // Exibir os resultados na tela com animação
  const resultadoFinal = document.getElementById('resultado');
  resultadoFinal.style.display = 'block';
  resultadoFinal.innerHTML = `
    <p class="${categoria === 'aprendiz' ? 'inss-aprendiz' : ''}">
      <span>Valor INSS:</span> 
      <span>R$ ${formatarNumero(ValorINSS)}${categoria === 'aprendiz' ? ' <span class="tooltip">? <span class="tooltiptext">Pago pela empresa, sem desconto no salário.</span></span>' : ''}</span>
    </p>
    <p>
      <span>Valor IR:</span>
      <span>R$ ${formatarNumero(ValorIR)}</span>
    </p>
    <p class="fgts-valor">
      <span>Valor FGTS:</span>
      <span>R$ ${formatarNumero(ValorFGTS)} <span class="tooltip">? <span class="tooltiptext">FGTS pago pela Empresa.</span></span></span>
    </p>
    <p>
      <span>Valor Líquido:</span>
      <span>R$ ${formatarNumero(valorLiquido)}</span>
    </p>
  `;
  
  // Configurar botão de impressão
  const imprimirBtn = document.getElementById('imprimirBtn');
  imprimirBtn.style.display = 'flex';
  imprimirBtn.dataset.inss = ValorINSS;
  imprimirBtn.dataset.ir = ValorIR;
  imprimirBtn.dataset.fgts = ValorFGTS;
  imprimirBtn.dataset.liquido = valorLiquido;
  imprimirBtn.dataset.salario = ValorSalario;
  imprimirBtn.dataset.categoria = categoria;
  imprimirBtn.dataset.dependentes = dependentes;
  
  // Efeito de scroll suave até o resultado
  resultadoFinal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para formatar números como moeda
function formatarNumero(numero) {
  return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Função para gerar e imprimir o relatório
function imprimirRelatorio() {
  // Recuperar dados do botão
  let ValorSalario = parseFloat(document.getElementById('imprimirBtn').dataset.salario);
  let dependentes = parseInt(document.getElementById('imprimirBtn').dataset.dependentes);
  let categoria = document.getElementById('imprimirBtn').dataset.categoria;
  let ValorINSS = parseFloat(document.getElementById('imprimirBtn').dataset.inss);
  let ValorIR = parseFloat(document.getElementById('imprimirBtn').dataset.ir);
  let ValorFGTS = parseFloat(document.getElementById('imprimirBtn').dataset.fgts);
  let valorLiquido = parseFloat(document.getElementById('imprimirBtn').dataset.liquido);
  
  // Nome da categoria para o relatório
  let categoriaNome = {
    geral: "Trabalhador Geral",
    domestico: "Doméstico",
    aprendiz: "Jovem Aprendiz"
  } [categoria];
  
  // HTML do relatório com visual moderno
  const relatorioHTML = `
    <html>
      <head>
        <title>Relatório de Descontos Salariais</title>
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
          <h1>Relatório de Descontos Salariais</h1>
          <table>
            <tr><th>Item</th><th>Valor</th></tr>
            <tr><td>Salário Bruto</td><td>R$ ${formatarNumero(ValorSalario)}</td></tr>
            <tr><td>Número de Dependentes</td><td>${dependentes}</td></tr>
            <tr><td>Categoria</td><td>${categoriaNome}</td></tr>
            <tr><td>INSS${categoria === 'aprendiz' ? ' (Pago pela empresa)' : ''}</td><td>R$ ${formatarNumero(ValorINSS)}</td></tr>
            <tr><td>Imposto de Renda</td><td>R$ ${formatarNumero(ValorIR)}</td></tr>
            <tr><td>FGTS (Pago pela empresa)</td><td>R$ ${formatarNumero(ValorFGTS)}</td></tr>
            <tr class="total"><td>Salário Líquido</td><td>R$ ${formatarNumero(valorLiquido)}</td></tr>
          </table>
          <div class="footer">
            © 2025 Contabilidade Pintos LTDA. Todos os direitos reservados.
          </div>
        </div>
      </body>
    </html>
  `;
  
  // Abrir nova janela para impressão
  const printWindow = window.open('', '_blank');
  printWindow.document.write(relatorioHTML);
  printWindow.document.close();
  printWindow.print();
}