// ============================================================
//  script.js  ->  Interacao do jogo (front-end)
//  Conversa com o Python (Flask) pelas rotas /api/...
// ============================================================

// ---------- estado do jogo no navegador ----------
let nivel = "facil";
let colunas = 4;
let totalPares = 0;
let acertos = 0;

let primeira = null;   // posicao da 1a carta virada
let segunda = null;    // posicao da 2a carta virada
let bloqueado = false; // trava cliques enquanto verifica

let segundos = 0;
let cronometro = null;

// ---------- atalhos para elementos da tela ----------
const telaInicial = document.getElementById("tela-inicial");
const telaJogo    = document.getElementById("tela-jogo");
const telaVitoria = document.getElementById("tela-vitoria");
const tabuleiro   = document.getElementById("tabuleiro");

const phPares      = document.getElementById("ph-pares");
const phTentativas = document.getElementById("ph-tentativas");
const phTempo      = document.getElementById("ph-tempo");

// ---------- estrelas de fundo ----------
function criarEstrelas() {
  const fundo = document.getElementById("estrelas");
  let html = "";
  for (let i = 0; i < 110; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const tam = Math.random() * 2.2 + 0.6;
    const atraso = (Math.random() * 3).toFixed(2);
    html += `<div class="estrela" style="left:${x}%;top:${y}%;width:${tam}px;height:${tam}px;animation-delay:${atraso}s"></div>`;
  }
  fundo.innerHTML = html;
}

// ---------- escolher nivel ----------
document.querySelectorAll(".btn-nivel").forEach(function (botao) {
  botao.addEventListener("click", function () {
    document.querySelectorAll(".btn-nivel").forEach(b => b.classList.remove("selecionado"));
    botao.classList.add("selecionado");
    nivel = botao.dataset.nivel;
  });
});

// ---------- formatar tempo (mm:ss) ----------
function formatarTempo(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
}

function iniciarCronometro() {
  segundos = 0;
  phTempo.textContent = "00:00";
  clearInterval(cronometro);
  cronometro = setInterval(function () {
    segundos++;
    phTempo.textContent = formatarTempo(segundos);
  }, 1000);
}

// ---------- comecar um jogo novo ----------
async function comecarJogo() {
  const resp = await fetch("/api/novo-jogo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nivel: nivel })
  });
  const dados = await resp.json();

  colunas = dados.colunas;
  totalPares = dados.total_pares;
  acertos = 0;
  primeira = null;
  segunda = null;
  bloqueado = false;

  // monta o tabuleiro de cartas viradas para baixo
  tabuleiro.style.setProperty("--colunas", colunas);
  tabuleiro.innerHTML = "";
  for (let i = 0; i < dados.total; i++) {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.pos = i;
    carta.innerHTML =
      '<div class="carta-inner">' +
        '<div class="carta-face carta-tras"></div>' +
        '<div class="carta-face carta-frente"><span class="emoji"></span><span class="nome"></span></div>' +
      '</div>';
    carta.addEventListener("click", function () { clicarCarta(carta); });
    tabuleiro.appendChild(carta);
  }

  // placar zerado
  phPares.textContent = "0/" + totalPares;
  phTentativas.textContent = "0";
  iniciarCronometro();

  telaInicial.classList.add("oculto");
  telaVitoria.classList.add("oculto");
  telaJogo.classList.remove("oculto");
}

// ---------- clicar numa carta ----------
async function clicarCarta(carta) {
  const pos = parseInt(carta.dataset.pos);

  // ignora se: travado, ja virada, ja encontrada, ou clicou na mesma
  if (bloqueado) return;
  if (carta.classList.contains("virada")) return;
  if (carta.classList.contains("encontrada")) return;

  // pergunta ao Python qual o astro desta carta
  const resp = await fetch("/api/virar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ posicao: pos })
  });
  const dados = await resp.json();

  carta.querySelector(".emoji").textContent = dados.simbolo;
  carta.querySelector(".nome").textContent = dados.nome;
  carta.classList.add("virada");

  if (primeira === null) {
    primeira = pos;
  } else {
    segunda = pos;
    verificarPar();
  }
}

// ---------- verificar se as duas formam par ----------
async function verificarPar() {
  bloqueado = true;

  const resp = await fetch("/api/verificar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pos1: primeira, pos2: segunda })
  });
  const dados = await resp.json();

  phTentativas.textContent = dados.tentativas;

  const c1 = document.querySelector('.carta[data-pos="' + primeira + '"]');
  const c2 = document.querySelector('.carta[data-pos="' + segunda + '"]');

  if (dados.par) {
    // acertou: deixa reveladas
    acertos = dados.acertos;
    phPares.textContent = acertos + "/" + totalPares;
    setTimeout(function () {
      c1.classList.add("encontrada");
      c2.classList.add("encontrada");
      destravar();
      if (dados.fim) {
        terminarJogo(dados.pontuacao);
      }
    }, 350);
  } else {
    // errou: vira de volta depois de um tempinho
    setTimeout(function () {
      c1.classList.remove("virada");
      c2.classList.remove("virada");
      destravar();
    }, 800);
  }
}

function destravar() {
  primeira = null;
  segunda = null;
  bloqueado = false;
}

// ---------- fim de jogo ----------
function terminarJogo(pontos) {
  clearInterval(cronometro);
  document.getElementById("v-tempo").textContent = formatarTempo(segundos);
  document.getElementById("v-tentativas").textContent = phTentativas.textContent;
  document.getElementById("v-pontos").textContent = pontos;
  telaVitoria.classList.remove("oculto");
}

// ---------- botoes ----------
document.getElementById("btn-comecar").addEventListener("click", comecarJogo);
document.getElementById("btn-de-novo").addEventListener("click", comecarJogo);
document.getElementById("btn-trocar").addEventListener("click", function () {
  clearInterval(cronometro);
  telaJogo.classList.add("oculto");
  telaInicial.classList.remove("oculto");
});

// ---------- inicio ----------
criarEstrelas();
