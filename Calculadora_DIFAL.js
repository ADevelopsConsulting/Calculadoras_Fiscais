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
        }