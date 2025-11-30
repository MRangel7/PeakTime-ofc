from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from flask import Flask, request, jsonify
from datetime import datetime, time, timedelta

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ================== MODELS ==================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    password = db.Column(db.String(150), nullable=False)


class CurrentPeople(db.Model):
    __tablename__ = "current_people"
    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Integer, nullable=False, default=0)


class PeopleCount(db.Model):
    __tablename__ = "people_count"
    id = db.Column(db.Integer, primary_key=True)
    hour = db.Column(db.String(5), nullable=False)
    total_people = db.Column(db.Integer, nullable=False)


# ================== INIT DB ==================

with app.app_context():
    db.create_all()
    if not CurrentPeople.query.first():
        db.session.add(CurrentPeople(total=0))
        db.session.commit()


# ================== AUTH ==================

@app.post("/register")
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email já cadastrado"}), 400
    if User.query.filter_by(phone=phone).first():
        return jsonify({"error": "Telefone já cadastrado"}), 400

    new_user = User(name=name, email=email, phone=phone, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuário cadastrado com sucesso"}), 201


@app.post("/login")
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404
    if user.password != password:
        return jsonify({"error": "Senha incorreta"}), 401

    return jsonify({
        "message": "Login realizado com sucesso",
        "user": {
            "name": user.name,
            "email": user.email,
            "phone": user.phone
        }
    })


# ================== CONTADOR ATUAL ==================

@app.post("/incrementar")
def incrementar():
    contador = CurrentPeople.query.first()
    contador.total += 1
    db.session.commit()
    return jsonify({"total": contador.total})


@app.post("/decrementar")
def decrementar():
    contador = CurrentPeople.query.first()
    if contador.total > 0:
        contador.total -= 1
        db.session.commit()
    return jsonify({"total": contador.total})


@app.get("/contador-atual")
def contador_atual():
    contador = CurrentPeople.query.first()
    return jsonify({"total": contador.total})


# ================== PEOPLE COUNT ==================

@app.post("/count")
def save_people_count():
    data = request.get_json()

    hour = data.get("hour")
    total = data.get("total")

    new_count = PeopleCount(hour=hour, total_people=total)
    db.session.add(new_count)
    db.session.commit()

    return jsonify({"message": "Registro salvo com sucesso"}), 201


@app.get("/counts")
def get_counts():
    counts = PeopleCount.query.all()

    result = [
        {"hora": c.hour, "pessoas": c.total_people}
        for c in counts
    ]

    return jsonify(result)


# ================== AUTO UPDATE ==================

def automatic_hourly_count():
    with app.app_context():
        hour = datetime.now().strftime("%H:%M")  # formato 14:32

        contador = CurrentPeople.query.first()
        total_people = contador.total

        registro_existente = PeopleCount.query.filter_by(hour=hour).first()

        if registro_existente:
            registro_existente.total_people = total_people
        else:
            novo = PeopleCount(
                hour=hour,
                total_people=total_people
            )
            db.session.add(novo)

        db.session.commit()
        print(f"[AUTO] Atualizado: {total_people} pessoas às {hour}")


@app.post("/prever_lotacao")
def prever_lotacao():
    data = request.json
    ultimas5 = data.get("ultimas5", [])
    hora = data.get("hora")    # opcional: hora atual (int)
    minuto = data.get("minuto")  # opcional: minuto atual (int)

    # valida e converte
    try:
        ultimas = [float(x) for x in ultimas5]
    except Exception:
        return jsonify({"erro": "últimos valores inválidos"}), 400

    if len(ultimas) == 0:
        return jsonify({"erro": "Forneça pelo menos 1 registro"}), 400

    # se cliente enviar hora/minuto usa, senão usa datetime.now()
    now = datetime.now()
    if isinstance(hora, int) and isinstance(minuto, int):
        now = now.replace(hour=hora % 24, minute=minuto % 60, second=0, microsecond=0)
    else:
        now = now.replace(second=0, microsecond=0)

    # mapeamento de regras (intervalos [start, end) em horário)
    # cada valor é o ajuste a ser somado (positivo/negativo)
    rules = [
        (time(6, 0),  time(14, 0),  +5),
        (time(14, 0), time(18, 0),  -4),
        (time(18, 0), time(18,45),  +2),
        (time(18,45), time(19,15),  +4),
        (time(19,15), time(19,45),  +5),
        (time(19,45), time(20,15),  +7),
        (time(20,15), time(20,45),  -2),
        (time(20,45), time(21,15),  +0),
        (time(21,15), time(21,45),  +1),
        (time(21,45), time(22,15),  +7),
        (time(22,15), time(22,45),  -5),
        (time(22,45), time(23,15),  -6),
        (time(23,15), time(23,45),  +5),
        (time(23,45), time(23,59,59), -11),  # tratativa até 23:59:59
        (time(0,0),   time(6,0),   -11),      # 00:00 - 06:00 também -11
    ]

    def ajuste_para(h: time):
        # retorna ajuste com base nas regras para o horário h (time)
        for start, end, adj in rules:
            # lidar com intervalos normais
            if start <= h < end:
                return adj
        # se não encontrou (por segurança) devolve 0
        return 0

    # Função auxiliar média (usa todos os elementos passados)
    def media(arr):
        if len(arr) == 0:
            return 0
        return sum(arr) / len(arr)

    # ITERAÇÃO para 5 previsões seguindo sua regra:
    offsets = [15, 30, 60, 90, 120]  # minutos para as 5 previsões
    preds = []
    prev_preds = []
    # Garantir que ultimas estão ordenadas do mais antigo para o mais recente
    # O front envia geralmente últimos registros em ordem correta; assumimos que sim.
    # Se vierem do mais novo para o mais antigo, use ultimas = ultimas[::-1]
    last_measurements = ultimas[:]  # copia

    for i, offset in enumerate(offsets):
        # quantos dos últimos "medidos" usar: para a previsão i usamos até (5 - i) medições,
        # mas não mais do que o que temos.
        take_count = min(len(last_measurements), max(0, 5 - i))
        elements = []
        if take_count > 0:
            elements.extend(last_measurements[-take_count:])  # últimos take_count valores medidos
        # adicionar previsões anteriores (na ordem que foram calculadas)
        elements.extend(prev_preds)
        R = media(elements)

        # calcular horário alvo (now + offset minutos)
        future_dt = now + timedelta(minutes=offset)
        future_time = future_dt.time()

        # pegar ajuste conforme regras e aplicar
        adj = ajuste_para(future_time)
        previsao = R + adj

        # se negativo => 0
        if previsao < 0:
            previsao = 0

        previsao = round(previsao, 2)

        # label do horário: ex "18:15 (+15m)"
        label = future_dt.strftime("%H:%M") + f" (+{offset}m)"

        preds.append({"hora": label, "valor": previsao})
        prev_preds.append(previsao)

    # média base (usada pra exibição)
    R_base = round(media(last_measurements), 2)

    return jsonify({
        "media": R_base,
        "previsoes": preds
    })

# ================== MAIN ==================

if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.add_job(automatic_hourly_count, 'interval', seconds=10)
    scheduler.start()

    app.run(debug=True)
