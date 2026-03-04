# 🚀 Local Agile MCP Server

Um **servidor MCP (Model Context Protocol)** local que integra diretamente com a API do **ClickUp**, permitindo que assistentes de IA e LLMs interajam com seu workspace ClickUp de forma transparente e em tempo real.

---

## 📖 Sobre o Projeto

O **Local Agile MCP Server** é um servidor que implementa o protocolo MCP para expor dados e operações do ClickUp como ferramentas acessíveis por modelos de linguagem (LLMs). Com ele, um assistente de IA consegue consultar e navegar pela estrutura completa do seu workspace — **Teams, Spaces, Folders, Lists e Tasks** — tudo via comunicação padronizada pelo MCP.

### O que é o MCP?

O **Model Context Protocol (MCP)** é um protocolo aberto que padroniza a comunicação entre aplicações de IA e fontes de dados/ferramentas externas. Ele funciona como uma "ponte" que permite aos LLMs acessar informações contextuais e executar ações em serviços externos de maneira estruturada e segura.

### Por que este projeto?

Gerenciar projetos ágeis envolve constante consulta e atualização de tarefas, sprints e backlogs. Este servidor elimina a necessidade do trabalho manual e repetitivo para manter o time informado — seu assistente de IA pode buscar informações do ClickUp, criar tarefas e atualizar status diretamente na conversa, aumentando a produtividade e reduzindo o atrito no fluxo de trabalho.

---

## 🏗️ Arquitetura

O servidor carrega a hierarquia completa do ClickUp e a disponibiliza através do protocolo MCP via transporte **stdio**:

```
┌─────────────────┐     stdio      ┌──────────────────────┐     HTTPS      ┌─────────────┐
│   LLM / Client  │ ◄────────────► │  Local Agile MCP     │ ◄────────────► │  ClickUp    │
│   (ex: Claude)  │     MCP        │  Server              │     API v2     │  API        │
└─────────────────┘                └──────────────────────┘                └─────────────┘
```

### Estrutura do Projeto

```
Local-Agile-MCP-Server/
├── src/
│   ├── index.ts                # Ponto de entrada — inicializa o McpServer
│   └── clickup/
│       ├── client.ts           # Cliente HTTP (Axios) configurado para a API do ClickUp
│       ├── config.ts           # Carregamento de variáveis de ambiente (dotenv)
│       ├── loadStructure.ts    # Carrega a hierarquia completa do workspace
│       └── index.ts            # Barrel export do módulo ClickUp
├── server.ts                   # (reservado para expansão futura)
├── tsconfig.json               # Configuração do compilador TypeScript
├── package.json                # Dependências e scripts do projeto
├── .env.example                # Exemplo de configuração de variáveis de ambiente
└── .gitignore                  # Regras de exclusão do Git
```

---

## 🛠️ Ferramentas e Tecnologias

| Tecnologia | Versão | Propósito |
|---|---|---|
| **TypeScript** | ^5.9 | Linguagem principal — tipagem estática para maior robustez e manutenibilidade |
| **Node.js** | ≥18 | Runtime de execução do servidor |
| **@modelcontextprotocol/sdk** | ^1.27 | SDK oficial do MCP — fornece `McpServer` e `StdioServerTransport` para comunicação padronizada |
| **Axios** | ^1.13 | Cliente HTTP para consumir a API REST v2 do ClickUp |
| **Zod** | ^3.25 | Validação e parsing de schemas — garante integridade dos dados recebidos da API |
| **dotenv** | ^17.3 | Carregamento seguro de variáveis de ambiente a partir do arquivo `.env` |

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** (incluído com o Node.js)
- Uma **API Key pessoal** do ClickUp ([como gerar](https://docs.clickup.com/en/articles/1367130-getting-started-with-the-clickup-api))

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/caio-ximenes/Local-Agile-MCP-Server.git
   cd Local-Agile-MCP-Server
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` e insira sua API Key do ClickUp:
   ```env
   CLICKUP_API_KEY = sua_api_key_pessoal
   ```

4. **Compile o projeto:**
   ```bash
   npx tsc
   ```

5. **Execute o servidor:**
   ```bash
   node --loader ts-node/esm src/index.ts
   ```

---

## 🔌 Integração com Clientes MCP

Este servidor utiliza o transporte **stdio**, o que significa que ele é iniciado como um processo filho pelo cliente MCP. Exemplo de configuração para um cliente compatível:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "node",
      "args": ["--loader", "ts-node/esm", "src/index.ts"],
      "cwd": "/caminho/para/Local-Agile-MCP-Server"
    }
  }
}
```

---

## 📡 Dados Disponíveis do ClickUp

O servidor carrega e disponibiliza a seguinte hierarquia:

- **Teams** — Workspaces do ClickUp
  - **Spaces** — Espaços dentro de cada team
    - **Folders** — Pastas organizacionais
      - **Lists** — Listas de tarefas
        - **Tasks** — Tarefas individuais

Cada entidade é mapeada com `id` e `name`, permitindo navegação e consulta estruturada por parte do LLM.

---

## 🗺️ Roadmap

- [ ] Implementar ferramentas MCP para criação e atualização de tasks
- [ ] Adicionar suporte a Boards (views)
- [ ] Implementar cache local para reduzir chamadas à API
- [ ] Adicionar ferramentas de sprint management
- [ ] Suporte a webhooks do ClickUp para atualizações em tempo real

---

## 📄 Licença

Este projeto está licenciado sob a licença **ISC**. Consulte o arquivo `LICENSE` para mais detalhes.
