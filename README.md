# Inventory Management Web (Autoflex)

Aplicação Front-end desenvolvida com **React**, **TypeScript** e **Vite** para o gerenciamento de inventário industrial. O sistema oferece uma interface moderna e responsiva para o controle de matérias-primas, criação de receitas de produtos e visualização de planos de produção automatizados.

---

## 🚀 Funcionalidades

* **Gestão de Estoque (Matérias-Primas)**

  * Visualização clara de saldos
  * Cadastro e edição de insumos com validação em tempo real
  * Interface para controle de entrada/saída

* **Catálogo de Produtos & Receitas**

  * Criação de produtos finais
  * **Montador de Receitas Dinâmico:** Adição de múltiplos ingredientes (matérias-primas) para compor um produto

* **Planejamento de Produção**

  * Dashboard de sugestão de produção (Priorização por rentabilidade)
  * Visualização de itens fabricáveis com base no estoque atual
  * Feedback visual de "Empty State" quando não há insumos suficientes

* **Experiência do Usuário (UX)**

  * Feedback visual de carregamento (Loaders)
  * Modais interativos para ações de CRUD
  * Tratamento de erros amigável

---

## 🛠 Tecnologias e Frameworks

* **Linguagem:** TypeScript
* **Core:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilização & Ícones:** CSS Modules, [Lucide React](https://lucide.dev/)
* **Roteamento:** React Router DOM
* **Comunicação HTTP:** Axios
* **Qualidade e Testes:**
  * **Unitários:** Vitest + React Testing Library
  * **Integração (E2E):** Cypress

---

## 📦 Como Rodar o Projeto

### Pré-requisitos

Certifique-se de que o **Node.js** (versão 18 ou superior) e o **npm** estão instalados.
É necessário que o Backend (API) esteja rodando na porta `8080`.

### 1. Instalação das Dependências

Na raiz do projeto front-end, execute:

```bash
npm install
```

### 2. Configuração de Ambiente

O projeto está configurado para buscar a API no endereço padrão local.

Caso precise alterar, verifique: **Configuração do Axios:** `src/services/api.ts`

**API Base URL padrão:** `http://localhost:8080/api`

### 3. Execução (Modo Dev)

Para iniciar o servidor de desenvolvimento com Hot Reload:
`npm run dev`

A aplicação estará disponível em: `http://localhost:5173`

---

## 🧪 Testes de Qualidade
O front-end possui uma estratégia de testes robusta, cobrindo desde componentes isolados até fluxos completos de usuário.

**Testes Unitários (Vitest)**
Validam a renderização de componentes, lógica de serviços e mocks de API.

`npm test`

**Testes de Integração/E2E (Cypress)**
Validam o fluxo completo do usuário simulando um navegador real. Garanta que a aplicação está rodando. Em outro terminal, abra a interface do Cypress:

`npx cypress open`

Nota: Os testes utilizam Mocks e Stubs (interceptadores de rede), garantindo que o front-end possa ser testado mesmo se o backend estiver offline.

---

## 📑 Estrutura da Aplicação

A navegação é intuitiva e dividida em módulos principais:

| Rota             | Componente     | Descrição                                     |
| ---------------- | -------------- | --------------------------------------------- |
| `/`              | `Home`         | Dashboard principal e menu de navegação       |
| `/raw-materials` | `RawMaterials` | Listagem e CRUD de matérias-primas            |
| `/products`      | `Products`     | Catálogo de produtos e montagem de receitas   |
| `/production`    | `Production`   | Relatório de sugestão de produção otimizada   |

---

## 🧠 Observações Finais

* Projeto desenvolvido como **desafio técnico para a Autoflex**
