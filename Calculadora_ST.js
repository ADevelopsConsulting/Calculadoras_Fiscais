document.getElementById('calcularBtn').addEventListener('click', function() {
    calcularICMS_ST();
});

function calcularICMS_ST() {
    let baseNota = parseFloat(document.getElementById('baseNota').value.replace(/\./g, '').replace(',', '.'));
    let aliquota = parseFloat(document.getElementById('aliquota').value.replace(/\./g, '').replace(',', '.')) / 100;

    if (isNaN(baseNota) || isNaN(aliquota)) {
        alert('Por favor, digite valores numéricos válidos.');
        return;
    }

    let resultado = calcularICMS_ST_valor(baseNota, aliquota);
    exibirResultado(resultado.icmsST, resultado.baseST);
}

function calcularICMS_ST_valor(baseNota, aliquota) {
    let ipi = 0 / 100;
    let mva_aliquota = 0;

    let icms = baseNota * aliquota;
    let baseIPI = baseNota + (baseNota * ipi);
    
    if (aliquota <= 4 / 100) {
        mva_aliquota = 34.15 / 100;
    } else if (aliquota <= 7 / 100) {
        mva_aliquota = 29.96 / 100;
    } else {
        mva_aliquota = 22.97 / 100;
    }

    let mva_valor = baseIPI * mva_aliquota;
    let baseST = baseIPI + mva_valor;
    let icmsST = (baseST * 22 / 100) - icms;

    return { icmsST: icmsST, baseST: baseST };
}

function exibirResultado(icmsST, baseST) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `<p>Base ST: R$ ${formatarNumero(baseST)}</p><p>Valor do ICMS-ST: R$ ${formatarNumero(icmsST)}</p>`;
}

function formatarNumero(numero) {
    return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}