# 🪐 CosmoMemória — Jogo da Memória do Universo

Jogo da memória com tema espacial. O **cérebro do jogo é feito em Python** (com os conteúdos
vistos na disciplina de Linguagem de Programação) e a **interface é feita em HTML, CSS e
JavaScript**. A ponte entre os dois é o **Flask**.

Projeto da disciplina de Linguagem de Programação — Análise e Desenvolvimento de Sistemas —
SENAI-SP — 2026.

---

## 🎮 Como jogar
Escolha a dificuldade (fácil, médio ou difícil), clique em duas cartas por vez e encontre os
pares de astros iguais. Quando achar todos os pares, aparece o tempo e a pontuação final.

---

## 📁 Estrutura do projeto
```
cosmomemoria/
├── app.py              # Ponte Flask (serve a página e responde o front-end)
├── motor_jogo.py       # Cérebro do jogo: funções em Python + modo terminal
├── cartas.py           # Dados das cartas do tema Universo (listas e tuplas)
├── requirements.txt    # Bibliotecas (Flask e gunicorn)
├── render.yaml         # Configuração para hospedar no Render
├── Procfile            # Comando de start (Render/Heroku)
├── templates/
│   └── index.html      # Estrutura da página
└── static/
    ├── css/estilo.css  # Visual do tema Universo
    └── js/script.js    # Virar cartas, animações, cronômetro e placar
```

---

## 🧠 Conteúdos da aula aplicados
| Conteúdo | Onde aparece |
|---|---|
| Funções (`def`, `return`, parâmetros) | `motor_jogo.py` e `cartas.py` |
| Listas e métodos (`append`, `in`, `len`, fatiamento) | baralho, cartas encontradas |
| Tuplas (imutáveis) | cada carta = `(id, nome, símbolo)` |
| `for` + `range()` | montar o baralho e o tabuleiro |
| `while` + `break` | laço principal do modo terminal |
| `if` / `elif` / `else` e operadores lógicos | verificar par, nível, fim de jogo |
| `input()` / `print()` / f-strings / `int()` | modo terminal |
| Bibliotecas | `random` (embaralhar) e `flask` (web) |

---

## ▶️ Rodar no computador (local)

### 1) Instalar as bibliotecas
```bash
pip install -r requirements.txt
```

### 2) Jogar só no terminal (Python puro)
```bash
python motor_jogo.py
```

### 3) Jogar no navegador
```bash
python app.py
```
Depois abra **http://127.0.0.1:5000** no navegador.

---

## 🚀 Hospedar no Render (passo a passo)

> O Render coloca o jogo online de graça. Antes, suba o projeto para um repositório no GitHub.

1. **Suba o projeto no GitHub** (com todos os arquivos desta pasta).
2. Acesse **https://render.com** e faça login (dá para entrar com a conta do GitHub).
3. Clique em **New +** → **Web Service**.
4. Conecte e selecione o **repositório** do projeto.
5. Preencha as configurações:
   - **Language / Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --workers 1 --bind 0.0.0.0:$PORT`
   - **Instance Type:** `Free`
6. Clique em **Create Web Service** e aguarde o build terminar (alguns minutos).
7. Pronto! O Render vai gerar um link tipo `https://cosmomemoria.onrender.com` — esse é o jogo no ar. 🎉

> 💡 Como o arquivo **`render.yaml`** já está no projeto, o Render também consegue
> configurar tudo sozinho se você usar a opção **Blueprint** (New + → Blueprint).

> ⚠️ No plano Free, o serviço "dorme" depois de um tempo sem uso. Na primeira vez que alguém
> abrir o link depois disso, ele pode levar uns 30–50 segundos para acordar. É normal.

---

## 👩‍🚀 Divisão da equipe
- **Lógica em Python:** `cartas.py` e `motor_jogo.py`
- **Integração Flask + deploy:** `app.py`, `render.yaml`, README
- **Interface (tema universo):** `index.html` e `estilo.css`
- **Interação e testes:** `script.js` e tabela de testes
