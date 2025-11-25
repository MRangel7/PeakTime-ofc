from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    password = db.Column(db.String(150), nullable=False)

with app.app_context():
    db.create_all()

@app.post("/register")
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")  


    existing_user = User.query.filter_by(email=email).first()
    existing_phone = User.query.filter_by(phone=phone).first()
    if existing_user:
        return jsonify({"error": "Email já cadastrado"}), 400
    elif existing_phone:
        return jsonify({"error": "Telefone já cadastrado"}), 400
    
    new_user = User(
        name=name,
        email=email,
        phone=phone,
        password=password,
    )

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

# Tabela contendo quantidade de pessoas por horário
class PeopleCount(db.Model):
    __tablename__ = "people_count"

    id = db.Column(db.Integer, primary_key=True)
    hour = db.Column(db.String(5), nullable=False)  
    total_people = db.Column(db.Integer, nullable=False)

with app.app_context():
    db.create_all()

@app.post("/count")
def save_people_count():
    data = request.get_json()

    hour = data.get("hour")
    total = data.get("total")

    new_count = PeopleCount(
        hour=hour,
        total_people=total
    )

    db.session.add(new_count)
    db.session.commit()

    return jsonify({"message": "Registro salvo com sucesso"}), 201

@app.get("/counts")
def get_counts():
    counts = PeopleCount.query.all()

    result = [
        {
            "hora": c.hour,
            "pessoas": c.total_people
        } for c in counts
    ]

    return jsonify(result)



def automatic_hourly_count():
    now = datetime.now()
    hour = now.strftime("%H:00")

    
    total_people = random.randint(0, 100)  

    new_count = PeopleCount(
        hour=hour,
        total_people=total_people
    )

    with app.app_context():
        db.session.add(new_count)
        db.session.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(automatic_hourly_count, 'interval', hours=1)
scheduler.start()


if __name__ == "__main__":
    app.run(debug=True)


