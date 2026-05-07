# Dashboard SO - Nuvem e Sistemas Operacionais

Aplicação Node.js + Express para monitoramento de informações do Sistema Operacional, criada para a atividade **Projeto - Nuvem e Sistemas Operacionais** da FATEC.

O painel exibe dados reais do ambiente onde a aplicação está executando: máquina local ou cloud.

---

## 🔗 Links do Projeto

🌐 **Aplicação no Render:** https://dashboard-so-pxmb.onrender.com

🚂 **Aplicação no Railway:** https://dashboard-so-production-43e9.up.railway.app

---

## 🎯 Objetivo

Apresentar, em uma interface web completa e responsiva, dados reais do ambiente onde a aplicação está executando, permitindo comparar a execução local com ambientes de nuvem como Render e Railway.

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- CORS
- Módulos nativos: `os`, `fs`, `path` e `process`
- HTML, CSS e JavaScript puro

---

## ⚙️ Como Instalar

```
npm install
```

## ▶️ Como Executar Localmente

```
node index.js
```

Depois acesse: `http://localhost:3000`

---

## ☁️ Deploy no Render

Configuração utilizada:

| Campo | Valor |
| --- | --- |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Environment | Node |
| Port | Definida automaticamente via `process.env.PORT` |

A aplicação escuta em `process.env.PORT || 3000`, funcionando tanto localmente quanto no Render sem URL hardcoded.

---

## 🚂 Deploy no Railway

O Railway foi utilizado como segunda plataforma de deploy para comparação com o Render.

Configuração utilizada:

| Campo | Valor |
| --- | --- |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Environment | Node |

---

## 🗂️ Estrutura do Projeto

```
so-dashboard/
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── public/
    └── index.html
```

---

## 📡 Rotas Disponíveis

| Rota | Descrição |
| --- | --- |
| `GET /` | Dashboard visual completo |
| `GET /api/sysinfo` | Informações do sistema em JSON |

---

## 📊 Informações Exibidas

**Resumo executivo (barra do topo):**
- Uso de RAM, uso médio de CPU, uptime, quantidade de arquivos, IP principal e status da máquina

**Cards do dashboard:**
- **Sistema:** hostname, tipo do SO, release/kernel, plataforma, arquitetura, endianness e versão do Node.js
- **Usuário:** usuário atual, diretório home, temporário, shell, UID e GID
- **RAM:** memória total, usada, livre e barra visual de uso
- **CPU:** núcleos, modelo, load average e uso por núcleo com barras visuais
- **Rede:** IP principal, interfaces, endereços IPv4/IPv6
- **Arquivos:** lista de arquivos do projeto, tipo e tamanho
- **Tempo:** uptime formatado, timezone e timestamp ISO
- **Aplicação:** PID, diretório atual, caminho do executável Node.js e memória do processo
- **Ambiente:** local ou cloud, PORT, NODE_ENV e status

---

## 📚 Conceitos de Sistemas Operacionais Demonstrados

- Gerenciamento de memória
- Monitoramento de CPU
- Processos e PID
- Usuários do sistema
- Sistema de arquivos
- Interfaces de rede
- Uptime e tempo do sistema
- Diferenças entre execução local e em nuvem

---

## 🖥️ Screenshot Local

<img width="1919" height="1000" alt="image" src="https://github.com/user-attachments/assets/e0eab93c-b49f-4f09-b5b2-0fd690ee308f" />


---

## ☁️ Screenshot no Render

<img width="1916" height="984" alt="image" src="https://github.com/user-attachments/assets/1c323004-adf9-457a-9ccf-9ec018fa21c8" />


---

## 🚂 Screenshot no Railway

<img width="1907" height="984" alt="image" src="https://github.com/user-attachments/assets/33b5ae74-93b8-4e80-a26e-316fdcc98fb2" />

---

## 🔄 Comparação: Execução Local vs Cloud

Na execução local, os dados refletem o computador do desenvolvedor em questão: hostname, usuário, diretórios, memória e interfaces da máquina local.

No Render ou no cloud, os dados refletem o container/servidor disponibilizado pela plataforma. Alguns campos podem ser diferentes ou limitados por segurança, como shell, UID/GID, hostname temporário, IP interno e variáveis de ambiente.

---

## ⚖️ Comparação: Render vs Railway

| Critério | Render | Railway |
| --- | --- | --- |
| Plano gratuito | Sim | Sim (trial) |
| Deploy via GitHub | Sim | Sim |
| Detecção automática Node.js | Sim | Sim |
| Hiberna sem uso | Sim (plano free) | Não |
| Interface | Simples e direta | Mais completa |
| Ideal para | Projetos acadêmicos | Projetos com múltiplos serviços |

Render e Railway são plataformas PaaS semelhantes. O Render é bastante direto para projetos acadêmicos. O Railway oferece uma experiência mais voltada a projetos compostos por múltiplos serviços.

---

## ✅ Conclusão

O projeto demonstra como uma aplicação Node.js pode consultar informações do Sistema Operacional com módulos nativos e apresentar esses dados em um dashboard web completo. A mesma base funciona localmente e na nuvem, permitindo comparar os ambientes e relacionar os resultados com conceitos de Sistemas Operacionais.

---

## 👩‍💻 Identificação

**Disciplina:** Nuvem e Sistemas Operacionais  
**Professor:** Prof. Me. Deivison S. Takatu  
**Instituição:** FATEC  
**Repositório:** https://github.com/marcellegg/so-dashboard  
**Render:** https://dashboard-so-pxmb.onrender.com  
**Railway:** https://dashboard-so-production-43e9.up.railway.app
