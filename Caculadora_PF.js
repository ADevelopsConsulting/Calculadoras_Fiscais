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
    resultadoFinal.innerHTML = `
        <p>Valor INSS: R$ ${formatarNumero(valorINSS)}</p>
        <p>Valor IR: R$ ${formatarNumero(valorIR)}</p>
        <p>Valor Líquido: R$ ${formatarNumero(valorLiquido)}</p>
    `;

    const imprimirBtn = document.getElementById('imprimirBtn');
    imprimirBtn.style.display = 'flex'; // Alinha com o estilo do CSS (flex)
    imprimirBtn.dataset.inss = valorINSS;
    imprimirBtn.dataset.ir = valorIR;
    imprimirBtn.dataset.liquido = valorLiquido;
}

// Função para formatar números
function formatarNumero(numero) {
    return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Função de impressão profissional
function imprimirRelatorio() {
    let valorNF = parseFloat(document.getElementById('ValorNF').value.replace(/\./g, '').replace(',', '.'));
    let valorINSS = parseFloat(document.getElementById('imprimirBtn').dataset.inss);
    let valorIR = parseFloat(document.getElementById('imprimirBtn').dataset.ir);
    let valorLiquidoNota = parseFloat(document.getElementById('imprimirBtn').dataset.liquido);

    let relatorioHTML = `
        <html>
        <head>
            <title>Relatório de Análise de Orçamento - Pintos Contabilidade</title>
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
                <img src="https://via.placeholder.com/150x50?text=Pintos+Contabilidade" class="logo" alt="Pintos Contabilidade">
                <div class="company-info">
                    Pintos Contabilidade LTDA | CNPJ: 12.345.678/0001-99<br>
                    Rua Exemplo, 123 - Centro, Cidade - UF | (11) 1234-5678
                </div>
                <div class="title">Relatório de Análise de Orçamento</div>
            </div>
            
            <table>
                <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Valor Bruto da Nota</td>
                    <td>R$ ${formatarNumero(valorNF)}</td>
                </tr>
                <tr>
                    <td>Desconto INSS</td>
                    <td>R$ ${formatarNumero(valorINSS)}</td>
                </tr>
                <tr>
                    <td>Imposto de Renda (IR)</td>
                    <td>R$ ${formatarNumero(valorIR)}</td>
                </tr>
                <tr class="total">
                    <td>Valor Líquido</td>
                    <td>R$ ${formatarNumero(valorLiquidoNota)}</td>
                </tr>
            </table>

            <div class="footer">
                Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}<br>
                Pintos Contabilidade LTDA - Todos os direitos reservados
            </div>
        </body>
        </html>
    `;

    let relatorioWindow = window.open('', 'Relatório de Análise de Orçamento', 'width=600,height=400');
    relatorioWindow.document.write(relatorioHTML);
    relatorioWindow.document.close();
    relatorioWindow.print();
}

// Ocultar o botão de impressão inicialmente
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('imprimirBtn').style.display = 'none';
});
