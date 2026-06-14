# -*- coding: utf-8 -*-
# ============================================================
#  motor_jogo.py  ->  O CEREBRO do jogo (so logica em Python)
# ============================================================
#  Conteudos da aula usados aqui:
#   - Funcoes (def, return, parametros)
#   - Listas e metodos (append, in, len)
#   - Tuplas (a carta e uma tupla; pegamos itens por posicao: carta[1])
#   - Laco for + range()
#   - Laco while + break
#   - if / elif / else  e  operadores logicos (and/or)
#   - Entrada e saida: input() / print() / f-strings
#   - Conversao de tipos: int(...)
#   - Bibliotecas: random (citada na secao "Bibliotecas" da aula)
# ============================================================

import random      # biblioteca para embaralhar as cartas
import cartas       # nosso proprio arquivo cartas.py


def montar_baralho(nivel):
    """Monta a lista de cartas com os PARES (cada astro aparece 2 vezes).

    Usa um laco for para percorrer os astros e o metodo append() da lista.
    """
    astros = cartas.cartas_do_nivel(nivel)
    baralho = []                 # comeca com uma lista vazia (como na aula)
    for carta in astros:
        baralho.append(carta)    # primeira carta do par
        baralho.append(carta)    # segunda carta do par (igual)
    return baralho


def embaralhar(baralho):
    """Embaralha a ordem das cartas para cada partida ser diferente."""
    random.shuffle(baralho)
    return baralho


def definir_colunas(nivel):
    """Quantas colunas o tabuleiro vai ter (if / elif / else)."""
    if nivel == "facil":
        return 4        # 6 pares = 12 cartas -> 4 x 3
    elif nivel == "medio":
        return 4        # 8 pares = 16 cartas -> 4 x 4
    else:
        return 6        # 12 pares = 24 cartas -> 6 x 4


def verificar_par(carta1, carta2):
    """Diz se duas cartas formam um par (mesmo nome).

    A carta e a tupla (id, nome, simbolo); o nome esta na posicao 1.
    """
    if carta1[1] == carta2[1]:
        return True
    else:
        return False


def calcular_pontuacao(acertos, tentativas):
    """Calcula a pontuacao: cada acerto vale 100, cada tentativa tira 5."""
    pontos = acertos * 100 - tentativas * 5
    if pontos < 0:
        pontos = 0
    return pontos


def verificar_fim(acertos, total_pares):
    """O jogo acaba quando o numero de acertos chega no total de pares."""
    if acertos == total_pares:
        return True
    else:
        return False


# ============================================================
#  MODO TERMINAL  ->  da para jogar so com Python, sem a parte web.
#  Rode no terminal:  python motor_jogo.py
#  (Usa while, break, input, print, if/else e tudo que vimos na aula.)
# ============================================================

def mostrar_tabuleiro(baralho, encontradas, viradas):
    """Mostra o tabuleiro no terminal.

    - Carta ja achada ou virada agora: mostra o simbolo.
    - As outras: mostram o numero da posicao para o jogador escolher.
    """
    linha = ""
    for i in range(len(baralho)):
        if i in encontradas or i in viradas:
            linha = linha + " [" + baralho[i][1] + "] "
        else:
            linha = linha + " (" + str(i) + ") "
    print(linha)


def jogar_no_terminal():
    print("==============================================")
    print("   COSMOMEMORIA  -  jogo da memoria (terminal)")
    print("==============================================")

    nivel = input("Escolha o nivel (facil / medio / dificil): ").lower()
    if nivel != "facil" and nivel != "medio" and nivel != "dificil":
        nivel = "facil"   # se digitar errado, usa o facil

    baralho = embaralhar(montar_baralho(nivel))
    total_pares = cartas.quantidade_de_pares(nivel)

    encontradas = []     # posicoes das cartas que ja viraram um par
    tentativas = 0
    acertos = 0

    while True:                                  # laco principal do jogo
        print("")
        mostrar_tabuleiro(baralho, encontradas, [])

        p1 = int(input("Numero da 1a carta: "))
        p2 = int(input("Numero da 2a carta: "))

        valido = True
        if p1 < 0 or p1 >= len(baralho) or p2 < 0 or p2 >= len(baralho):
            print(">> Posicao invalida, tente de novo.")
            valido = False
        elif p1 == p2 or p1 in encontradas or p2 in encontradas:
            print(">> Escolha duas cartas diferentes que ainda nao foram achadas.")
            valido = False

        if valido:
            tentativas = tentativas + 1
            mostrar_tabuleiro(baralho, encontradas, [p1, p2])

            if verificar_par(baralho[p1], baralho[p2]):
                print(">> Achou um par! ✨")
                encontradas.append(p1)
                encontradas.append(p2)
                acertos = acertos + 1
            else:
                print(">> Nao foi dessa vez...")

        if verificar_fim(acertos, total_pares):
            break                                 # sai do laco quando acabar

    pontos = calcular_pontuacao(acertos, tentativas)
    print("")
    print(f"Parabens! Voce achou todos os {total_pares} pares.")
    print(f"Tentativas: {tentativas}")
    print(f"Pontuacao final: {pontos}")


# So roda o modo terminal se executarmos este arquivo direto.
if __name__ == "__main__":
    jogar_no_terminal()
