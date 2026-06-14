# -*- coding: utf-8 -*-
# ============================================================
#  cartas.py  ->  Os DADOS do jogo (as cartas do tema Universo)
# ============================================================
#  Conteudos da aula usados aqui:
#   - Listas
#   - Tuplas (cada carta e uma tupla imutavel)
#   - Funcoes (def / return)
#   - if / elif / else
#   - Fatiamento de lista (igual ao n[0:2] visto em Strings/Listas)
# ============================================================

# Cada carta e uma TUPLA no formato: (id, nome, icone)
# "icone" e so a CHAVE do desenho (o SVG fica no front-end).
# Usamos tupla porque uma carta NUNCA muda (a aula falou que tupla e imutavel).
# Todas as cartas ficam dentro de uma LISTA.
ASTROS = [
    (1,  "Sol",             "sol"),
    (2,  "Terra",           "terra"),
    (3,  "Lua",             "lua"),
    (4,  "Saturno",         "saturno"),
    (5,  "Estrela",         "estrela"),
    (6,  "Cometa",          "cometa"),
    (7,  "Foguete",         "foguete"),
    (8,  "Galáxia",         "galaxia"),
    (9,  "Disco voador",    "ovni"),
    (10, "Astronauta",      "astronauta"),
    (11, "Estrela cadente", "cadente"),
    (12, "Brilho",          "brilho"),
]


def quantidade_de_pares(nivel):
    """Devolve quantos PARES o nivel tem (usa if / elif / else)."""
    if nivel == "facil":
        return 6
    elif nivel == "medio":
        return 8
    else:  # dificil
        return 12


def cartas_do_nivel(nivel):
    """Pega so a quantidade de astros que o nivel precisa.

    Exemplo: no facil sao 6 pares -> usamos os 6 primeiros astros.
    Usamos FATIAMENTO de lista (ASTROS[0:pares]), igual ao que vimos na aula.
    """
    pares = quantidade_de_pares(nivel)
    return ASTROS[0:pares]
