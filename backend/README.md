# VitaClin — Back-end

API REST para gestão clínica da VitaClin, construída com **FastAPI** + **MongoDB**.

## Stack

| Camada      | Tecnologia              |
|-------------|-------------------------|
| Framework   | FastAPI                  |
| Banco       | MongoDB (via Motor async)|
| Validação   | Pydantic v2              |
| Servidor    | Uvicorn                  |

## Estrutura

```
vitaclin-backend/
├── app/
│   ├── main.py          # Entrada da aplicação, CORS, routers
│   ├── database.py      # Conexão MongoDB (Motor async)
│   ├── routes/
│   │   ├── users.py         # CRUD usuários + login
│   │   ├── patients.py      # CRUD pacientes
│   │   ├── professionals.py # CRUD profissionais
│   │   ├── appointments.py  # CRUD agendamentos
│   │   └── finances.py      # CRUD financeiro + resumo
│   └── schemas/
│       └── models.py        # Todos os modelos Pydantic
├── seed.py              # Popula o banco com dados demo
├── requirements.txt
└── .env.example
```

## Como rodar

### 1. Pré-requisitos
- Python 3.11+
- MongoDB rodando localmente (`mongod`) ou Atlas

### 2. Instalar dependências
```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
# edite .env se necessário (MongoDB Atlas URL, etc.)
```

### 4. Popular o banco com dados de demo
```bash
python seed.py
```

### 5. Rodar o servidor
```bash
uvicorn app.main:app --reload
```

API disponível em: `http://localhost:8000`  
Documentação interativa: `http://localhost:8000/docs`

## Endpoints principais

### Usuários
| Método | Rota                   | Descrição            |
|--------|------------------------|----------------------|
| POST   | `/api/users/register`  | Cadastrar usuário    |
| POST   | `/api/users/login`     | Login                |
| GET    | `/api/users/`          | Listar usuários      |

### Pacientes
| Método | Rota                      | Descrição              |
|--------|---------------------------|------------------------|
| GET    | `/api/patients/`          | Listar (filtros: esp, prof, plano) |
| POST   | `/api/patients/`          | Criar paciente         |
| GET    | `/api/patients/{id}`      | Buscar por ID          |
| PUT    | `/api/patients/{id}`      | Atualizar              |
| DELETE | `/api/patients/{id}`      | Remover                |

### Agendamentos
| Método | Rota                           | Descrição          |
|--------|--------------------------------|--------------------|
| GET    | `/api/appointments/`           | Listar (filtros: prof, date, status) |
| POST   | `/api/appointments/`           | Criar              |
| PATCH  | `/api/appointments/{id}/confirm` | Confirmar        |
| DELETE | `/api/appointments/{id}`       | Cancelar           |

### Financeiro
| Método | Rota                    | Descrição                     |
|--------|-------------------------|-------------------------------|
| GET    | `/api/finances/`        | Listar lançamentos            |
| GET    | `/api/finances/summary` | Resumo por status (agregação) |
| POST   | `/api/finances/`        | Novo lançamento               |
| PUT    | `/api/finances/{id}`    | Atualizar                     |
| DELETE | `/api/finances/{id}`    | Remover                       |

## Modelagem MongoDB

Coleções: `users`, `patients`, `professionals`, `appointments`, `finances`

Cada documento usa `_id` gerado pelo MongoDB (ObjectId), serializado como string `id` nas respostas.

## Credenciais de demo (após rodar seed.py)

| Usuário               | Email                      | Senha       | Papel         |
|-----------------------|----------------------------|-------------|---------------|
| Renata Souza          | renata@vitaclin.com        | admin123    | admin         |
| Dra. Camila Torres    | camila@vitaclin.com        | camila123   | profissional  |
| Dr. Rafael Nunes      | rafael@vitaclin.com        | rafael123   | profissional  |
| Dra. Beatriz Lemos    | beatriz@vitaclin.com       | beatriz123  | profissional  |
| Dr. André Melo        | andre@vitaclin.com         | andre123    | profissional  |
