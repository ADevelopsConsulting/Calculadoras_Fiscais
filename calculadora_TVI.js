document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calcularBtn').addEventListener('click', function() {
        calcularICMS_ST();
    });
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
    exibirResultado(resultado.icmsST, resultado.baseST);
}

function calcularICMS_ST_valor(baseNota, aliquota, ipi) {
    let ipiValor = baseNota * ipi;
    let baseIPI = baseNota + ipiValor;
    
    let mva_aliquota = 0;

    let icms = baseNota * aliquota;
    
    if (aliquota <= 4 / 100) {
        mva_aliquota = 71.80 / 100;
    } else if (aliquota <= 7 / 100) {
        mva_aliquota = 66.43 / 100;
    } else {
        mva_aliquota = 57.49 / 100;
    }

    let mva_valor = baseIPI * mva_aliquota;
    let baseST = baseIPI + mva_valor;
    let icmsST = (baseST * 21 / 100) - icms;

    return { icmsST: icmsST, baseST: baseST };
}

function exibirResultado(icmsST, baseST) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `<p>Base ST: R$ ${formatarNumero(baseST)}</p><p>Valor do ICMS-ST: R$ ${formatarNumero(icmsST)}</p>`;
}

function formatarNumero(numero) {
    return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}