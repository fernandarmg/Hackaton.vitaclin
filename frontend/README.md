# VitaClin — Front-end

Interface web da plataforma VitaClin, construída com **React + Vite + Styled Components**.

## Stack

| Camada       | Tecnologia              |
|--------------|-------------------------|
| Framework    | React 18                |
| Build tool   | Vite                    |
| Estilização  | Styled Components v6    |
| Roteamento   | React Router DOM v6     |
| HTTP         | Axios                   |

## Estrutura

```
vitaclin-frontend/
├── src/
│   ├── main.jsx                  # Entrada — ThemeProvider, BrowserRouter, AuthProvider
│   ├── App.jsx                   # Rotas e ProtectedRoute
│   ├── styles/
│   │   ├── theme.js              # Design tokens (cores, sombras, espaçamentos)
│   │   └── GlobalStyle.js        # CSS global com createGlobalStyle
│   ├── contexts/
│   │   └── AuthContext.jsx       # Contexto de autenticação (signIn, signOut, canAccess)
│   ├── services/
│   │   └── api.js                # Todas as chamadas à API (axios)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx        # Wrapper geral (Sidebar + Topbar + Content)
│   │   │   ├── Sidebar.jsx       # Menu lateral com styled-components
│   │   │   └── Topbar.jsx        # Barra superior com badge de perfil
│   │   └── ui/
│   │       └── index.jsx         # Componentes reutilizáveis (Card, Button, Badge, Table…)
│   └── pages/
│       ├── LoginPage.jsx         # Tela de login com seleção de perfil
│       ├── DashboardPage.jsx     # Dashboard com KPIs, fidelidade, churn
│       ├── PatientsPage.jsx      # CRUD completo de pacientes
│       ├── ProfessionalsPage.jsx # Listagem de profissionais
│       ├── AgendaPage.jsx        # Agendamentos por data
│       ├── FinancePage.jsx       # Financeiro (só admin)
│       ├── ServicesPage.jsx      # Catálogo de serviços
│       └── PlansPage.jsx         # Planos por especialidade
├── index.html
├── vite.config.js
└── package.json
```

## Como rodar

### 1. Pré-requisitos
- Node.js 18+
- Back-end rodando em `http://localhost:8000`

### 2. Instalar dependências
```bash
npm install
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

Acesse: `http://localhost:5173`

### 4. Build para produção
```bash
npm run build
```

## Autenticação e perfis

O sistema possui dois perfis com permissões distintas:

| Perfil        | Acesso                                                   |
|---------------|----------------------------------------------------------|
| Admin         | Todas as páginas — visão global de pacientes e dados     |
| Profissional  | Dashboard, Agenda, Meus Pacientes, Meu Perfil, Serviços, Planos — dados filtrados pelo seu nome |

O controle de acesso é feito via `AuthContext` + `ProtectedRoute`. A sidebar é renderizada dinamicamente conforme o perfil.

## Styled Components — como usamos

O `ThemeProvider` em `main.jsx` injeta o tema em toda a árvore de componentes. Exemplo de uso:

```jsx
import styled from 'styled-components'

const Card = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.b3};
  color: #fff;
  /* props dinâmicas: */
  opacity: ${({ $disabled }) => $disabled ? .5 : 1};
`
```

Todos os tokens de design estão em `src/styles/theme.js`.

## Credenciais de demo

| Usuário            | Email                   | Senha      | Perfil       |
|--------------------|-------------------------|------------|--------------|
| Renata Souza       | renata@vitaclin.com     | admin123   | Admin        |
| Dra. Camila Torres | camila@vitaclin.com     | camila123  | Profissional |

> **Fallback automático:** se o back-end não estiver disponível, o login funciona com as credenciais acima via autenticação local. Os dados de pacientes, profissionais e agendamentos são carregados do MongoDB quando o backend está rodando.

## Principais páginas implementadas

| Página | Funcionalidades |
|--------|----------------|
| **Dashboard** | KPIs, gráfico de receita mensal, visão de pacientes (3 anéis), avaliações recentes |
| **Pacientes** | Listagem com busca, filtros, perfil completo com 6 abas |
| **Perfil do Paciente** | Dados cadastrais, anamnese, formulário de avaliação clínica, resultados, histórico de consultas |
| **Profissionais** | Cards com métricas reais, perfil com agenda semanal e lista de pacientes |
| **Financeiro** | KPIs, filtros por período, gráficos SVG, modal de novo lançamento |
| **Planos** | Planos por especialidade, combinados e por perfil de paciente |
