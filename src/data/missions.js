/* Constantes e dados mockados compartilhados entre as visões Gestor e Técnico. */

export const COLUMNS = [
  { id: 'entrada', title: '📥 Entrada Legado (e-Prefeitura)', label: 'Entrada Legado', accent: 'bg-slate-400' },
  { id: 'ia', title: '🧠 Priorizado por IA (Rotas)', label: 'Priorizado por IA', accent: 'bg-blue-500' },
  { id: 'execucao', title: '🚀 Em Execução (Campo)', label: 'Em Execução', accent: 'bg-amber-400' },
  { id: 'concluido', title: '✅ Concluído', label: 'Concluído', accent: 'bg-emerald-500' },
]

export const COLUMN_LABELS = Object.fromEntries(COLUMNS.map((c) => [c.id, c.label]))

export const COLUMN_COLORS = {
  entrada: '#94a3b8',
  ia: '#3b82f6',
  execucao: '#f59e0b',
  concluido: '#10b981',
}

export const URGENCIES = ['Alta', 'Média', 'Baixa']
export const REGIONS = ['Centro', 'Zona Norte', 'Zona Sul']

export const URGENCY_STYLES = {
  Alta: 'bg-red-50 text-red-700',
  Média: 'bg-amber-50 text-amber-700',
  Baixa: 'bg-emerald-50 text-emerald-700',
}

/* Coordenadas fictícias (demonstração) */
export const BASE = { name: 'Base T.I. / Garagem Municipal', coords: [-23.6925, -46.564] }

/** Remove acentos e coloca em minúsculas (busca tolerante). */
export const normalize = (s = '') =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const INITIAL_MISSIONS = [
  {
    id: 'os-1090',
    kind: 'simple',
    column: 'entrada',
    title: 'OS #1090 - Monitor Piscando',
    location: 'Secretaria de Obras',
    region: 'Centro',
    urgency: 'Baixa',
    coords: [-23.6968, -46.5575],
    isNew: false,
    timeline: [{ time: '08:42', text: 'Chamado recebido via API bidirecional (e-Prefeitura)' }],
  },
  {
    id: 'os-1093',
    kind: 'simple',
    column: 'entrada',
    title: 'OS #1093 - Sem Acesso ao Sistema',
    location: 'Secretaria de Finanças',
    region: 'Centro',
    urgency: 'Média',
    coords: [-23.6951, -46.5602],
    isNew: false,
    timeline: [{ time: '09:05', text: 'Chamado recebido via API bidirecional (e-Prefeitura)' }],
  },
  {
    id: 'grouped-1042-1088',
    kind: 'grouped',
    column: 'ia',
    title: 'OS #1042 + OS #1088 (Agrupadas)',
    location: 'Hospital Municipal',
    region: 'Zona Norte',
    urgency: 'Alta',
    coords: [-23.6812, -46.5701],
    kmSaved: 12,
    agent: { name: 'Agente João', initials: 'JS', level: 3 },
    items: [
      { code: '#1042', title: 'Falha de Conectividade (3º Andar)' },
      { code: '#1088', title: 'Impressora da Triagem' },
    ],
    isNew: false,
    timeline: [
      { time: '08:15', text: 'OS #1042 recebida via API bidirecional (e-Prefeitura)' },
      { time: '08:31', text: 'OS #1088 recebida via API bidirecional (e-Prefeitura)' },
      { time: '08:33', text: 'Motor IA detectou o mesmo prédio e agrupou as 2 OS' },
      { time: '08:34', text: 'Rota otimizada calculada (−12 km) · alocado Agente João' },
    ],
  },
  {
    id: 'os-1015',
    kind: 'simple',
    column: 'execucao',
    title: 'OS #1015 - Switch Queimado',
    location: 'Escola Borda do Campo',
    region: 'Zona Sul',
    urgency: 'Média',
    coords: [-23.7102, -46.5498],
    fieldStatus: 'Técnico a 200m do local',
    agent: { name: 'Agente Marina', initials: 'MA', level: 2 },
    isNew: false,
    timeline: [
      { time: '07:50', text: 'Chamado recebido via API bidirecional (e-Prefeitura)' },
      { time: '08:10', text: 'Priorizado pelo Motor IA e despachado ao Agente Marina' },
      { time: '09:18', text: 'Técnico a 200m do local (geofence)' },
    ],
  },
  {
    id: 'os-0998',
    kind: 'simple',
    column: 'concluido',
    title: 'OS #0998 - Troca de Cabo de Rede',
    location: 'UBS Centro',
    region: 'Centro',
    urgency: 'Baixa',
    coords: [-23.6989, -46.5631],
    resolvedIn: '22 min',
    agent: { name: 'Agente Carlos', initials: 'CP', level: 4 },
    isNew: false,
    timeline: [
      { time: '07:30', text: 'Chamado recebido via API bidirecional (e-Prefeitura)' },
      { time: '07:34', text: 'Priorizado pelo Motor IA e despachado ao Agente Carlos' },
      { time: '07:52', text: 'Evidência enviada — chamado resolvido em 22 min' },
    ],
  },
  {
    id: 'os-1102',
    kind: 'simple',
    column: 'entrada',
    title: 'OS #1102 - Câmera de Monitoramento Offline',
    location: 'Guarda Municipal / CCO',
    region: 'Centro',
    urgency: 'Alta',
    coords: [-23.6935, -46.559],
    isNew: false,
    timeline: [
      { time: '09:20', text: 'Chamado recebido via API bidirecional (e-Prefeitura)' },
      { time: '09:22', text: 'Triagem automática do CCO — Urgência Alta 🔴' },
    ],
  },
  {
    id: 'os-1105',
    kind: 'simple',
    column: 'ia',
    title: 'OS #1105 - Leitor Biométrico Travado',
    location: 'Poupatempo / Posto Cidadão',
    region: 'Zona Sul',
    urgency: 'Média',
    coords: [-23.704, -46.551],
    kmSaved: 6,
    isNew: false,
    timeline: [
      { time: '09:35', text: 'Chamado recebido via API bidirecional (e-Prefeitura)' },
      { time: '09:38', text: 'IA incluiu na rota Zona Sul (Poupatempo)' },
    ],
  },
]

/* Chamados usados no "Modo Simulação" do gestor (chegam ao vivo via "API"). */
export const SIMULATED_CALLS = [
  { problem: 'Telefone sem Linha', location: 'Biblioteca Municipal', region: 'Centro', urgency: 'Média', coords: [-23.699, -46.5612] },
  { problem: 'Servidor Fora do Ar', location: 'Secretaria de Saúde', region: 'Zona Norte', urgency: 'Alta', coords: [-23.683, -46.568] },
  { problem: 'Wi-Fi Instável', location: 'CRAS Zona Sul', region: 'Zona Sul', urgency: 'Alta', coords: [-23.7065, -46.5535] },
]
