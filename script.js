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

// Player com controles personalizados e barra de busca estilo Spotify.
let playerMusica;
let intervaloProgresso;
let duracaoMusica = 0;
let playerPronto = false;
function formatarTempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) segundos = 0;
  const minutos = Math.floor(segundos / 60);
  const resto = Math.floor(segundos % 60);
  return minutos + ":" + String(resto).padStart(2, "0");
}
function atualizarBarraVisual(valor) {
  const barra = document.getElementById("progresso-musica");
  if (barra) barra.style.setProperty("--progresso", Math.max(0, Math.min(100, Number(valor))) + "%");
}
function atualizarInterfaceMusica() {
  if (!playerMusica || typeof playerMusica.getCurrentTime !== "function") return;
  const atual = playerMusica.getCurrentTime() || 0;
  const duracao = playerMusica.getDuration() || duracaoMusica;
  if (duracao > 0) {
    duracaoMusica = duracao;
    const barra = document.getElementById("progresso-musica");
    if (barra) {
      barra.disabled = false;
      barra.value = Math.min(100, (atual / duracao) * 100);
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
function mostrarFalhaMusica(mensagem) {
  const estado = document.getElementById("estado-musica");
  if (estado) estado.textContent = mensagem;
  const link = document.getElementById("link-musica-youtube");
  if (link) link.hidden = false;
}
function onYouTubeIframeAPIReady() {
  if (!window.YT || !YT.Player) {
    mostrarFalhaMusica("O player do YouTube não ficou disponível.");
    return;
  }
  playerMusica = new YT.Player("player-musica", {
    height: "200", width: "200", videoId: "om7hWIdantU",
    playerVars: { playsinline: 1, controls: 0, rel: 0, enablejsapi: 1, origin: window.location.origin },
    events: {
      onReady: function() {
        playerPronto = true;
        duracaoMusica = playerMusica.getDuration() || 0;
        document.getElementById("estado-musica").textContent = "Pronta para tocar ❤️";
        atualizarInterfaceMusica();
        intervaloProgresso = setInterval(atualizarInterfaceMusica, 500);
      },
      onStateChange: function(event) {
        atualizarBotaoMusica(event.data === YT.PlayerState.PLAYING);
        if (event.data === YT.PlayerState.ENDED) {
          atualizarInterfaceMusica();
          document.getElementById("estado-musica").textContent = "Música concluída 💗";
        }
      },
      onError: function(event) {
        mostrarFalhaMusica("O YouTube não conseguiu reproduzir esta faixa (erro " + event.data + ").");
      }
    }
  });
}
function tocar() {
  if (playerPronto && playerMusica && playerMusica.playVideo) playerMusica.playVideo();
}
function pausar() {
  if (playerPronto && playerMusica && playerMusica.pauseVideo) playerMusica.pauseVideo();
}
function alternarReproducao() {
  if (!playerPronto || !playerMusica || !playerMusica.getPlayerState) return;
  if (playerMusica.getPlayerState() === YT.PlayerState.PLAYING) pausar();
  else tocar();
}
function buscarMusica(valor) {
  if (!playerPronto || !playerMusica || !duracaoMusica) return;
  playerMusica.seekTo((Number(valor) / 100) * duracaoMusica, true);
  atualizarInterfaceMusica();
}
function voltarInicio() {
  if (!playerPronto || !playerMusica) return;
  playerMusica.seekTo(0, true);
  tocar();
}

setTimeout(function() {
  if (!playerPronto) {
    mostrarFalhaMusica("O YouTube está demorando para responder. Você pode abrir a música diretamente.");
  }
}, 15000);
