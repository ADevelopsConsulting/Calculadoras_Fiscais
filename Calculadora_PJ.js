function formatarValor(valor) {
            // Formatar o valor para exibir milhares com ponto e centavos com vírgula
            let partes = valor.toFixed(2).split('.');
            let inteiro = parseInt(partes[0]).toLocaleString('pt-BR');
            let decimal = partes[1];
            return `${inteiro},${decimal}`;
        }

        function toggleElements(type) {
            const optionValue = document.querySelector(`input[name="${type}Option"]:checked`).value;
            const elements = document.getElementById(`${type}Elements`);
            if (optionValue === 'Sim') {
                elements.classList.remove('hidden');
            } else {
                elements.classList.add('hidden');
            }
        }
        

        function calcularImpostos() {
            try {
                const valorNota = parseFloat(document.getElementById('valorNota').value.replace(/\./g, '').replace(',', '.'));
                const irrfOption = document.querySelector('input[name="irrfOption"]:checked').value;
                const irrfAliquota = parseFloat(document.getElementById('irrfAliquota').value) / 100;
                const issOption = document.querySelector('input[name="issOption"]:checked').value;
                const issAlquota = parseFloat(document.getElementById('issAlquota').value) / 100;
                const issBase = parseFloat(document.getElementById('issBase').value.replace(/\./g, '').replace(',', '.'));
                const inssOption = document.querySelector('input[name="inssOption"]:checked').value;
                const inssBase = parseFloat(document.getElementById('inssBase').value.replace(/\./g, '').replace(',', '.'));
                const inssAliquota = parseFloat(document.getElementById('inssAliquota').value) / 100;
                const pisCofinsCsllOption = document.querySelector('input[name="pisCofinsCsllOption"]:checked').value;

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

    const resultado = 
    `Valor PIS: R$ ${pisarred.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br>
    Valor COFINS: R$ ${cofinsarred.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br>
    Valor CSLL: R$ ${csllarred.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br>
    Valor IRRF: R$ ${irrfarred.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br>
    Valor INSS: R$ ${inssarred.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br>
    Valor ISS: R$ ${issarred.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br><br>
    Valor Final da Nota: R$ ${valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

            document.getElementById('resultado').innerHTML = resultado;
            } catch (error) {
            alert('Insira valores válidos.');
            }
        }

        function formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
