// Redirecionamentos para as páginas das calculadoras
document.getElementById('btnPF').addEventListener('click', function() {
  window.location.href = 'Caculadora_PF.html'; // Corrigido "Caculadora" para "Calculadora" (se for um erro de digitação)
});

document.getElementById('btnPJ').addEventListener('click', function() {
  window.location.href = 'Calculadora_PJ.html';
});

document.getElementById('btnDF').addEventListener('click', function() {
  window.location.href = 'Calculadora_DIFAL.html';
});

document.getElementById('btnST').addEventListener('click', function() {
  window.location.href = 'Calculadora_ST.html';
});

document.getElementById('btnTV').addEventListener('click', function() {
  window.location.href = 'calculadora_TVI.html'; // Corrigido "calculadora" para "Calculadora" (consistência)
});

document.querySelector('.menu-button').addEventListener('click', function() {
  window.location.href = 'index.html';
});
