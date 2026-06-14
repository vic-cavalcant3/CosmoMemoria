# -*- coding: utf-8 -*-
# ============================================================
#  app.py  ->  A PONTE (Flask) entre o cerebro em Python e a web
# ============================================================
#  O Flask e uma BIBLIOTECA (a aula falou que "para quase qualquer
#  necessidade existe uma biblioteca em Python"). Aqui ele so:
#   1) entrega a pagina do jogo (index.html);
#   2) responde ao front-end usando as funcoes do motor_jogo.py.
#
#  Toda a LOGICA de verdade fica em motor_jogo.py e cartas.py.
# ============================================================

from flask import Flask, render_template, request, jsonify
import motor_jogo
import cartas

app = Flask(__name__)

# Estado do jogo guardado no servidor (um jogo por vez - simples para o trabalho)
estado = {
    "baralho": [],        # lista de cartas embaralhadas
    "encontradas": [],    # posicoes ja achadas
    "tentativas": 0,
    "acertos": 0,
    "total_pares": 0,
}


@app.route("/")
def inicio():
    # Mostra a pagina do jogo.
    return render_template("index.html")


@app.route("/api/novo-jogo", methods=["POST"])
def novo_jogo():
    # Comeca um jogo novo no nivel escolhido.
    dados = request.get_json()
    nivel = dados.get("nivel", "facil")

    # Aqui usamos as funcoes do nosso motor em Python:
    baralho = motor_jogo.embaralhar(motor_jogo.montar_baralho(nivel))

    estado["baralho"] = baralho
    estado["encontradas"] = []
    estado["tentativas"] = 0
    estado["acertos"] = 0
    estado["total_pares"] = cartas.quantidade_de_pares(nivel)

    return jsonify({
        "total": len(baralho),
        "colunas": motor_jogo.definir_colunas(nivel),
        "total_pares": estado["total_pares"],
    })


@app.route("/api/virar", methods=["POST"])
def virar():
    # O front-end pergunta: "o que tem embaixo da carta X?"
    # O servidor (Python) e quem sabe a resposta.
    dados = request.get_json()
    posicao = dados.get("posicao", 0)
    carta = estado["baralho"][posicao]          # carta = (id, nome, simbolo)
    return jsonify({"nome": carta[1], "simbolo": carta[2]})


@app.route("/api/verificar", methods=["POST"])
def verificar():
    # O front-end manda duas posicoes; o Python decide se e par.
    dados = request.get_json()
    p1 = dados.get("pos1")
    p2 = dados.get("pos2")

    estado["tentativas"] = estado["tentativas"] + 1
    eh_par = motor_jogo.verificar_par(estado["baralho"][p1], estado["baralho"][p2])

    if eh_par:
        estado["encontradas"].append(p1)
        estado["encontradas"].append(p2)
        estado["acertos"] = estado["acertos"] + 1

    pontuacao = motor_jogo.calcular_pontuacao(estado["acertos"], estado["tentativas"])
    fim = motor_jogo.verificar_fim(estado["acertos"], estado["total_pares"])

    return jsonify({
        "par": eh_par,
        "acertos": estado["acertos"],
        "tentativas": estado["tentativas"],
        "pontuacao": pontuacao,
        "fim": fim,
    })


if __name__ == "__main__":
    # Roda local (no Render usamos o gunicorn em vez disto).
    app.run(debug=True)
