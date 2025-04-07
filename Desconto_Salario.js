// Ocultar botão de impressão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('imprimirBtn').style.display = 'none';
});

// Função principal de cálculo
function calcularDesconto() {
  // Obter e formatar o salário inserido
  let ValorSalario = parseFloat(document.getElementById('ValorSalario').value.replace(/\./g, '').replace(',', '.'));
  let categoria = document.getElementById('categoria').value;
  
  // Validar entrada
  if (isNaN(ValorSalario) || ValorSalario <= 0) {
    alert('Por favor, insira um valor numérico válido.');
    return;
  }
  
  // Definição das faixas do INSS
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
  
  // Definição das faixas do IR
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
    if (valorDescontadoINSS <= faixasIR[i].limite) {
      ValorIR = (valorDescontadoINSS * faixasIR[i].aliquota) - faixasIR[i].deducao;
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
  const valorLiquido = valorDescontadoINSS - ValorIR;
  
  // Exibir os resultados na tela
  const resultadoFinal = document.getElementById('resultado');
  resultadoFinal.innerHTML = `
    <p class="${categoria === 'aprendiz' ? 'inss-aprendiz' : ''}">Valor INSS: R$ ${formatarNumero(ValorINSS)}${categoria === 'aprendiz' ? ' <span class="tooltip">? <span class="tooltiptext">Pago pela empresa, sem desconto no salário.</span></span>' : ''}</p>
    <p>Valor IR: R$ ${formatarNumero(ValorIR)}</p>
    <p class="fgts-valor">Valor FGTS: R$ ${formatarNumero(ValorFGTS)} <span class="tooltip">? <span class="tooltiptext">FGTS pago pela Empresa.</span></span></p>
    <p>Valor Líquido: R$ ${formatarNumero(valorLiquido)}</p>
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
}

// Função para formatar números como moeda
function formatarNumero(numero) {
  return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Função para gerar e imprimir o relatório
function imprimirRelatorio() {
  // Recuperar dados do botão
  let ValorSalario = parseFloat(document.getElementById('imprimirBtn').dataset.salario);
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
  
  // HTML do relatório
  let relatorioHTML = `
    <html>
    <head>
      <title>Relatório de Descontos Salariais - Contabilidade Pintos LTDA</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          margin: 20px;
          line-height: 1.4;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #ffd700;
          padding-bottom: 10px;
        }
        .logo {
          width: 150px;
          height: auto;
          margin-bottom: 10px;
        }
        .company-info {
          font-size: 12px;
          color: #666;
        }
        .title {
          font-size: 18px;
          font-weight: 700;
          color: #ff6f61;
          margin: 10px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background: linear-gradient(90deg, #ff6f61, #ffb347);
          color: #fff;
          font-weight: 600;
        }
        .total {
          font-weight: 700;
          background-color: #f9f9f9;
          color: #4b5eaa;
        }
        .footer {
          text-align: center;
          font-size: 10px;
          color: #666;
          margin-top: 30px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://pintos.com.br/media/logo/stores/1/lojas_pintos.png" class="logo" alt="Contabilidade - Pintos LTDA">
        <div class="company-info">
          Pintos LTDA | CNPJ: 06.837.645/0001-60<br>
          Rua Alvaro Mendes, 1237 - Centro, Teresina - PI | (86) 2107-4023
        </div>
        <div class="title">Relatório de Descontos Salariais</div>
      </div>
      
      <table>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
        </tr>
        <tr>
          <td>Salário Bruto</td>
          <td>R$ ${formatarNumero(ValorSalario)}</td>
        </tr>
        <tr>
          <td>Categoria do Trabalhador</td>
          <td>${categoriaNome}</td>
        </tr>
        <tr>
          <td>Desconto INSS${categoria === 'aprendiz' ? ' (pago pela empresa sem descontar do salário)' : ''}</td>
          <td>R$ ${formatarNumero(ValorINSS)}</td>
        </tr>
        <tr>
          <td>Imposto de Renda (IR)</td>
          <td>R$ ${formatarNumero(ValorIR)}</td>
        </tr>
        <tr>
          <td>FGTS (pago pela empresa)</td>
          <td>R$ ${formatarNumero(ValorFGTS)}</td>
        </tr>
        <tr class="total">
          <td>Valor Líquido</td>
          <td>R$ ${formatarNumero(valorLiquido)}</td>
        </tr>
      </table>

      <div class="footer">
        Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}<br>
        Contabilidade Pintos LTDA - Todos os direitos reservados
      </div>
    </body>
    </html>
  `;
  
  // Abrir e imprimir o relatório
  let relatorioWindow = window.open('', 'Relatório de Descontos Salariais', 'width=600,height=400');
  relatorioWindow.document.write(relatorioHTML);
  relatorioWindow.document.close();
  relatorioWindow.print();
}
