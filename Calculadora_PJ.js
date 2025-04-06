function formatarNumero(numero) {
    return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  function toggleElements(type) {
    const checkedInput = document.querySelector(`input[name="${type}Option"]:checked`);
    const optionValue = checkedInput ? checkedInput.value : 'Não'; // Padrão "Não" se nada selecionado
    const elements = document.getElementById(`${type}Elements`);
    elements.style.display = optionValue === 'Sim' ? 'block' : 'none';
  }
  
  function calcularImpostos() {
    try {
      const valorNota = parseFloat(document.getElementById('valorNota').value.replace(/\./g, '').replace(',', '.'));
  
      // Verifica seleção dos botões de rádio, padrão "Não" se não houver escolha
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
  
      const resultado = `
        <p>Valor PIS: R$ ${formatarNumero(pisarred)}</p>
        <p>Valor COFINS: R$ ${formatarNumero(cofinsarred)}</p>
        <p>Valor CSLL: R$ ${formatarNumero(csllarred)}</p>
        <p>Valor IRRF: R$ ${formatarNumero(irrfarred)}</p>
        <p>Valor INSS: R$ ${formatarNumero(inssarred)}</p>
        <p>Valor ISS: R$ ${formatarNumero(issarred)}</p>
        <p>Valor Final da Nota: R$ ${formatarNumero(valorFinal)}</p>
      `;
  
      document.getElementById('resultado').innerHTML = resultado;
  
      const imprimirBtn = document.getElementById('imprimirBtn');
      imprimirBtn.style.display = 'flex';
      imprimirBtn.dataset.pis = pisarred;
      imprimirBtn.dataset.cofins = cofinsarred;
      imprimirBtn.dataset.csll = csllarred;
      imprimirBtn.dataset.irrf = irrfarred;
      imprimirBtn.dataset.inss = inssarred;
      imprimirBtn.dataset.iss = issarred;
      imprimirBtn.dataset.final = valorFinal;
    } catch (error) {
      alert('Insira valores válidos.');
    }
  }
  
  function imprimirRelatorio() {
    const valorNota = parseFloat(document.getElementById('valorNota').value.replace(/\./g, '').replace(',', '.'));
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
        <title>Relatório de Análise de NFS-e (PJ) - Pintos Contabilidade</title>
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
                <img src="https://pintos.com.br/media/logo/stores/1/lojas_pintos.png " class="logo" alt="Contabilidade - Pintos LTDA">
                <div class="company-info">
                   Pintos LTDA | CNPJ: 06.837.645/0001-60<br>
                    Rua Alvaro Mendes, 1237 - Centro, Teresina - PI | (86) 2107-4023
                </div>
          <div class="title">Relatório de Análise de NFS-e (PJ)</div>
        </div>
        
        <table>
          <tr><th>Descrição</th><th>Valor</th></tr>
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
          Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}<br>
          Contabilidade Pintos LTDA - Todos os direitos reservados
        </div>
      </body>
      </html>
    `;
  
    let relatorioWindow = window.open('', 'Relatório de Análise de NFS-e', 'width=600,height=400');
    relatorioWindow.document.write(relatorioHTML);
    relatorioWindow.document.close();
    relatorioWindow.print();
  }
  
  // Adicionar eventos aos botões de rádio
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('imprimirBtn').style.display = 'none';
  
    // Adiciona listeners para atualizar os elementos condicionais ao mudar a seleção
    ['irrf', 'iss', 'inss', 'pisCofinsCsll'].forEach(type => {
      document.querySelectorAll(`input[name="${type}Option"]`).forEach(input => {
        input.addEventListener('change', () => toggleElements(type));
      });
    });
  });
