# 🎉 Party Time Events — Full-Stack Event Management Platform

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/ODM-Mongoose-880000)](https://mongoosejs.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

Aplicação **full-stack** para gestão de festas e serviços, com foco em experiência do usuário, regras de negócio reais e arquitetura moderna para deploy cloud.

Ideal para portfólio técnico de:
- Desenvolvimento Full-Stack JavaScript
- Integração React + Node + MongoDB
- Boas práticas de testes e deploy serverless

---

## 📌 Visão Geral

O **Party Time Events** permite criar e gerenciar eventos (festas) e serviços associados (buffet, decoração, etc.), validando regras importantes como:

- orçamento da festa
- soma dos custos dos serviços
- restrições de atualização quando o orçamento é insuficiente

A solução foi estruturada em **monorepo** com frontend e backend separados, facilitando evolução e manutenção.

---

## 🚀 Funcionalidades Principais

### Gestão de Festas (Parties)
- ✅ Criar festa
- ✅ Listar festas
- ✅ Buscar festa por ID
- ✅ Atualizar festa
- ✅ Remover festa
- ✅ Validação de orçamento vs. custo total de serviços

### Gestão de Serviços (Services)
- ✅ Criar serviço
- ✅ Listar serviços
- ✅ Buscar serviço por ID
- ✅ Atualizar serviço
- ✅ Remover serviço

### Frontend UX
- ✅ Navegação com `react-router-dom`
- ✅ Tratamento de erros com `ErrorBoundary`
- ✅ Notificações visuais
- ✅ Telas dedicadas para criação/edição/visualização

---

## 🧱 Arquitetura

### Frontend
- **React + Vite**
- Componentização por rotas e componentes reutilizáveis
- Consumo de API com `axios`

### Backend
- **Node.js + Express**
- Controllers por domínio (`partyController`, `serviceController`)
- Rotas RESTful
- Persistência em MongoDB com `mongoose`

### Banco de Dados
- **MongoDB Atlas** (ou instância local)
- Modelagem com Schemas Mongoose:
  - `Party`
  - `Service`

### Deploy
- Preparado para **Vercel** com:
  - frontend estático (`frontend/dist`)
  - backend serverless (`api/index.js`)
  - roteamento central em `vercel.json`

---

## 🗂️ Estrutura do Projeto

```bash
party-time-events-main/
├── api/
│   └── index.js                # entrypoint serverless (Vercel)
├── backend/
│   ├── app.js                  # bootstrap local (connect + listen)
│   ├── server.js               # app Express exportável
│   ├── controllers/
│   ├── db/
│   │   └── conn.js
│   ├── models/
│   ├── routes/
│   └── tests/                  # Jest + Supertest + MongoMemoryServer
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── axios/
│   │   └── test/               # setup Vitest + Testing Library
│   ├── vite.config.js
│   └── package.json
├── vercel.json
├── TEST_REPORT.md
└── README.md
```

---

## 🛠️ Stack Tecnológica

### Frontend
- React
- Vite
- React Router DOM
- Axios
- React Toastify

### Backend
- Node.js
- Express
- Mongoose
- CORS / Morgan / Body-Parser / Method-Override

### Qualidade e Testes
- Jest
- Supertest
- mongodb-memory-server
- Vitest
- Testing Library (`react`, `jest-dom`, `user-event`)

---

## ⚙️ Como Rodar Localmente

## Pré-requisitos
- Node.js 18+
- npm 9+
- MongoDB Atlas (recomendado) ou Mongo local

## 1) Clone o repositório
```bash
git clone <URL_DO_REPO>
cd party-time-events-main
```

## 2) Configurar variáveis de ambiente (backend)
Crie `backend/.env`:

```env
MONGODB_URI=sua_string_de_conexao_mongodb
```

## 3) Instalar dependências
```bash
cd backend
npm install

cd ../frontend
npm install
```

## 4) Rodar backend (local)
```bash
cd backend
npm start
```
Backend local em: `http://localhost:3000`

## 5) Rodar frontend (local)
```bash
cd frontend
npm run dev
```
Frontend local (Vite): normalmente `http://localhost:5173`

---

## 📡 Referência Rápida da API

Base URL local:
`http://localhost:3000/api`

### Services
- `POST /services`
- `GET /services`
- `GET /services/:id`
- `PUT /services/:id`
- `DELETE /services/:id`

### Parties
- `POST /parties`
- `GET /parties`
- `GET /parties/:id`
- `PUT /parties/:id`
- `DELETE /parties/:id`

### Exemplo de criação de serviço
```json
{
  "name": "Buffet Premium",
  "description": "Cardápio completo para 100 pessoas",
  "price": 3500,
  "image": "https://url-da-imagem.com/buffet.jpg"
}
```

### Exemplo de criação de festa
```json
{
  "title": "Aniversário 30 anos",
  "author": "João",
  "description": "Festa temática com DJ",
  "budget": 8000,
  "image": "https://url-da-imagem.com/festa.jpg",
  "services": [
    {
      "name": "Buffet Premium",
      "description": "Cardápio completo",
      "price": 3500,
      "image": "https://url-da-imagem.com/buffet.jpg"
    }
  ]
}
```

---

## 🧪 Testes

## Backend
Frameworks:
- Jest + Supertest + mongodb-memory-server

Cobertura implementada:
- criação/listagem de services
- criação de parties (sucesso e orçamento insuficiente)
- busca por id (200/404)
- update de party

Executar:
```bash
cd backend
npm test
```

## Frontend
Frameworks:
- Vitest + Testing Library

Testes implementados:
- Navbar
- ErrorBoundary
- Home
- CreateParty
- Party
- EditParty

Executar:
```bash
cd frontend
npm run test
```

---

## ☁️ Deploy na Vercel

Projeto preparado para deploy com:
- `vercel.json` (roteamento + builds)
- `api/index.js` (backend serverless)
- `frontend/dist` (build estático)

## Passos
1. Importar repositório na Vercel
2. Definir variável de ambiente:
   - `MONGODB_URI`
3. Confirmar build command do frontend (via static build)
4. Deploy

---

## 📈 Roadmap (Melhorias Futuras)

- [ ] Autenticação e autorização (JWT/OAuth)
- [ ] Upload real de imagens (Cloudinary/S3)
- [ ] Paginação e filtros avançados
- [ ] Painel admin com métricas
- [ ] Cobertura de testes com relatório HTML/CI
- [ ] Pipeline CI/CD com GitHub Actions

---

🤖 Sobre o processo de desenvolvimento

Além da implementação da aplicação, utilizei ferramentas de Inteligência Artificial como apoio durante o desenvolvimento para revisar código, discutir alternativas de implementação e elaborar alguns cenários de testes automatizados.

Os testes foram posteriormente executados, analisados e ajustados por mim para validar regras de negócio, comportamento da API e persistência correta dos dados no MongoDB.

Acredito que a IA pode acelerar tarefas de engenharia, mas compreender os resultados, validar as implementações e garantir a qualidade da aplicação continuam sendo responsabilidades do desenvolvedor.

---

## 👨‍💻 Autor

**João Pedro**  
Projeto desenvolvido como destaque de portfólio Full-Stack.

- GitHub: `https://github.com/SEU_USUARIO`
- LinkedIn: `https://linkedin.com/in/SEU_PERFIL`

> Dica: substitua os links acima pelos seus links reais antes de publicar.

---

## 📝 Licença

Este projeto está sob licença **ISC** (conforme `package.json` do backend).  
Sinta-se à vontade para adaptar para uso pessoal/educacional.
