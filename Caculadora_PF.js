 document.getElementById('calcularBtn').addEventListener('click', function() {
        calcularTaxa();
    });

    function calcularTaxa() {
        let valorNF = parseFloat(document.getElementById('ValorNF').value.replace(/\./g, '').replace(',', '.'));

        if (isNaN(valorNF)) {
            alert('Por favor, insira um valor numérico válido.');
            return;
        }

        const tetoINSS = 7786.12;
        const percentualINSS = 0.11;
        const descontoMaxINSS = 856.46;

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
        resultadoFinal.innerHTML = `<p>Valor INSS: R$ ${formatarNumero(valorINSS)}</p> <p>Valor IR: R$ ${formatarNumero(valorIR)}</p> <p>Valor Líquido: R$ ${formatarNumero(valorLiquido)}</p>`;

        const imprimirBtn = document.getElementById('imprimirBtn');
        imprimirBtn.style.display = 'block';
        imprimirBtn.dataset.inss = valorINSS;
        imprimirBtn.dataset.ir = valorIR;
        imprimirBtn.dataset.liquido = valorLiquido;
    }

    function formatarNumero(numero) {
        return numero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function imprimirRelatorio() {
        let valorNF = parseFloat(document.getElementById('ValorNF').value.replace(/\./g, '').replace(',', '.'));
        let valorINSS = parseFloat(document.getElementById('imprimirBtn').dataset.inss);
        let valorIR = parseFloat(document.getElementById('imprimirBtn').dataset.ir);
        let valorLiquidoNota = parseFloat(document.getElementById('imprimirBtn').dataset.liquido);

        let relatorio = `Relatório de Análise de Orçamento\n`;
        relatorio += `Valor Nota: R$ ${formatarNumero(valorNF)}\n`;
        relatorio += `Valor INSS: R$ ${formatarNumero(valorINSS)}\n`;
        relatorio += `Valor IR: R$ ${formatarNumero(valorIR)}\n`;
        relatorio += `Valor Líquido Nota: R$ ${formatarNumero(valorLiquidoNota)}\n`;

        let relatorioWindow = window.open('', 'Relatório de Análise de Orçamento', 'width=600,height=400');
        relatorioWindow.document.write('<pre>' + relatorio + '</pre>');
        relatorioWindow.document.close();
        relatorioWindow.print();
    }