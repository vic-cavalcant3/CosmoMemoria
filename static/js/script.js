// ============================================================
//  script.js  ->  Interacao do jogo (front-end)
//  Conversa com o Python (Flask) pelas rotas /api/...
// ============================================================

// ---------- desenhos (SVG) de cada astro ----------
// A chave (ex.: "sol") vem do Python; aqui ela vira o desenho.
const ICONES = {
  sol: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="13" fill="#f9c74f"/><g stroke="#f9c74f" stroke-width="3" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="13"/><line x1="32" y1="51" x2="32" y2="60"/><line x1="4" y1="32" x2="13" y2="32"/><line x1="51" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="19" y2="19"/><line x1="45" y1="45" x2="52" y2="52"/><line x1="52" y1="12" x2="45" y2="19"/><line x1="19" y1="45" x2="12" y2="52"/></g></svg>`,
  terra: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="#4d96ff"/><path d="M14 30c5-2 8 3 13 1s8 4 14 1c1 0 2 1 2 2-2 9-9 14-15 14-8 0-15-6-16-14 1-1 1-3 2-4z" fill="#43aa8b"/><path d="M22 16c3 0 5 2 4 4-2 3-7 1-8-1 1-2 2-3 4-3z" fill="#43aa8b"/></svg>`,
  lua: `<svg viewBox="0 0 64 64"><path d="M36 8a24 24 0 1 0 0 48 18 24 0 0 1 0-48z" fill="#e8e8f0"/><circle cx="26" cy="22" r="3" fill="#c7c7d6"/><circle cx="20" cy="36" r="4" fill="#c7c7d6"/><circle cx="28" cy="46" r="2.5" fill="#c7c7d6"/></svg>`,
  saturno: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="27" ry="9" fill="none" stroke="#e9c46a" stroke-width="3" transform="rotate(-20 32 32)"/><circle cx="32" cy="32" r="13" fill="#e76f51"/></svg>`,
  estrela: `<svg viewBox="0 0 64 64"><path d="M32 6l7 17 18 1-14 12 5 18-16-10-16 10 5-18-14-12 18-1z" fill="#f9c74f"/></svg>`,
  cometa: `<svg viewBox="0 0 64 64"><path d="M14 50l22-22" stroke="#9bf6ff" stroke-width="4" stroke-linecap="round"/><path d="M20 44l13-13" stroke="#caf0f8" stroke-width="3" stroke-linecap="round" opacity=".6"/><circle cx="44" cy="20" r="9" fill="#9bf6ff"/></svg>`,
  foguete: `<svg viewBox="0 0 64 64"><path d="M32 6c8 6 12 16 12 26l-6 6h-12l-6-6c0-10 4-20 12-26z" fill="#e0e0e6"/><circle cx="32" cy="26" r="5" fill="#46d6f0"/><path d="M20 38l-6 8 8-2zM44 38l6 8-8-2z" fill="#e76f51"/><path d="M28 44h8l-2 11-2 4-2-4z" fill="#f9c74f"/></svg>`,
  galaxia: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="4" fill="#fff"/><path d="M32 32c0-10 10-14 19-9M32 32c0 10-10 14-19 9" fill="none" stroke="#c77dff" stroke-width="3" stroke-linecap="round"/><path d="M32 32c8-6 8-19-2-23M32 32c-8 6-8 19 2 23" fill="none" stroke="#9bf6ff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/></svg>`,
  ovni: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="25" ry="8" fill="#8d99ae"/><path d="M19 34a13 9 0 0 1 26 0z" fill="#cde8ff"/><circle cx="22" cy="38" r="2" fill="#f9c74f"/><circle cx="32" cy="40" r="2" fill="#f9c74f"/><circle cx="42" cy="38" r="2" fill="#f9c74f"/></svg>`,
  astronauta: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#e8eef7"/><rect x="19" y="22" width="26" height="20" rx="10" fill="#2b2d42"/><circle cx="38" cy="29" r="3" fill="#9bf6ff" opacity=".85"/></svg>`,
  cadente: `<svg viewBox="0 0 64 64"><path d="M8 56l16-16" stroke="#9bf6ff" stroke-width="4" stroke-linecap="round"/><path d="M14 54l10-10" stroke="#caf0f8" stroke-width="2.5" stroke-linecap="round" opacity=".5"/><path d="M44 8l4 10 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z" fill="#f9c74f"/></svg>`,
  brilho: `<svg viewBox="0 0 64 64"><path d="M32 6c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22z" fill="#ffd166"/><circle cx="50" cy="14" r="3" fill="#fff3b0"/><circle cx="14" cy="50" r="2.5" fill="#fff3b0"/></svg>`,
};

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
        '<div class="carta-face carta-frente"><span class="icone"></span><span class="nome"></span></div>' +
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

  carta.querySelector(".icone").innerHTML = ICONES[dados.icone];
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