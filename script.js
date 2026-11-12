// Contador de tempo real desde o início do namoro.
const inicioNamoro = new Date(2025, 1, 1, 0, 0, 0); // 01/02/2025, horário local
function diferencaCalendario(inicio, fim) {
  let anos = fim.getFullYear() - inicio.getFullYear();
  let marco = new Date(inicio);
  marco.setFullYear(inicio.getFullYear() + anos);
  if (marco > fim) anos--;
  marco = new Date(inicio);
  marco.setFullYear(inicio.getFullYear() + anos);
  let meses = 0;
  while (meses < 11) {
    const proximo = new Date(marco);
    proximo.setMonth(marco.getMonth() + 1);
    if (proximo > fim) break;
    marco = proximo;
    meses++;
  }
  const restante = fim - marco;
  return {
    anos, meses,
    dias: Math.floor(restante / 86400000),
    horas: Math.floor((restante % 86400000) / 3600000),
    minutos: Math.floor((restante % 3600000) / 60000),
    segundos: Math.floor((restante % 60000) / 1000)
  };
}
function atualizarContador() {
  const tempo = diferencaCalendario(inicioNamoro, new Date());
  for (const [id, valor] of Object.entries(tempo)) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(valor).padStart(["horas","minutos","segundos"].includes(id) ? 2 : 1, "0");
  }
}
atualizarContador();
setInterval(atualizarContador, 1000);

// Player do YouTube para a música escolhida.
let playerMusica;
function onYouTubeIframeAPIReady() {
  playerMusica = new YT.Player("player-musica", {
    height: "0", width: "0", videoId: "sB8_zYjxSGg",
    playerVars: { playsinline: 1, controls: 0, rel: 0 }
  });
}
function tocar() { if (playerMusica?.playVideo) playerMusica.playVideo(); }
function pausar() { if (playerMusica?.pauseVideo) playerMusica.pauseVideo(); }
