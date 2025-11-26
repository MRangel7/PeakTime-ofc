from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

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


# ================== MAIN ==================

if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.add_job(automatic_hourly_count, 'interval', seconds=10)
    scheduler.start()

    app.run(debug=True)
