const musica = document.getElementById("musica");
musica.volume = 0.6;

function tocar() {
  musica.currentTime = 0;
  musica.play();
}

function pausar() {
  musica.pause();
}
