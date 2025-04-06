function formatarValor(valor) {
  // Formatar o valor para exibir milhares com ponto e centavos com vírgula
  let partes = valor.toFixed(2).split('.');
  let inteiro = parseInt(partes[0]).toLocaleString('pt-BR');
  let decimal = partes[1];
  return `${inteiro},${decimal}`;
}

function calcularICMS() {
  let nota = parseFloat(document.getElementById('nota').value.replace(/\./g, '').replace(',', '.'));
  let aliquotaInterna = parseFloat(document.getElementById('aliquotaInterna').value.replace(',', '.')) / 100;
  let aliquotaInterestadual = parseFloat(document.getElementById('aliquotaInterestadual').value.replace(',', '.')) / 100;
  let frete = parseFloat(document.getElementById('frete').value.replace(',', '.'));
  
  if (isNaN(nota) || isNaN(aliquotaInterna) || isNaN(aliquotaInterestadual) || isNaN(frete)) {
    alert("Por favor, digite valores válidos.");
    return;
  }
  
  let icms = ((nota + frete) - ((nota + frete) * aliquotaInterestadual)) / (1 - aliquotaInterna) * aliquotaInterna - ((nota + frete) * aliquotaInterestadual);
  
  document.getElementById('resultado').innerHTML = `O valor do DIFAL é: R$ ${formatarValor(icms)}`;
  
  const imprimirBtn = document.getElementById('imprimirBtn');
  imprimirBtn.style.display = 'flex'; // Alinha com o estilo do CSS (flex)
  imprimirBtn.dataset.nota = nota;
  imprimirBtn.dataset.frete = frete;
  imprimirBtn.dataset.icms = icms;
}

// Função de impressão profissional
function imprimirRelatorio() {
  let nota = parseFloat(document.getElementById('imprimirBtn').dataset.nota);
  let frete = parseFloat(document.getElementById('imprimirBtn').dataset.frete);
  let icms = parseFloat(document.getElementById('imprimirBtn').dataset.icms);
  
  let relatorioHTML = `
        <html>
        <head>
            <title>Relatório de Cálculo de DIFAL - Contabilidade - Pintos LTDA</title>
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
                   Pintos LTDA | CNPJ: 12.345.67<br>
                    Rua Exemplo, 123 - Centro, Cidade - UF | (11) 1234-5678
                </div>
                <div class="title">Relatório de Cálculo de DIFAL</div>
            </div>
            
            <table>
                <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Valor da Nota</td>
                    <td>R$ ${formatarValor(nota)}</td>
                </tr>
                <tr>
                    <td>Frete</td>
                    <td>R$ ${formatarValor(frete)}</td>
                </tr>
                <tr class="total">
                    <td>Valor do DIFAL</td>
                    <td>R$ ${formatarValor(icms)}</td>
                </tr>
            </table>

            <div class="footer">
                Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}<br>
                Pintos Contabilidade LTDA - Todos os direitos reservados
            </div>
        </body>
        </html>
    `;
  
  let relatorioWindow = window.open('', 'Relatório de Cálculo de DIFAL', 'width=600,height=400');
  relatorioWindow.document.write(relatorioHTML);
  relatorioWindow.document.close();
  relatorioWindow.print();
}

// Ocultar o botão de impressão inicialmente
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('imprimirBtn').style.display = 'none';
});
