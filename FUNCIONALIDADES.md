# Help Desk Inteligente — Funcionalidades e Melhorias

> Protótipo de alta fidelidade para o Hackathon de Gestão Pública.
> **Motor de Priorização e Roteamento Dinâmico**

**Stack:** React 19 · Vite · Tailwind CSS v4 · Lucide-react  
**Identidade Visual Oficial:**
- 🛡️ **Logo Oficial:** Escudo e Rosa dos Ventos com Pin Municipal (`/logo.png`)
- 🔵 **Azul Claro (Início do degradê):** `#3B82F6`
- 🏛️ **Azul Institucional (Fim do degradê):** `#1E3A8A`
- 🟢 **Verde Claro (Acentos e Conclusões):** `#34D399`

**Como rodar:** `npm install` e depois `npm run dev` → http://localhost:5173/

> [!NOTE]
> Este é um **protótipo visual**. Todos os dados são *mockados* (fixos no código)
> e não há backend, banco de dados nem integrações reais. O foco é demonstrar o
> fluxo e a arquitetura proposta à banca.

---

## 1. Visão Geral

O sistema possui 3 telas, controladas pelo estado `currentScreen`
(`'login'`, `'gestor'`, `'tecnico'`) em [App.jsx](src/App.jsx):

| Tela | Perfil | Plataforma | Objetivo |
|------|--------|------------|----------|
| Login | Todos | Web | Simular autenticação e controle de acesso por perfil |
| Gestor | Gestor | Desktop (Dashboard Web) | Acompanhar o Kanban e os indicadores de otimização |
| Técnico | Técnico de campo | Mobile (PWA) | Executar missões e receber sugestões da IA |

Um **Rodapé de Compliance** fixo aparece em todas as telas.

---

## 2. Funcionalidades Implementadas

### 2.1 Tela de Login
- Título "Help Desk Inteligente" e subtítulo do motor de priorização.
- Dois botões de acesso: **Gestor (Dashboard Web)** e **Técnico (PWA Mobile)**.
- Simula o controle de acesso por perfil (Requisito 4).

### 2.2 Visão do Gestor (Dashboard Web)

**Header**
- Seletor de setor simulado: *"Setor Atual: T.I. / Help Desk ▾"* (aplicação multi-setor, Requisito 1).
- Badge pulsante *"🧠 Motor IA: Ativo"* (Requisito 6).
- Botão **Sair**, que volta ao Login.

**KPIs**

| Indicador | Valor exibido |
|-----------|---------------|
| Economia de Frota Hoje | 84 km poupados |
| Chamados Agrupados pela IA | 12 OS Otimizadas |
| Economia de Papel (Zero Papel) | 36 folhas poupadas (🌱 1 folha por OS digital) |
| SLA Médio de Resposta | 28 min (−15% vs ontem) |

**Toolbar**
- Campo de busca "Buscar OS ou Local..." (aceita digitação, mas ainda não filtra).
- Botões "Filtro Urgência" e "Filtro Localidade" (apenas visuais).

**Kanban Inteligente (4 colunas)**

| Coluna | Cards de exemplo |
|--------|------------------|
| 📥 Entrada Legado (e-Prefeitura) | OS #1090 Monitor Piscando · OS #1093 Sem Acesso · **OS #1102 Câmera CCO Offline** |
| 🧠 Priorizado por IA (Rotas) | **OS #1042 + OS #1088 (Agrupadas)** · **OS #1105 Leitor Biométrico Poupatempo** |
| 🚀 Em Execução (Campo) | OS #1015 Switch Queimado — "Técnico a 200m do local" |
| ✅ Concluído | OS #0998 Troca de Cabo de Rede |

### 2.3 Visão do Técnico (Mobile PWA) — Kanban de Bolso
A visão do técnico conta com **navegação limpa em 3 abas horizontais**, Stepper guiado, fluxo de impedimentos e gamificação:

- **Navegação em Abas (O Kanban de Bolso):**
  - **Aba 1: 🎯 Ativas:**
    - Exibe a missão principal ativa (OS #1042 - Falha de Conectividade no Hospital Municipal) e o Stepper guiado (1. Check-in ➔ 2. Radar IA ➔ 3. Finalizar).
    - Botão de Check-in com validação de GPS municipal.
    - Botão secundário âmbar: **"🚧 Relatar Impedimento (Pausar)"**.
    - Ao relatar impedimento, abre mini-modal rápido (com presets como "Falta de Roteador no estoque") e move **instantaneamente o card para a Aba 2 (Pausadas)**.
  - **Aba 2: 🚧 Pausadas (Lista de Espera em Campo):**
    - Exibe os chamados que aguardam peças de reposição ou retorno futuro.
    - Card fixo: **OS #1088 - Troca de Cabo de Rede** com motivo "Aguardando peça".
    - **A Mágica da IA (O Reencontro no Local):** Destaque com **badge verde neon**:
      *"🤖 IA: Você está no mesmo prédio deste chamado pausado! Deseja reativar?"* com botão **"Retomar Agora"**.
    - Exibe a OS #1042 quando pausada, com aviso em tempo real de que o Gestor foi notificado.
  - **Aba 3: ✅ Concluídas:**
    - Histórico limpo com todas as ordens finalizadas com sucesso, laudos gerados, quilometragem poupada e pontuação por OS conforme prioridade:
      - **Alta:** +3 pontos
      - **Média:** +2 pontos
      - **Baixa:** +1 ponto
      - Missão unificada (#1042 + #1088): **+5 Pontos de OS** (Alta 3 + Média 2).
      - OS #0998 anterior: **+1 Ponto de OS** (Baixa).
- **Gamificação Avançada (Octalysis Framework):**
  - **Pilar 8 (Perda e Prevenção):** Widget e modal de **Ofensiva no Modelo Duolingo Streak** (*🔥 5 Dias Úteis de Ofensiva com círculos da semana útil S T Q Q S [Segunda a Sexta], fogo ativo, OSs sugeridas pela IA aceitas: 7/8, bloqueio de congelamento [Streak Freeze] e modal temático Duolingo com efeito 3D ao tocar no card*).
  - **Pilar 5 (Influência Social e Cooperação):** Widget e modal interativo de **Meta Coletiva Mensal** (*Soma de todas as OSs dos 5 técnicos de campo no fim do mês: 196 / 200 OS [98%]. Ao Carlos finalizar a missão, soma em tempo real para 198 / 200 OS. Ao tocar no card, abre modal com ranking cooperativo e regras do bônus municipal coletivo*).
  - **Pilar 4 (Propriedade e Coleção):** Card de coleção *Tech-Dex* na aba Ativas (*📖 Tech-Dex: 8/12 Equipamentos Catalogados: Roteador Cisco ✅ · Switch Datacenter ✅ · Servidor Dell 🔒*).
  - **Pilar 7 (Imprevisibilidade e Curiosidade):** *Caixa Misteriosa do Dia* no encerramento da missão (*🎁 Tocar para Abrir Feedback de IA e Prêmio Surpresa*, revelando análise contextualizada de impacto social na **UPA Central** gerada por IA + elogio funcional de mérito cívico e folga semestral).
- **Alerta de Compra em Tempo Real no Kanban do Gestor (Desktop):**
  - Ao relatar o impedimento no celular, o card correspondente no Kanban do Gestor **pisca em vermelho vibrante** (`ring-4 animate-pulse`) com a tarja *"🚨 FALTA DE PEÇA (COMPRAR)"*.
  - Exibe um banner urgente no topo do Gestor com o botão **"🛒 Autorizar Compra de Peça (Chefe)"**.
  - O gestor pode autorizar a compra diretamente pelo card, banner ou modal de detalhes, emitindo o pedido via e-Compras Municipal e liberando a OS para o técnico.

### 2.4 Rodapé de Compliance

| Badge | Requisito do edital |
|-------|---------------------|
| API Bidirecional Ativa (e-Prefeitura) | Requisito 2 |
| Host: Datacenter Municipal (Soberania Local) | Requisito 7 |
| Log de Rastreabilidade On | Requisito 4 |

---

## 3. Mapa de Requisitos do Edital

| # | Requisito | Como o protótipo mostra | Situação |
|---|-----------|-------------------------|----------|
| 1 | Aplicação genérica / multi-setor | Seletor de setor no header | 🟡 Visual (sem troca real) |
| 2 | API bidirecional | Badge no rodapé + coluna "Entrada Legado" | 🟡 Visual |
| 3 | Notificações Push | Banner push fixo de OS urgente sugerida pela IA com confirmação obrigatória "Estou Ciente" | 🟢 Fluxo demonstrável |
| 4 | Controle de acesso e rastreabilidade | Login por perfil + badge de log | 🟡 Simulado |
| 5 | Gamificação | Pontos por OS (pesos 3, 2, 1), nível, modal e emblema | 🟢 Fluxo demonstrável |
| 6 | IA | Badge do motor + Radar + card agrupado | 🟡 Simulada (sem algoritmo real) |
| 7 | Soberania digital | Badge de Datacenter Municipal | 🟡 Visual |

Legenda: 🟢 demonstrável de ponta a ponta · 🟡 apenas ilustrado

---

## 4. Situação das Melhorias de Curto Prazo (Implementadas)

Todas as melhorias essenciais para o Pitch foram concluídas e integradas com sucesso:

- [x] **Sincronização em tempo real entre visões:** O estado global foi elevado para o componente pai (`App.jsx` via `useMissions`). Ao finalizar a missão unificada no celular (`TecnicoScreen`), o card especial é movido automaticamente para a coluna `✅ Concluído` e os KPIs do gestor sobem para 96 km e 14 OS.
- [x] **Filtros e busca funcionais:** Busca textual em tempo real por título, local ou região, com dropdowns de filtro por urgência (Alta/Média/Baixa) e localidade (Centro/Zona Norte/Zona Sul).
- [x] **Drag-and-Drop no Kanban:** Arraste e solte nativo e fluido com `@dnd-kit/core` entre as 4 colunas.
- [x] **Mapa interativo de rotas:** Implementado com Leaflet e OpenStreetMap (soberania digital), com rotas traçadas, base municipal e raio geofence dos técnicos.
- [x] **Modal de detalhes e rastreabilidade:** Ao clicar em qualquer card, abre modal com log de auditoria cronológico, rota no mapa e ações rápidas para mover de coluna.
- [x] **KPIs animados e gráfico:** Indicadores com efeito contador suave (`useCountUp`) e gráfico em barras da economia de frota nos últimos 7 dias.
- [x] **Modo simulação ao vivo:** Botão no Gestor que injeta um novo chamado via "e-Prefeitura" na entrada e demonstra a IA roteando-o automaticamente após 3 segundos.

---

## 5. Próximos Passos (Médio e Longo Prazo)

### 5.2 Médio prazo (produto real)
- [ ] **Backend** (Node/NestJS ou Python/FastAPI) e banco PostgreSQL com PostGIS.
- [ ] **Autenticação real** (OAuth2/OIDC ou gov.br) com perfis RBAC e **log de auditoria** imutável.
- [ ] **Integração bidirecional** com a e-Prefeitura (REST/Webhooks, fila de mensagens).
- [ ] **PWA de verdade:** manifest, service worker, modo offline e **Web Push** para notificações.
- [ ] Captura real de **evidências** (câmera, geolocalização e assinatura) no check-in e na finalização.
- [ ] Multi-tenant por setor (T.I., Obras, Saúde, etc.) com SLAs e regras configuráveis.

### 5.3 Inteligência Artificial
- [ ] **Priorização:** score por urgência, SLA, criticidade do local (hospital, escola) e histórico.
- [ ] **Roteamento oportunista:** agrupar OS por proximidade, usando clustering geográfico e solver de rotas (VRP, como OR-Tools).
- [ ] Previsão de falhas recorrentes e sugestão de manutenção preventiva.
- [ ] Triagem automática do texto do chamado (NLP) e sugestão do técnico ideal por habilidade.
- [ ] **IA explicável:** mostrar ao gestor *por que* a OS foi priorizada ou agrupada.

### 5.4 Gamificação (Octalysis)
- [ ] Ranking de equipes, missões diárias e semanais, e *streaks*.
- [ ] Mais emblemas (Sustentabilidade, Velocista, Zero SLA estourado).
- [ ] Meta coletiva com impacto cidadão (ex.: km e CO₂ poupados pela cidade).
- [ ] Recompensas reais (folga, reconhecimento público), alinhadas à política de RH.

### 5.5 Soberania e Compliance
- [ ] Implantação em infraestrutura municipal (containers e Kubernetes on-premise).
- [ ] Aderência à **LGPD**: minimização de dados, consentimento e anonimização.
- [ ] Criptografia em trânsito e em repouso, backups locais e plano de continuidade.
- [ ] Painel de compliance que mostre o status real das integrações, e não apenas badges.

### 5.6 Qualidade e Engenharia
- [ ] Testes unitários (Vitest + Testing Library) e E2E (Playwright).
- [ ] Separar o `App.jsx` em componentes e pastas (`screens/`, `components/`, `data/`).
- [ ] Roteamento com React Router e suporte a TypeScript.
- [ ] Auditoria de acessibilidade (WCAG), com contraste, foco e leitores de tela.
- [ ] Pipeline de CI/CD e Lighthouse para o PWA.

---

## 6. Roteiro Sugerido para a Demonstração (Pitch)

1. **Login** → entrar como **Gestor** e mostrar KPIs, Kanban e o card agrupado pela IA.
2. Apontar o **Rodapé de Compliance** (API, soberania, rastreabilidade).
3. **Sair** → entrar como **Técnico**.
4. Percorrer: **Check-in → IA Radar → Aceitar → Finalizar**.
5. Mostrar o modal de gamificação e o XP atualizado.
6. Fechar com o impacto: *2 problemas, 1 viagem, 12 km poupados.*

---

## 7. Estrutura do Projeto

```text
HACKATHON/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx      # Entrada React
    ├── index.css     # Tailwind + animações customizadas
    └── App.jsx       # Telas: Login, Gestor, Técnico e Rodapé
```
