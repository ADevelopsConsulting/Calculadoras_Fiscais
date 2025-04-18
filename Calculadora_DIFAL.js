document.addEventListener('DOMContentLoaded', function() {
  // Inicializar Particles.js
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#38bdf8"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#38bdf8",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 0.5
          }
        },
        "push": {
          "particles_nb": 4
        }
      }
    },
    "retina_detect": true
  });

  // Inicializar elementos
  initializeElements();
  setupEventListeners();
  formatInputs();
  updateCurrentDate();
});

// Variáveis globais para armazenar os resultados
let calculationResults = {
  baseCalculo: 0,
  valorDifal: 0
};

function initializeElements() {
  // Inicializar as tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remover classe ativa de todos os botões e conteúdos
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Adicionar classe ativa ao botão e conteúdo clicado
      button.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
  
  // Ocultar o resultado inicialmente
  document.getElementById('resultado').classList.add('hidden');
}

function setupEventListeners() {
  // Botão de calcular
  document.getElementById('calcularBtn').addEventListener('click', calcularDIFAL);
  
  // Botão de limpar
  document.getElementById('limparBtn').addEventListener('click', limparFormulario);
  
  // Botão de imprimir
  document.getElementById('imprimirBtn').addEventListener('click', imprimirRelatorio);
  
  // Botão de compartilhar
  document.getElementById('compartilharBtn').addEventListener('click', compartilharResultado);
  
  // Validar entradas em tempo real
  const inputFields = document.querySelectorAll('.input-wrapper input');
  inputFields.forEach(input => {
    input.addEventListener('input', function() {
      formatarCampo(this);
      validarCampo(this);
    });
  });
}

// Formatar campos de entrada para usar máscara
function formatInputs() {
  const valorInputs = document.querySelectorAll('#nota, #frete');
  valorInputs.forEach(input => {
    input.addEventListener('input', function() {
      formatarMoeda(this);
    });
  });
  
  const percentInputs = document.querySelectorAll('#aliquotaInterna, #aliquotaInterestadual');
  percentInputs.forEach(input => {
    input.addEventListener('input', function() {
      formatarPercentual(this);
    });
  });
}

// Formatar valores monetários
function formatarMoeda(input) {
  let valor = input.value.replace(/\D/g, '');
  valor = (parseFloat(valor) / 100).toFixed(2);
  valor = valor.replace('.', ',');
  valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  input.value = valor;
}

// Formatar percentuais
function formatarPercentual(input) {
  let valor = input.value.replace(/\D/g, '');
  if (valor.length > 0) {
    valor = (parseFloat(valor) / 100).toFixed(2);
    valor = valor.replace('.', ',');
  }
  input.value = valor;
}

// Formatar campo genérico
function formatarCampo(input) {
  if (input.id === 'nota' || input.id === 'frete') {
    formatarMoeda(input);
  } else if (input.id === 'aliquotaInterna' || input.id === 'aliquotaInterestadual') {
    formatarPercentual(input);
  }
}

// Validar campo de entrada
function validarCampo(input) {
  const valor = input.value.trim();
  
  if (valor === '') {
    input.classList.remove('valid', 'invalid');
    return;
  }
  
  // Verificar alíquotas interestaduais válidas
  if (input.id === 'aliquotaInterestadual') {
    const aliquota = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    if (![4, 7, 12].includes(aliquota)) {
      input.classList.add('invalid');
      input.classList.remove('valid');
    } else {
      input.classList.add('valid');
      input.classList.remove('invalid');
    }
  } else {
    if (valor && parseFloat(valor.replace(/\./g, '').replace(',', '.')) > 0) {
      input.classList.add('valid');
      input.classList.remove('invalid');
    } else {
      input.classList.add('invalid');
      input.classList.remove('valid');
    }
  }
}

// Converter string formatada para número
function converterParaNumero(valor) {
  return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

// Atualizar data atual
function updateCurrentDate() {
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const dataAtual = new Date().toLocaleDateString('pt-BR', options);
  document.getElementById('currentDate').textContent = dataAtual;
}

// Calcular o DIFAL (fórmula otimizada)
function calcularDIFAL() {
  try {
    // Obter valores dos campos
    const nota = converterParaNumero(document.getElementById('nota').value);
    const aliquotaInterna = converterParaNumero(document.getElementById('aliquotaInterna').value) / 100;
    const aliquotaInterestadual = converterParaNumero(document.getElementById('aliquotaInterestadual').value) / 100;
    const frete = converterParaNumero(document.getElementById('frete').value);
    
    // Validar entradas
    if (isNaN(nota) || isNaN(aliquotaInterna) || isNaN(aliquotaInterestadual) || isNaN(frete)) {
      mostrarAlerta("Preencha todos os campos com valores válidos.", "error");
      return;
    }
    
    // Calcular a base de cálculo (valor da nota + frete)
    const baseCalculo = nota + frete;
    
    // Fórmula simplificada e correta do DIFAL
    const difal = baseCalculo * (aliquotaInterna - aliquotaInterestadual);
    
    // Armazenar os resultados
    calculationResults = {
      baseCalculo: baseCalculo,
      valorDifal: difal
    };
    
    // Atualizar a exibição dos resultados
    exibirResultados();
    
    // Animar o resultado
    document.getElementById('resultado').classList.add('pulse-animation');
    setTimeout(() => {
      document.getElementById('resultado').classList.remove('pulse-animation');
    }, 1500);
    
  } catch (error) {
    mostrarAlerta("Ocorreu um erro ao calcular. Verifique os valores inseridos.", "error");
    console.error("Erro no cálculo:", error);
  }
}

// Exibir os resultados calculados
function exibirResultados() {
  // Formatar os valores para exibição
  const baseCalculoFormatado = formatarValor(calculationResults.baseCalculo);
  const valorDifalFormatado = formatarValor(calculationResults.valorDifal);
  
  // Atualizar os elementos HTML
  document.getElementById('baseCalculo').textContent = `R$ ${baseCalculoFormatado}`;
  document.getElementById('valorDifal').textContent = `R$ ${valorDifalFormatado}`;
  
  // Exibir a caixa de resultado
  document.getElementById('resultado').classList.remove('hidden');
}

// Limpar o formulário
function limparFormulario() {
  // Limpar os campos de entrada
  document.getElementById('nota').value = '';
  document.getElementById('aliquotaInterna').value = '';
  document.getElementById('aliquotaInterestadual').value = '';
  document.getElementById('frete').value = '';
  
  // Limpar as classes de validação
  const inputs = document.querySelectorAll('.input-wrapper input');
  inputs.forEach(input => {
    input.classList.remove('valid', 'invalid');
  });
  
  // Ocultar o resultado
  document.getElementById('resultado').classList.add('hidden');
  
  // Focar no primeiro campo
  document.getElementById('nota').focus();
}

// Formatar valor numérico para exibição
function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Mostrar alerta/notificação
function mostrarAlerta(mensagem, tipo) {
  // Criar o elemento de alerta
  const alertaDiv = document.createElement('div');
  alertaDiv.className = `alerta ${tipo}`;
  alertaDiv.innerHTML = `
    <div class="alerta-conteudo">
      <i class="fas ${tipo === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
      <span>${mensagem}</span>
    </div>
    <button class="alerta-fechar">×</button>
  `;
  
  // Adicionar ao body
  document.body.appendChild(alertaDiv);
  
  // Animação de entrada
  setTimeout(() => {
    alertaDiv.classList.add('mostrar');
  }, 10);
  
  // Configurar o botão de fechar
  alertaDiv.querySelector('.alerta-fechar').addEventListener('click', () => {
    alertaDiv.classList.remove('mostrar');
    setTimeout(() => {
      alertaDiv.remove();
    }, 300);
  });
  
  // Auto-fechar após 5 segundos
  setTimeout(() => {
    if (document.body.contains(alertaDiv)) {
      alertaDiv.classList.remove('mostrar');
      setTimeout(() => {
        alertaDiv.remove();
      }, 300);
    }
  }, 5000);
}

// Função para imprimir relatório
function imprimirRelatorio() {
  const baseCalculo = calculationResults.baseCalculo;
  const valorDifal = calculationResults.valorDifal;
  const nota = converterParaNumero(document.getElementById('nota').value);
  const frete = converterParaNumero(document.getElementById('frete').value);
  const aliquotaInterna = converterParaNumero(document.getElementById('aliquotaInterna').value);
  const aliquotaInterestadual = converterParaNumero(document.getElementById('aliquotaInterestadual').value);
  
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const horaHoje = new Date().toLocaleTimeString('pt-BR');
  
  let relatorioHTML = `
    <html>
    <head>
      <title>Relatório de Cálculo de DIFAL</title>
      <style>
        body { 
          font-family: 'Poppins', Arial, sans-serif; 
          margin: 40px; 
          color: #333; 
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          border: 1px solid #ddd; 
          border-radius: 8px; 
        }
        h1 { 
          color: #0ea5e9; 
          text-align: center; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px; 
        }
        th, td { 
          padding: 12px; 
          border: 1px solid #ddd; 
          text-align: left; 
        }
        th { 
          background-color: #f4f4f4; 
          font-weight: 600; 
        }
        .total { 
          font-weight: bold; 
          color: #0ea5e9; 
        }
        .footer { 
          text-align: center; 
          margin-top: 20px; 
          font-size: 0.9em; 
          color: #777; 
        }
        .formula-box { 
          background: #f9f9f9; 
          border-left: 3px solid #0ea5e9; 
          padding: 15px; 
          margin: 20px 0; 
        }
        .formula-title { 
          font-weight: 600; 
          margin-bottom: 8px; 
        }
        .formula { 
          font-family: monospace; 
          background: #f0f0f0; 
          padding: 8px; 
          border-radius: 3px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Relatório de Cálculo de DIFAL</h1>
        <table>
          <tr><th>Item</th><th>Valor</th></tr>
          <tr><td>Valor da Nota</td><td>R$ ${formatarValor(nota)}</td></tr>
          <tr><td>Valor do Frete</td><td>R$ ${formatarValor(frete)}</td></tr>
          <tr><td>Alíquota Interna</td><td>${aliquotaInterna}%</td></tr>
          <tr><td>Alíquota Interestadual</td><td>${aliquotaInterestadual}%</td></tr>
          <tr><td>Base de Cálculo</td><td>R$ ${formatarValor(baseCalculo)}</td></tr>
          <tr class="total"><td>Valor do DIFAL a Recolher</td><td>R$ ${formatarValor(valorDifal)}</td></tr>
        </table>
        <div class="formula-box">
          <div class="formula-title">Fórmula Aplicada:</div>
          <div class="formula">
            DIFAL = Base de Cálculo × (Alíquota Interna - Alíquota Interestadual)<br>
            Base de Cálculo = Valor da Nota + Valor do Frete
          </div>
        </div>
        <div class="footer">
          Documento gerado em ${dataHoje} às ${horaHoje}<br>
          © 2025 Contabilidade Pintos LTDA. Todos os direitos reservados.
        </div>
      </div>
    </body>
    </html>
  `;
  
  let relatorioWindow = window.open('', 'Relatório de Cálculo de DIFAL', 'width=800,height=600');
  relatorioWindow.document.write(relatorioHTML);
  relatorioWindow.document.close();
  
  setTimeout(() => {
    relatorioWindow.print();
  }, 500);
}

// Função para compartilhar resultados
function compartilharResultado() {
  const baseCalculo = formatarValor(calculationResults.baseCalculo);
  const valorDifal = formatarValor(calculationResults.valorDifal);
  
  const textoCompartilhamento = `Cálculo de DIFAL - Contabilidade Pintos LTDA\n\nBase de Cálculo: R$ ${baseCalculo}\nValor do DIFAL: R$ ${valorDifal}\n\nCalculado em: ${new Date().toLocaleDateString('pt-BR')}`;
  
  // Verifica se a Web Share API está disponível
  if (navigator.share) {
    navigator.share({
      title: 'Cálculo de DIFAL - Contabilidade Pintos',
      text: textoCompartilhamento
    })
    .then(() => mostrarAlerta('Compartilhado com sucesso!', 'success'))
    .catch(error => {
      console.error('Erro ao compartilhar:', error);
      copiarParaAreaDeTransferencia(textoCompartilhamento);
    });
  } else {
    // Fallback para copiar para área de transferência
    copiarParaAreaDeTransferencia(textoCompartilhamento);
  }
}

// Função para copiar para área de transferência
function copiarParaAreaDeTransferencia(texto) {
  // Criar elemento temporário
  const elementoTemp = document.createElement('textarea');
  elementoTemp.value = texto;
  document.body.appendChild(elementoTemp);
  
  // Selecionar e copiar o texto
  elementoTemp.select();
  document.execCommand('copy');
  
  // Remover o elemento temporário
  document.body.removeChild(elementoTemp);
  
  // Mostrar mensagem de confirmação
  mostrarAlerta('Resultado copiado para a área de transferência!', 'success');
}