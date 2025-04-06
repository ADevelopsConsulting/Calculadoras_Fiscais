document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('imprimirBtn').style.display = 'none';
});

function calcularICMS_ST() {
  let baseNota = parseFloat(document.getElementById('baseNota').value.replace(/\./g, '').replace(',', '.'));
  let aliquota = parseFloat(document.getElementById('aliquota').value.replace(/\./g, '').replace(',', '.')) / 100;
  let ipi = parseFloat(document.getElementById('aliquotaIPI').value.replace(/\./g, '').replace(',', '.')) / 100;

  if (isNaN(baseNota) || isNaN(aliquota) || isNaN(ipi)) {
    alert('Por favor, digite valores numéricos válidos.');
    return;
  }

  let resultado = calcularICMS_ST_valor(baseNota, aliquota, ipi);
  exibirResultado(resultado.icmsST, resultado.baseST, baseNota, aliquota, ipi);
}

function calcularICMS_ST_valor(baseNota, aliquota, ipi) {
  let ipiValor = baseNota * ipi;
  let baseIPI = baseNota + ipiValor;
  
  let mva_aliquota = 0;
  let icms = baseNota * aliquota;

  if (aliquota <= 0.04) {
    mva_aliquota = 0.7180;
  } else if (aliquota <= 0.07) {
    mva_aliquota = 0.6643;
  } else {
    mva_aliquota = 0.5749;
  }

  let mva_valor = baseIPI * mva_aliquota;
  let baseST = baseIPI + mva_valor;
  let icmsST = (baseST * 0.21) - icms;

  return { icmsST: icmsST, baseST: baseST };
}

function exibirResultado(icmsST, baseST, baseNota, aliquota, ipi) {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <p>Base ST: R$ ${formatarNumero(baseST)}</p>
    <p>Valor do ICMS-ST: R$ ${formatarNumero(icmsST)}</p>
  `;

  const imprimirBtn = document.getElementById('imprimirBtn');
  imprimirBtn.style.display = 'flex';
  imprimirBtn.dataset.icmsST = icmsST;
  imprimirBtn.dataset.baseST = baseST;
  imprimirBtn.dataset.baseNota = baseNota;
  imprimirBtn.dataset.aliquota = aliquota * 100; // Convertendo para porcentagem
  imprimirBtn.dataset.ipi = ipi * 100; // Convertendo para porcentagem
}

function formatarNumero(numero) {
  return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function imprimirRelatorio() {
  let baseNota = parseFloat(document.getElementById('imprimirBtn').dataset.baseNota);
  let aliquota = parseFloat(document.getElementById('imprimirBtn').dataset.aliquota);
  let ipi = parseFloat(document.getElementById('imprimirBtn').dataset.ipi);
  let icmsST = parseFloat(document.getElementById('imprimirBtn').dataset.icmsST);
  let baseST = parseFloat(document.getElementById('imprimirBtn').dataset.baseST);

  let relatorioHTML = `
    <html>
    <head>
      <title>Relatório de Cálculo ICMS-ST - Contabilidade Pintos LTDA</title>
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
        <div class="title">Relatório de Cálculo ICMS-ST (TVI)</div>
      </div>
      
      <table>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
        </tr>
        <tr>
          <td>Base da Nota Fiscal</td>
          <td>R$ ${formatarNumero(baseNota)}</td>
        </tr>
        <tr>
          <td>Alíquota ICMS (%)</td>
          <td>${formatarNumero(aliquota)}%</td>
        </tr>
        <tr>
          <td>Alíquota IPI (%)</td>
          <td>${formatarNumero(ipi)}%</td>
        </tr>
        <tr>
          <td>Base ST</td>
          <td>R$ ${formatarNumero(baseST)}</td>
        </tr>
        <tr class="total">
          <td>Valor ICMS-ST</td>
          <td>R$ ${formatarNumero(icmsST)}</td>
        </tr>
      </table>

      <div class="footer">
        Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}<br>
        Contabilidade Pintos LTDA - Todos os direitos reservados
      </div>
    </body>
    </html>
  `;

  let relatorioWindow = window.open('', 'Relatório ICMS-ST', 'width=600,height=400');
  relatorioWindow.document.write(relatorioHTML);
  relatorioWindow.document.close();
  relatorioWindow.print();
}
