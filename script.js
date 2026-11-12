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


/* Player HTML5: não incorpora YouTube nem exibe anúncios. */
const audioMusica = document.getElementById("audio-musica");
let arrastandoProgresso = false;
function formatarTempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) segundos = 0;
  return Math.floor(segundos / 60) + ":" + String(Math.floor(segundos % 60)).padStart(2, "0");
}
function atualizarBarraVisual(valor) {
  const barra = document.getElementById("progresso-musica");
  if (barra) barra.style.setProperty("--progresso", Math.max(0, Math.min(100, Number(valor))) + "%");
}
function atualizarInterfaceMusica() {
  if (!audioMusica) return;
  const duracao = audioMusica.duration;
  const atual = audioMusica.currentTime || 0;
  const barra = document.getElementById("progresso-musica");
  if (Number.isFinite(duracao) && duracao > 0) {
    if (barra && !arrastandoProgresso) {
      barra.disabled = false;
      barra.value = (atual / duracao) * 100;
      atualizarBarraVisual(barra.value);
    }
    document.getElementById("tempo-total").textContent = formatarTempo(duracao);
  }
  document.getElementById("tempo-atual").textContent = formatarTempo(atual);
}
function atualizarBotaoMusica(tocando) {
  const botao = document.getElementById("botao-reproducao");
  if (botao) {
    botao.textContent = tocando ? "Ⅱ" : "▶";
    botao.setAttribute("aria-label", tocando ? "Pausar música" : "Tocar música");
  }
  const estado = document.getElementById("estado-musica");
  if (estado) estado.textContent = tocando ? "Tocando agora ❤️" : "Música pausada";
}
function tocar() {
  if (!audioMusica) return;
  audioMusica.play().catch(() => {
    document.getElementById("estado-musica").textContent = "Não foi possível reproduzir o arquivo de áudio.";
  });
}
function pausar() {
  if (audioMusica) audioMusica.pause();
}
function alternarReproducao() {
  if (!audioMusica || !audioMusica.src) return;
  if (audioMusica.paused) tocar();
  else pausar();
}
function buscarMusica(valor) {
  if (!audioMusica || !Number.isFinite(audioMusica.duration)) return;
  audioMusica.currentTime = (Number(valor) / 100) * audioMusica.duration;
  atualizarInterfaceMusica();
}
function voltarInicio() {
  if (!audioMusica) return;
  audioMusica.currentTime = 0;
  tocar();
}
if (audioMusica) {
  audioMusica.addEventListener("loadedmetadata", function() {
    document.getElementById("estado-musica").textContent = "Pronta para tocar ❤️";
    atualizarInterfaceMusica();
  });
  audioMusica.addEventListener("timeupdate", atualizarInterfaceMusica);
  audioMusica.addEventListener("play", () => atualizarBotaoMusica(true));
  audioMusica.addEventListener("pause", () => atualizarBotaoMusica(false));
  audioMusica.addEventListener("ended", function() {
    atualizarBotaoMusica(false);
    document.getElementById("estado-musica").textContent = "Música concluída 💗";
  });
  audioMusica.addEventListener("error", function() {
    const estado = document.getElementById("estado-musica");
    if (estado) estado.textContent = "Aguardando o arquivo de áudio para tocar sem anúncios ❤️";
    const barra = document.getElementById("progresso-musica");
    if (barra) barra.disabled = true;
    const botao = document.getElementById("botao-reproducao");
    if (botao) botao.disabled = true;
  });
  audioMusica.addEventListener("loadedmetadata", function() {
    const botao = document.getElementById("botao-reproducao");
    if (botao) botao.disabled = false;
  });
}
