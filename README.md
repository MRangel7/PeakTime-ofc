# 📊 PEAKTIME — Previsão de Lotação de Academias

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-MVP-blue)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Python-orange)

O PEAKTIME é um **MVP funcional** cujo objetivo é entregar rapidamente valor real para dois públicos:

- **Alunos** → evitar horários lotados  
- **Donos/Gestores** → visualizar fluxo e planejar melhor

Com uma interface simples e clara, o usuário consegue rapidamente ver:
- lotação atual da academia;
- previsões futuras por horário;
- criar anotações de treino;
- acessar eventos da academia;
- alternar entre temas claro e escuro.

---

## 🧩 Problema Real

Alunos frequentemente chegam na academia em horários extremamente cheios, o que prejudica a experiência e a produtividade no treino.  
Donos carecem de dados claros sobre o fluxo diário de pessoas.

---

### 💡 Proposta de Valor

> **“O PEAKTIME mostra a lotação atual e futura da academia, ajudando alunos a evitar horários cheios e permitindo que gestores tomem decisões melhores.”**

---

### Arquitetura

**Frontend:**  
- TypeScript / JavaScript 

**Backend:**  
- Python  

---

### 🚀 Funcionalidades (MVP)
- Lotação atual;
- Previsão futura; 
- Tema claro/escuro;
- Bloco de anotações de treino;
- Área de eventos;
- Login e criação de conta;
- Dashboard principal conectado ao backend.

---

## 🛠️ Tecnologias Usadas

### **Frontend**
- Vite  
- React 

### **Backend**
- Python
- Flask  
- Flask-SQLAlchemy  
- Python-dotenv  

# Como Rodar o Projeto

Tenha:

- Python instalado
- Node.js instalado

## Backend (Python)

## 1 Acesse a pasta do backend
```sh
cd backend
```

## 2 Instale as dependências
```sh
pip install -r requirements.txt
```

## 3 Execute o servidor
```sh
python app.py
```

### Frontend

## 1 Acesse a pasta do frontend
```sh
cd frontend
```

## 2 Instale as dependências
```sh
npm install
```

## 3 Inicie o frontend
```sh
npm run dev
```

O frontend rodará em:
http://localhost:8080/

### 📝 Licença

Este projeto está licenciado sob a **MIT License**.  
Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
