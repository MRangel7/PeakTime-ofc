# prediction_controller.py

def calcular_previsao(ultimas_5):
    # ultimas_5 deve vir assim: [20, 30, 23, 35, 55]
    R = sum(ultimas_5) / len(ultimas_5)

    from datetime import datetime
    hora_atual = datetime.now().hour

    # Regras que você criou
    if 14 < hora_atual < 16:
        return R + 5
    elif 16 < hora_atual < 18:
        return R + 13
    else:
        return R  # sem ajuste fora do horário
