document.getElementById('calcularDesc').addEventListener('click', function() {
    calcularDesconto();
});

function calcularDesconto() {
    let ValorSalario = parseFloat(document.getElementById('ValorSalario').value.replace(/\./g, '').replace(',', '.'));
    let categoria = document.getElementById('categoria').value;

    if (isNaN(ValorSalario)) {
        alert('Por favor, insira um valor numérico válido.');
        return;
    }

    // Cálculo do INSS
    const faixasINSS = [
        {limite: 1412.00, aliquota: 0.075, deducao: 0},
        {limite: 2666.68, aliquota: 0.09, deducao: 21.18},
        {limite: 4000.03, aliquota: 0.12, deducao: 101.18},
        {limite: 7786.02, aliquota: 0.14, deducao: 181.181}
    ];

    let ValorINSS = 0;

    for (let i = 0; i < faixasINSS.length; i++) {
        if (ValorSalario <= faixasINSS[i].limite) {
            ValorINSS = (ValorSalario * faixasINSS[i].aliquota) - faixasINSS[i].deducao;
            break;
        }
    }

    // Caso o valor ultrapasse o limite máximo, aplicar a última faixa
    if (ValorSalario > faixasINSS[faixasINSS.length - 1].limite) {
        const ultimaFaixa = faixasINSS[faixasINSS.length - 1];
        ValorINSS = (ultimaFaixa.limite * ultimaFaixa.aliquota) - ultimaFaixa.deducao;
    }

    ValorINSS = Math.min(ValorINSS, 908.85);

    let valorDescontadoINSS = ValorSalario - ValorINSS;

    // Cálculo do IR
    const faixasIR = [
        {limite: 2259.20, aliquota: 0, deducao: 0},
        {limite: 2826.65, aliquota: 0.075, deducao: 169.44},
        {limite: 3751.05, aliquota: 0.15, deducao: 381.44},
        {limite: 4664.68, aliquota: 0.225, deducao: 662.77},
        {limite: Infinity, aliquota: 0.275, deducao: 896}
    ];

    let ValorIR = 0;

    for (let i = 0; i < faixasIR.length; i++) {
        if (ValorSalario <= faixasIR[i].limite) {
            ValorIR = (ValorSalario * faixasIR[i].aliquota) - faixasIR[i].deducao;
            break;
        }
    }

    if (ValorSalario > faixasIR[faixasIR.length - 1].limite) {
        const ultimaFaixa = faixasIR[faixasIR.length - 1];
        ValorIR = (ultimaFaixa.limite * ultimaFaixa.aliquota) - ultimaFaixa.deducao;
    }

    // Cálculo do FGTS
    let aliquotaFGTS = 0.08; // Padrão para trabalhadores gerais
    if (categoria === 'domestico') {
        aliquotaFGTS = 0.112;
    } else if (categoria === 'aprendiz') {
        aliquotaFGTS = 0.02;
    }
    let ValorFGTS = ValorSalario * aliquotaFGTS;

    // Cálculo do valor líquido
    const valorLiquido = ValorSalario - ValorINSS - ValorIR;

    // Exibir os resultados
    const resultadoFinal = document.getElementById('resultado');
    resultadoFinal.innerHTML = `
        <p>Valor INSS: R$ ${formatarNumero(ValorINSS.toFixed(2))}</p>
        <p>Valor IR: R$ ${formatarNumero(ValorIR.toFixed(2))}</p>
        <p class="fgts-valor">Valor FGTS: R$ ${formatarNumero(ValorFGTS.toFixed(2))} <span class="tooltip">?
            <span class="tooltiptext">FGTS pago pela Empresa.</span>
        </span></p>
        <p>Valor Líquido: R$ ${formatarNumero(valorLiquido.toFixed(2))}</p>`;
}

function formatarNumero(numero) {
    let partes = numero.toString().split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos para milhares
    return partes.join(',');
}

