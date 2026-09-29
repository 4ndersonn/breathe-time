# Breathe Time - Frontend

Interface web moderna desenvolvida em **React**, **Vite**, **TypeScript**, **Material UI (MUI)**, **MUI X Data Grid**, **Recharts** e **Framer Motion** para consumo da API Flask do projeto Breathe Time.

## Pré-requisitos
- Node.js (versão 18 ou superior recomendada)
- API Flask rodando no backend (porta 5000 por padrão)

## Instalação e Execução

1. Instalar as dependências (ignorando scripts nativos travados pelo Windows caso necessário):
   ```bash
   npm install --ignore-scripts
   ```

2. Configurar a URL da API (opcional, padrão `http://localhost:5000/api`):
   Crie um arquivo `.env` na raiz do `frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. Executar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Executar os testes automatizados (Vitest):
   ```bash
   npm test -- --run
   ```

5. Build de produção:
   ```bash
   npm run build
   ```
