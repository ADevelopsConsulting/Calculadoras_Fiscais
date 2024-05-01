var images = ["https://blog.megaoffice.net/wp-content/uploads/2019/10/293880-entenda-as-diferencas-da-contabilidade-fiscal-e-gerencial.jpg", "https://site.erpsoft.com.br/wp-content/uploads/2020/08/2847446-1-scaled.jpg"]; // URLs das imagens
var currentIndex = 0;
var interval = 10000; // 10 segundos

function changeImage() {
  currentIndex = (currentIndex + 1) % images.length;
  document.getElementById("background").style.backgroundImage = "url('" + images[currentIndex] + "')";
}

setInterval(changeImage, interval);

document.getElementById("calculadorasButton").addEventListener("click", function() {
  window.location.href = "Calculadoras.html";
});
