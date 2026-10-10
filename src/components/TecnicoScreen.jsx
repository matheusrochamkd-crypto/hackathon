import { useState } from 'react'
import {
  AlertOctagon,
  AlertTriangle,
  Bell,
  BellRing,
  BookOpen,
  Bot,
  Car,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Flame,
  Gift,
  Heart,
  Leaf,
  Lightbulb,
  Loader2,
  LogOut,
  MapPin,
  Medal,
  Mic,
  PauseCircle,
  PlayCircle,
  Printer,
  Quote,
  Radio,
  RefreshCw,
  RotateCcw,
  Route,
  Sparkles,
  Star,
  Trophy,
  Undo2,
  Users,
  WifiOff,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

export default function TecnicoScreen({
  missions = [],
  onLogout,
  onFinishMission,
  onReportImpediment,
  onResolveImpediment,
  onResetMissions,
  alreadyCompleted = false,
  activeMission = null,
}) {
  // Controle de abas: 'ativas' | 'pausadas' | 'concluidas'
  const [activeTab, setActiveTab] = useState('ativas')
  const [missionStep, setMissionStep] = useState(alreadyCompleted ? 3 : 1) // 1: check-in | 2: oportunidade IA | 3: finalizar
  const [ignored, setIgnored] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [completed, setCompleted] = useState(alreadyCompleted)

  // OS 100% Digital: Checklist, Laudo por Voz e Assinatura
  const [checkLink, setCheckLink] = useState(true)
  const [checkCable, setCheckCable] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState(
    'Laudo: Conector RJ45 refeito no rack e porta do switch reativada. Conexão do setor restabelecida.'
  )

  // Caixa Misteriosa (Pilar 7: Imprevisibilidade e Curiosidade)
  const [mysteryOpened, setMysteryOpened] = useState(false)

  // Mini-Modal de Impedimento
  const [impedimentModalOpen, setImpedimentModalOpen] = useState(false)
  const [impedimentReason, setImpedimentReason] = useState('Falta de Roteador no estoque')
  const [customReason, setCustomReason] = useState('')

  // Estado da OS #1088 pausada reativada pela IA
  const [os1088Reactivated, setOs1088Reactivated] = useState(false)

  const isMainPaused = Boolean(activeMission?.hasImpediment)
  const mainImpedimentReason = activeMission?.impedimentReason || 'Falta de Roteador no estoque'

  const countAtivas = isMainPaused || completed ? (os1088Reactivated ? 1 : 0) : 1
  const countPausadas = 1 + (isMainPaused ? 1 : 0) - (os1088Reactivated ? 1 : 0)
  const countConcluidas = 1 + (completed ? 1 : 0)

  // Modal de Detalhes da Meta Coletiva de Fim de Mês (Pilar 5)
  const [showTeamModal, setShowTeamModal] = useState(false)

  // Modal de Ofensiva Estilo Duolingo (Pilar 8: Perda e Prevenção)
  const [showStreakModal, setShowStreakModal] = useState(false)

  // Sistema de Pontuação por OS:
  // - Prioridade Alta: 3 pontos
  // - Prioridade Média: 2 pontos
  // - Prioridade Baixa: 1 ponto
  // Base acumulada do Carlos: 24 Pontos de OS (8 chamados anteriores)
  // Ao concluir a missão unificada (#1042 Alta + #1088 Média): +5 Pontos (3 + 2)
  const basePontosOS = 24
  const pontosOS = basePontosOS + (completed ? 5 : 0) + (os1088Reactivated ? 2 : 0)
  const metaPontosNivel = 30
  const pontosPercent = Math.min(100, Math.round((pontosOS / metaPontosNivel) * 100))

  // META COLETIVA MENSAL (Soma de todas as OS de todos os técnicos no final do mês)
  const metaMensalEquipeOS = 200
  const baseEquipeOS = 196
  const osCarlosSessao = (completed ? 2 : 0) + (os1088Reactivated ? 1 : 0)
  const totalEquipeOS = Math.min(metaMensalEquipeOS, baseEquipeOS + osCarlosSessao)
  const percentualEquipe = Math.round((totalEquipeOS / metaMensalEquipeOS) * 100)
  const faltamEquipeOS = Math.max(0, metaMensalEquipeOS - totalEquipeOS)

  // Sugestões de OS da IA aceitas na semana (Pilar 8: Ofensiva e Aderência à IA)
  const baseSugestoesIa = 7
  const sugestoesIaAceitas = baseSugestoesIa + (missionStep >= 3 ? 1 : 0)

  // Notificação Push de OS Urgente sugerida pela IA
  // REQUISITO: Permanece na tela até o técnico apertar o botão "Estou Ciente"
  const [pushUrgentOpen, setPushUrgentOpen] = useState(true)
  const [pushToastTime, setPushToastTime] = useState(null)

  const handleAcknowledgePush = () => {
    setPushUrgentOpen(false)
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setPushToastTime(agora)
    if (missionStep === 1) {
      setMissionStep(2)
    }
  }

  const handleCheckin = () => setMissionStep(2)
  const handleAcceptUnified = () => setMissionStep(3)

  const handleFinish = () => {
    setCompleted(true)
    onFinishMission?.() // Sincroniza em tempo real com o Kanban do Gestor (memória global)
    setShowReward(true)
  }

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false)
    } else {
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        setVoiceTranscript(
          'Laudo: Conector RJ45 refeito no rack e porta do switch reativada. Conexão do setor restabelecida.'
        )
      }, 1200)
    }
  }

  const handleConfirmImpediment = () => {
    const reason = customReason.trim() || impedimentReason
    onReportImpediment?.('grouped-1042-1088', reason)
    setImpedimentModalOpen(false)
    setActiveTab('pausadas')
  }

  const handleResumeMainMission = () => {
    onResolveImpediment?.('grouped-1042-1088')
    setActiveTab('ativas')
  }

  const handleReactivateOs1088 = () => {
    setOs1088Reactivated(true)
    setActiveTab('ativas')
    setMissionStep(2)
  }

  const handleReset = () => {
    setCompleted(false)
    setMissionStep(1)
    setIgnored(false)
    setShowReward(false)
    setOs1088Reactivated(false)
    setCheckLink(true)
    setCheckCable(true)
    setIsRecording(false)
    setMysteryOpened(false)
    onResetMissions?.()
    setActiveTab('ativas')
  }

  // Classes reutilizáveis do tema escuro
  const card = 'rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-lg'
  const btnImpediment =
    'flex items-center justify-center gap-1.5 rounded-2xl border-2 border-amber-400 bg-amber-400/10 px-3 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20 active:scale-95'

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 px-3 pb-24 pt-6">
      <div className="relative mx-auto flex h-[760px] max-h-[calc(100vh-6.5rem)] min-h-[560px] w-full max-w-[420px] flex-col overflow-hidden rounded-[2.5rem] border-[8px] border-black bg-slate-900 text-white shadow-2xl ring-1 ring-slate-700">
        
        {/* NOTIFICAÇÃO PUSH URGENTE DA IA (FIXA ATÉ CLICAR EM "ESTOU CIENTE") */}
        {pushUrgentOpen && (
          <div
            id="notificacao-push-urgente"
            className="animate-slide-in absolute inset-x-3 top-3 z-50 rounded-2xl border-2 border-red-500 bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 p-4 shadow-[0_0_35px_rgba(239,68,68,0.7)] ring-4 ring-red-500/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/25 text-red-300 ring-2 ring-red-400 animate-pulse">
                <BellRing size={20} className="animate-bounce text-red-300" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                    🚨 PUSH URGENTE · IA
                  </span>
                  <span className="text-[10px] font-bold text-red-300">Tempo Real</span>
                </div>
                <h4 className="mt-1 text-xs font-black text-white leading-snug">
                  IA Sugeriu OS Urgente: #1088 (Impressora Triagem)
                </h4>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-200">
                  Chamado crítico no mesmo prédio da <strong className="text-amber-300">UPA Central</strong>. Fila de pacientes da recepção em risco!
                </p>
              </div>
            </div>

            {/* BOTÃO OBRIGATÓRIO DE ESTAR CIENTE */}
            <div className="mt-3.5 space-y-1.5">
              <button
                type="button"
                id="btn-estou-ciente-push"
                onClick={handleAcknowledgePush}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_4px_18px_rgba(16,185,129,0.5)] transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <CheckCircle2 size={16} className="text-slate-950" />
                <span>Estou Ciente do Chamado Urgente</span>
              </button>
              <p className="text-center text-[9px] font-semibold text-red-200/90">
                ⚠️ Notificação fixa: só sai da tela após a confirmação de ciência do técnico.
              </p>
            </div>
          </div>
        )}

        {/* FEEDBACK DE CIÊNCIA REGISTRADA */}
        {pushToastTime && !pushUrgentOpen && (
          <div className="animate-fade-in mx-3 mt-2 flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/80 px-3 py-1.5 text-[10.5px] font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Ciência registrada às {pushToastTime} (e-Prefeitura)
            </span>
            <button
              onClick={() => setPushToastTime(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* HEADER MOBILE DO TÉCNICO */}
        <header className="border-b border-[#1E3A8A]/40 bg-gradient-to-b from-[#0B1329] to-slate-950 px-4 pb-3.5 pt-4 text-white shadow-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Help Desk Logo"
                className="h-10 w-10 object-contain drop-shadow-[0_4px_12px_rgba(59,130,246,0.45)]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
                  <h1 className="text-base font-black tracking-tight text-white">Bom dia, Carlos!</h1>
                </div>
                <p className="text-[11px] font-bold text-[#34D399]">
                  Setor: Saúde (Linha de Frente)
                </p>
              </div>
            </div>
            <button
              id="btn-sair-tecnico"
              onClick={onLogout}
              className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/20 active:scale-95"
            >
              <LogOut size={13} className="text-slate-200" /> Sair
            </button>
          </div>

          {/* BARRA DE PONTOS POR OS */}
          <div className="mt-2.5 rounded-xl border border-slate-700 bg-slate-800/80 p-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1 text-amber-300">
                <Medal size={15} className="text-amber-300" />
                Agente Carlos · Nível 3 | {pontosOS} Pontos de OS 🏅
              </span>
              <span className="text-[11px] text-sky-300">
                {completed ? '🎉 Missão Finalizada' : isMainPaused ? '⏸️ OS Pausada' : `Etapa ${missionStep} de 3`}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#34D399] transition-all duration-700"
                style={{ width: `${pontosPercent}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>Meta: {metaPontosNivel} pts (Nível 4)</span>
              <span className="font-semibold text-amber-300/90">Alta: 3 pts · Média: 2 pts · Baixa: 1 pt</span>
            </div>
          </div>

          {/* WIDGETS DO TOPO (PILARES 5 E 8 DO OCTALYSIS) */}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {/* Card 1 — A Ofensiva (Modelo Duolingo Streak) */}
            <button
              type="button"
              id="btn-ofensiva-duolingo"
              onClick={() => setShowStreakModal(true)}
              className="text-left rounded-xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/15 via-slate-800/95 to-slate-800/95 p-2.5 shadow-[0_0_18px_rgba(245,158,11,0.2)] transition hover:border-amber-400 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] active:scale-95 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/25 text-amber-400 shadow-inner">
                    <Flame size={17} className="fill-amber-400 text-amber-400 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black tracking-tight text-amber-300">5 DIAS</span>
                      <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[8px] font-black uppercase text-amber-300">
                        Streak
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-amber-400/90">Ofensiva IA</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-black text-amber-200">
                  {sugestoesIaAceitas}/8
                </span>
              </div>

              {/* DIAS ÚTEIS ESTILO DUOLINGO: S T Q Q S (SEGUNDA A SEXTA) */}
              <div className="mt-2 flex items-center justify-between gap-1 px-1">
                {[
                  { dia: 'S', ativo: true },
                  { dia: 'T', ativo: true },
                  { dia: 'Q', ativo: true },
                  { dia: 'Q', ativo: true },
                  { dia: 'S', ativo: true, hoje: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-all ${
                        item.ativo
                          ? item.hoje
                            ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.95)] scale-110 ring-2 ring-amber-200'
                            : 'bg-amber-500 text-slate-950'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.ativo ? '✓' : '·'}
                    </div>
                    <span className={`text-[8.5px] mt-0.5 font-bold ${item.hoje ? 'text-amber-300 font-black' : 'text-slate-400'}`}>
                      {item.dia}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-1.5 text-[9.5px] font-medium leading-tight text-slate-200">
                🔥 Chama ativa! OS sugeridas pela IA aceitas.
              </p>
            </button>

            {/* Card 2 — Meta Coletiva da Equipe (Pilar 5: Cooperação e Soma Mensal) */}
            <button
              type="button"
              id="btn-meta-coletiva-mensal"
              onClick={() => setShowTeamModal(true)}
              className="text-left rounded-xl border border-emerald-500/40 bg-slate-800/90 p-2.5 shadow-sm transition hover:border-emerald-400 hover:bg-slate-800 active:scale-95 cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Users size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">Meta Coletiva (Mês)</span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-300">{percentualEquipe}%</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <span className="font-extrabold text-white">
                  {totalEquipeOS} / {metaMensalEquipeOS} <span className="text-emerald-300 font-semibold">OS</span>
                </span>
                <span className="text-[9px] text-slate-400">Fim do mês</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{ width: `${percentualEquipe}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] leading-tight text-slate-300">
                {faltamEquipeOS === 0
                  ? '🎉 Meta mensal batida por todos!'
                  : `Soma dos técnicos: faltam ${faltamEquipeOS} OS p/ bônus!`}
              </p>
            </button>
          </div>

          {/* NAVEGAÇÃO EM ABAS */}
          <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-xl bg-slate-800 p-1 text-xs font-semibold">
            <button
              id="tab-ativas"
              onClick={() => setActiveTab('ativas')}
              className={`flex items-center justify-center gap-1 rounded-lg py-2 transition-all duration-300 ${
                activeTab === 'ativas' ? 'bg-sky-500 font-bold text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🎯 Ativas</span>
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-black/30 px-1 text-[10px] font-bold">
                {countAtivas}
              </span>
            </button>

            <button
              id="tab-pausadas"
              onClick={() => setActiveTab('pausadas')}
              className={`flex items-center justify-center gap-1 rounded-lg py-2 transition-all duration-300 ${
                activeTab === 'pausadas' ? 'bg-amber-400 font-bold text-slate-950 shadow-md' : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              <span>🚧 Pausadas</span>
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  isMainPaused ? 'animate-pulse bg-red-600 text-white' : 'bg-black/30'
                }`}
              >
                {countPausadas}
              </span>
            </button>

            <button
              id="tab-concluidas"
              onClick={() => setActiveTab('concluidas')}
              className={`flex items-center justify-center gap-1 rounded-lg py-2 transition-all duration-300 ${
                activeTab === 'concluidas' ? 'bg-emerald-500 font-bold text-white shadow-md' : 'text-emerald-300 hover:text-emerald-200'
              }`}
            >
              <span>✅ Concluídas</span>
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-black/30 px-1 text-[10px] font-bold">
                {countConcluidas}
              </span>
            </button>
          </div>
        </header>

        {/* CORPO PRINCIPAL COM SCROLL */}
        <main className="flex-1 space-y-3.5 overflow-y-auto bg-slate-900 p-4">
          {/* BADGE DE SINCRONIZAÇÃO */}
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-xs text-slate-200">
            <div className="flex items-center gap-1.5 font-medium">
              <RefreshCw size={13} className="animate-spin text-sky-400" style={{ animationDuration: '6s' }} />
              <span>
                Sincronizado via <strong className="text-white">e-Prefeitura API</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {!pushUrgentOpen && (
                <button
                  type="button"
                  id="btn-reabrir-push"
                  onClick={() => setPushUrgentOpen(true)}
                  title="Demonstrar Notificação Push de OS Urgente da IA"
                  className="inline-flex items-center gap-1 rounded-md bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-300 transition hover:bg-red-500/35 active:scale-95 cursor-pointer"
                >
                  <BellRing size={11} className="animate-bounce" /> Push IA
                </button>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                <Radio size={10} className="animate-pulse text-emerald-400" /> Ao Vivo
              </span>
            </div>
          </div>

          {/* ================= ABA 1: ATIVAS ================= */}
          {activeTab === 'ativas' && (
            <div className="animate-slide-in space-y-3.5">
              {isMainPaused && !completed ? (
                <div className="space-y-2 rounded-2xl border-2 border-dashed border-amber-400/70 bg-amber-400/10 p-4 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                    <PauseCircle size={24} className="text-amber-300" />
                  </div>
                  <h3 className="text-sm font-bold text-amber-200">Chamado Principal Pausado por Impedimento</h3>
                  <p className="text-xs leading-relaxed text-amber-100/80">
                    A <strong>OS #1042</strong> está na aba <strong>Pausadas</strong> aguardando insumos. O Kanban do
                    Gestor está piscando em vermelho para compra da peça!
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('pausadas')}
                      className="flex-1 rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-950 shadow hover:bg-amber-300 active:scale-95"
                    >
                      Ver na Aba Pausadas →
                    </button>
                    <button
                      onClick={handleResumeMainMission}
                      className="rounded-xl border border-amber-400 px-3 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-400/10"
                    >
                      Reativar Agora
                    </button>
                  </div>
                </div>
              ) : completed ? (
                <div className="space-y-2 rounded-2xl border border-emerald-500/40 bg-emerald-900/30 p-4 text-center">
                  <CheckCircle2 size={28} className="mx-auto text-emerald-400" />
                  <h3 className="text-sm font-bold text-emerald-300">Todas as missões ativas concluídas!</h3>
                  <p className="text-xs text-emerald-100/70">
                    Os chamados foram finalizados com sucesso. Confira o histórico na aba Concluídas.
                  </p>
                  <button
                    onClick={() => setActiveTab('concluidas')}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-400"
                  >
                    Ver Aba Concluídas →
                  </button>
                </div>
              ) : (
                <>
                  {/* BARRA DE COLEÇÃO TECH-DEX (PILAR 4: PROPRIEDADE E COLEÇÃO) */}
                  <div className="rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-1.5 text-sky-300">
                        <BookOpen size={14} className="text-sky-400" />
                        <span>📖 Tech-Dex: 8/12 Equipamentos Catalogados</span>
                      </span>
                      <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                        Nível Ouro
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        Roteador Cisco ✅
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        Switch Datacenter ✅
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md border border-slate-600 bg-slate-700/60 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                        Servidor Dell 🔒
                      </span>
                    </div>
                  </div>

                  {/* STEPPER */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-1.5">
                    <button
                      id="tab-passo-1"
                      onClick={() => setMissionStep(1)}
                      className={`flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition-all duration-300 ${
                        missionStep === 1 ? 'bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      1. Check-in
                    </button>
                    <span className="px-1 text-slate-500">➔</span>
                    <button
                      id="tab-passo-2"
                      onClick={() => setMissionStep(2)}
                      className={`flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition-all duration-300 ${
                        missionStep === 2 ? 'bg-violet-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      2. Radar IA
                    </button>
                    <span className="px-1 text-slate-500">➔</span>
                    <button
                      id="tab-passo-3"
                      onClick={() => setMissionStep(3)}
                      className={`flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition-all duration-300 ${
                        missionStep === 3 ? 'bg-gradient-to-r from-[#34D399] to-teal-600 text-slate-950 font-black shadow-md' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      3. OS Digital ✅
                    </button>
                  </div>

                  {/* PASSO 1 */}
                  {missionStep === 1 && (
                    <section id="passo-1" className={`animate-slide-in ${card}`}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sky-300">
                          Missão do Dia
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-300">
                          <Clock size={11} className="text-slate-300" /> SLA: 45 min
                        </span>
                      </div>

                      <div className="mt-1 flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                          <WifiOff size={22} className="text-red-400" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold leading-snug text-white">
                            OS #1042 - Falha de Conectividade
                          </h2>
                          <p className="mt-0.5 text-xs text-slate-300">UPA Central · Origem: e-Prefeitura</p>
                        </div>
                      </div>

                      <dl className="mt-3.5 space-y-1.5 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs">
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-400">Local:</dt>
                          <dd className="text-right font-semibold text-slate-100">UPA Central (3º Andar)</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-400">Urgência:</dt>
                          <dd className="font-bold text-red-400">Alta 🔴 (+3 Pontos de OS)</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-400">Equipamento:</dt>
                          <dd className="text-slate-200">Roteador / Ponto de Acesso UTI</dd>
                        </div>
                      </dl>

                      {/* CARD DE PROPÓSITO / IMPACTO ÉPICO */}
                      <div className="mt-3.5 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 to-emerald-900/20 p-3">
                        <p className="flex items-start gap-2 text-xs leading-relaxed text-emerald-100">
                          <Lightbulb size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                          <span>
                            <strong className="text-emerald-300">💡 Impacto Anterior:</strong> Seu trabalho de ontem
                            garantiu que <strong className="text-white">120 pacientes</strong> fossem atendidos sem
                            filas na UPA Central. A cidade agradece!
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2.5">
                        <button
                          id="btn-checkin"
                          onClick={handleCheckin}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] px-4 py-3.5 text-base font-extrabold text-white shadow-[0_4px_24px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#2563EB] hover:to-[#172554] active:scale-95"
                        >
                          <MapPin size={20} className="text-[#34D399]" />
                          📍 Fazer Check-in no Local
                        </button>

                        <button id="btn-relatar-impedimento-step1" onClick={() => setImpedimentModalOpen(true)} className={btnImpediment}>
                          <AlertTriangle size={16} className="text-amber-300" />
                          🚧 Relatar Impedimento (Pausar)
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-slate-400">
                        <span>Validação via GPS Municipal</span>
                        <button onClick={() => setMissionStep(3)} className="font-bold text-sky-400 hover:underline">
                          Pular para Passo 3 →
                        </button>
                      </div>
                    </section>
                  )}

                  {/* PASSO 2: RADAR WAZE DO SETOR */}
                  {missionStep === 2 && (
                    <div id="passo-2" className="animate-slide-in space-y-3.5">
                      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-900/30 px-3.5 py-2.5 text-xs text-emerald-100">
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                        <span className="font-medium">
                          <strong>Check-in confirmado:</strong> UPA Central (3º Andar) · OS #1042
                        </span>
                      </div>

                      {!ignored ? (
                        <section className="animate-pulse-soft rounded-2xl border-2 border-violet-400 bg-slate-800 p-4 shadow-[0_0_24px_rgba(167,139,250,0.4)]">
                          <h2 className="flex items-start gap-2.5 text-sm font-bold leading-snug text-violet-200">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
                              <Bot size={18} className="text-violet-300" />
                            </span>
                            <span>🤖 IA Radar Ativado: Oportunidade Detectada!</span>
                          </h2>

                          <p className="mt-2.5 text-xs leading-relaxed text-slate-200">
                            Há uma <strong className="text-white">OS urgente da Saúde (#1088 - Impressora da Triagem · Prioridade Média: +2 pts)</strong>{' '}
                            neste mesmo prédio. Unifique o atendimento, economize 12 km de frota e ganhe <strong className="text-emerald-300">+5 Pontos de OS no total</strong>!
                          </p>

                          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300">
                            <Leaf size={15} className="shrink-0 text-emerald-400" />
                            Economia estimada: 12 km de frota.
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button
                              id="btn-ignorar"
                              onClick={() => setIgnored(true)}
                              className="flex-1 rounded-xl bg-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-600 active:scale-95"
                            >
                              Ignorar
                            </button>
                            <button
                              id="btn-aceitar-missao"
                              onClick={handleAcceptUnified}
                              className="flex flex-[1.6] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#34D399] to-teal-600 px-3 py-2.5 text-xs font-black text-slate-950 shadow-[0_4px_18px_rgba(52,211,153,0.45)] hover:brightness-110 active:scale-95"
                            >
                              <Zap size={15} className="fill-slate-950 text-slate-950" />
                              Aceitar Missão Unificada
                            </button>
                          </div>

                          <button
                            id="btn-relatar-impedimento-step2"
                            onClick={() => setImpedimentModalOpen(true)}
                            className={`mt-2.5 w-full ${btnImpediment}`}
                          >
                            <AlertTriangle size={14} className="text-amber-300" />
                            🚧 Relatar Impedimento (Pausar Chamado)
                          </button>
                        </section>
                      ) : (
                        <section className={`text-center ${card}`}>
                          <p className="text-xs text-slate-300">
                            Oportunidade ignorada. Apenas a OS #1042 permanece em atendimento.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => setIgnored(false)}
                              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-violet-400 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/10"
                            >
                              <Undo2 size={13} className="text-violet-300" /> Reconsiderar IA
                            </button>
                            <button
                              onClick={() => setMissionStep(3)}
                              className="flex-1 rounded-lg bg-sky-500 px-3 py-2 text-xs font-bold text-white hover:bg-sky-400"
                            >
                              Ir para o Passo 3 →
                            </button>
                          </div>
                        </section>
                      )}
                    </div>
                  )}

                  {/* PASSO 3: FIM DO PAPEL — A ORDEM DE SERVIÇO DIGITAL */}
                  {missionStep === 3 && (
                    <section id="passo-3" className={`animate-slide-in space-y-3.5 ${card}`}>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[11px] font-bold text-violet-300">
                          <Route size={12} className="text-violet-300" /> Passo 3: OS 100% Digital
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <Sparkles size={11} /> +5 Pontos de OS (Alta: 3 + Média: 2)
                        </span>
                      </div>

                      <h2 className="flex items-center gap-2 text-base font-bold text-white">
                        <FileCheck2 size={18} className="text-emerald-400" />
                        Ordem de Serviço Eletrônica
                      </h2>

                      {/* RESUMO DOS CHAMADOS ATENDIDOS */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-2.5 text-xs text-slate-100">
                          <div className="flex items-center gap-2">
                            <WifiOff size={15} className="shrink-0 text-red-400" />
                            <div>
                              <p className="font-bold text-slate-100">OS #1042 - Conectividade UPA</p>
                              <p className="text-[10px] text-slate-400">UPA Central (3º Andar)</p>
                            </div>
                          </div>
                          <span className="font-bold text-emerald-400">Corrigido</span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-2.5 text-xs text-slate-100">
                          <div className="flex items-center gap-2">
                            <Printer size={15} className="shrink-0 text-violet-300" />
                            <div>
                              <p className="font-bold text-slate-100">OS #1088 - Impressora Triagem</p>
                              <p className="text-[10px] text-slate-400">Atendimento Conjunto (Térreo)</p>
                            </div>
                          </div>
                          <span className="font-bold text-violet-300">Otimizado IA</span>
                        </div>
                      </div>

                      {/* 1. CHECKLIST RÁPIDO DE DIAGNÓSTICO */}
                      <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                        <p className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                          <Wrench size={13} className="text-sky-400" /> Checklist Rápido de Diagnóstico:
                        </p>
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => setCheckLink(!checkLink)}
                            className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition hover:bg-slate-800"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                                checkLink
                                  ? 'border-emerald-400 bg-emerald-500 font-bold text-slate-950'
                                  : 'border-slate-600 bg-slate-800'
                              }`}
                            >
                              {checkLink && <Check size={11} strokeWidth={3} />}
                            </span>
                            <span className="text-xs text-slate-200">
                              Teste de link e conectividade física
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCheckCable(!checkCable)}
                            className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition hover:bg-slate-800"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                                checkCable
                                  ? 'border-emerald-400 bg-emerald-500 font-bold text-slate-950'
                                  : 'border-slate-600 bg-slate-800'
                              }`}
                            >
                              {checkCable && <Check size={11} strokeWidth={3} />}
                            </span>
                            <span className="text-xs text-slate-200">
                              Substituição de conector / cabo
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* 2. LAUDO RÁPIDO POR VOZ COM TRANSCRIÇÃO AUTOMÁTICA DA IA */}
                      <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                            <Bot size={13} className="text-violet-400" /> Laudo Rápido por Voz (IA)
                          </span>
                          <span className="rounded bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                            Transcrição Auto
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleToggleVoice}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                            isRecording
                              ? 'animate-pulse bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                              : 'border border-violet-500/40 bg-violet-600/30 text-violet-200 hover:bg-violet-600/40'
                          }`}
                        >
                          <Mic size={15} className={isRecording ? 'animate-bounce text-white' : 'text-violet-300'} />
                          <span>{isRecording ? 'Gravando e Transcrevendo...' : '🎙️ Gravar Laudo Técnico por Voz'}</span>
                        </button>

                        <div className="relative">
                          <textarea
                            rows={2}
                            value={voiceTranscript}
                            onChange={(e) => setVoiceTranscript(e.target.value)}
                            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950/80 p-2 text-xs leading-relaxed text-slate-200 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400/30"
                            placeholder="Transcrição do laudo técnico..."
                          />
                        </div>
                      </div>

                      {/* 3. ASSINATURA DIGITAL NO CELULAR */}
                      <div className="space-y-1 rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 p-3 text-center">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-medium text-slate-300">Assinatura do Servidor da UPA:</span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                            <CheckCircle2 size={11} /> Autenticado
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-950/60 px-3 py-2 font-serif text-xs italic text-emerald-300">
                          <span>[ Assinado digitalmente por Enfª Marina ]</span>
                          <span className="not-italic text-base">✍️</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Validação biométrica municipal · Sem papel e sem burocracia
                        </p>
                      </div>

                      {/* BOTÕES DE AÇÃO: RELATAR IMPEDIMENTO E O BOTÃO DE CONCLUSÃO VIBRANTE */}
                      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                        <button
                          id="btn-relatar-impedimento-step3"
                          onClick={() => setImpedimentModalOpen(true)}
                          className={`flex-1 ${btnImpediment}`}
                        >
                          <AlertTriangle size={17} className="text-amber-300" />
                          <span>🚧 Relatar Impedimento</span>
                        </button>

                        <button
                          id="btn-finalizar"
                          onClick={handleFinish}
                          className="flex flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#34D399] to-teal-600 px-4 py-3.5 text-sm font-black text-slate-950 shadow-[0_4px_24px_rgba(52,211,153,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                        >
                          <CheckCircle2 size={19} className="text-slate-950" />
                          <span>✅ Transmitir OS e Encerrar Chamado</span>
                        </button>
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          )}

          {/* ================= ABA 2: PAUSADAS ================= */}
          {activeTab === 'pausadas' && (
            <div className="animate-slide-in space-y-3.5">
              <div className="flex items-center justify-between px-1 text-xs font-medium text-slate-300">
                <span>Aguardando peças ou retorno ({countPausadas})</span>
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <PauseCircle size={12} className="text-amber-300" /> Lista de Espera
                </span>
              </div>

              {isMainPaused && (
                <article
                  id="card-pausada-1042"
                  className="space-y-3 rounded-2xl border-2 border-red-500 bg-red-950/40 p-4 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex animate-pulse items-center gap-1 rounded-md bg-red-500/25 px-2 py-0.5 text-[10px] font-extrabold text-red-300">
                        <AlertOctagon size={11} className="text-red-300" /> 🚨 IMPEDIMENTO REGISTRADO
                      </span>
                      <h3 className="mt-1.5 text-sm font-bold text-white">OS #1042 - Falha de Conectividade</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-300">
                        <MapPin size={12} className="text-slate-300" /> UPA Central (3º Andar)
                      </p>
                    </div>
                    <span className="rounded-md bg-red-500/20 px-2 py-1 text-[11px] font-bold text-red-300">Pausada</span>
                  </div>

                  <div className="space-y-1 rounded-xl border border-red-500/30 bg-slate-900/60 p-2.5 text-xs">
                    <p className="flex items-center gap-1 font-bold text-red-300">
                      <Wrench size={12} className="text-red-300" /> Motivo do Impedimento:
                    </p>
                    <p className="text-slate-100">{mainImpedimentReason}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-red-500/30 pt-2 text-[11px] font-medium text-red-300">
                    <span className="flex items-center gap-1">
                      <Radio size={11} className="animate-pulse text-red-400" />
                      Gestor notificado em vermelho!
                    </span>
                    <button
                      id="btn-retomar-1042"
                      onClick={handleResumeMainMission}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-red-400 active:scale-95"
                    >
                      <PlayCircle size={13} className="text-white" /> Retomar Agora
                    </button>
                  </div>
                </article>
              )}

              {!os1088Reactivated ? (
                <article
                  id="card-pausada-1088"
                  className="space-y-3 rounded-2xl border-2 border-emerald-400 bg-slate-800 p-4 shadow-[0_0_22px_rgba(52,211,153,0.3)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded-md bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        OS #1088 · Troca de Cabo de Rede
                      </span>
                      <h3 className="mt-1.5 text-sm font-bold text-white">UPA Central (Térreo - Triagem)</h3>
                      <p className="mt-0.5 text-xs font-semibold text-slate-300">
                        Motivo: <span className="font-bold text-amber-300">Aguardando peça</span>
                      </p>
                    </div>
                    <span className="rounded-md bg-amber-400/15 px-2 py-1 text-[11px] font-bold text-amber-300">Pausado</span>
                  </div>

                  {/* A MÁGICA DA IA: BADGE VERDE NEON */}
                  <div className="space-y-2 rounded-xl border-2 border-emerald-400 bg-emerald-400/10 p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 shrink-0 animate-ping rounded-full bg-emerald-400" />
                      <p className="text-xs font-black leading-snug tracking-tight text-emerald-300">
                        🤖 IA: Você está no mesmo prédio deste chamado pausado! Deseja reativar?
                      </p>
                    </div>
                    <p className="text-[11px] text-emerald-100/80">
                      O motor detectou que você já fez check-in na UPA Central. Reativar evita retorno futuro!
                    </p>
                    <button
                      id="btn-retomar-ia-1088"
                      onClick={handleReactivateOs1088}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_0_16px_rgba(16,185,129,0.5)] transition hover:bg-emerald-400 active:scale-95"
                    >
                      <Zap size={14} className="text-white" /> Retomar Agora
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-700 pt-2 text-[11px] text-slate-400">
                    <span>Pausado há 2 dias</span>
                    <span>Economia potencial: +12 km</span>
                  </div>
                </article>
              ) : (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-900/30 p-3 text-center text-xs text-emerald-200">
                  ✅ OS #1088 reativada com sucesso e integrada na aba <strong>Ativas</strong>!
                </div>
              )}
            </div>
          )}

          {/* ================= ABA 3: CONCLUÍDAS ================= */}
          {activeTab === 'concluidas' && (
            <div className="animate-slide-in space-y-3.5">
              <div className="flex items-center justify-between px-1 text-xs font-medium text-slate-300">
                <span>Histórico de OS Concluídas ({countConcluidas})</span>
                <span className="font-bold text-emerald-400">Pontos por Prioridade</span>
              </div>

              {completed && (
                <article
                  id="card-concluido-principal"
                  className="space-y-2.5 rounded-2xl border-2 border-emerald-500 bg-emerald-900/25 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Sparkles size={10} className="text-white" /> +5 Pontos de OS (Alta: +3 | Média: +2)
                      </span>
                      <h3 className="mt-1.5 text-sm font-bold text-white">OS #1042 + OS #1088 (Missão Unificada)</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-300">
                        <MapPin size={12} className="text-slate-300" /> UPA Central (3º Andar e Térreo)
                      </p>
                    </div>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-1 text-[11px] font-bold text-emerald-300">
                      ✅ Concluída
                    </span>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-slate-900/60 p-2.5 text-xs text-emerald-100">
                    <p className="font-semibold">Laudo digital transmitido com sucesso à e-Prefeitura.</p>
                    <p className="mt-0.5 text-[11px] text-slate-300">
                      2 problemas resolvidos · 1 única viagem · 12 km poupados de frota pública.
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-emerald-500/30 pt-2 text-xs">
                    <button onClick={() => setShowReward(true)} className="flex items-center gap-1 font-bold text-amber-300 hover:underline">
                      🏆 Ver Resumo Wrapped
                    </button>
                    <button onClick={handleReset} className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:underline">
                      <RotateCcw size={11} className="text-sky-400" /> Reiniciar Demonstração
                    </button>
                  </div>
                </article>
              )}

              <article className={`space-y-2 ${card} p-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      +1 Ponto de OS (Prioridade Baixa)
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-white">OS #0998 - Troca de Cabo de Rede</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-300">
                      <MapPin size={12} className="text-slate-300" /> UBS Centro
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-700 px-2 py-1 text-[11px] font-bold text-slate-200">22 min</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-2 text-[11px] text-slate-400">
                  <span>Resolvido hoje às 07:52</span>
                  <span className="font-semibold text-emerald-400">Evidência validada</span>
                </div>
              </article>
            </div>
          )}
        </main>

        {/* ============ MINI-MODAL DE IMPEDIMENTO ============ */}
        {impedimentModalOpen && (
          <div
            id="modal-impedimento-tecnico"
            role="dialog"
            aria-modal="true"
            className="animate-fade-in absolute inset-0 z-50 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm"
          >
            <div className="animate-pop-in w-full space-y-3.5 rounded-3xl border-2 border-amber-400 bg-slate-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                    <AlertTriangle size={18} className="text-amber-300" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Relatar Impedimento (Pausar)</h3>
                    <p className="text-[11px] text-slate-300">Notifica o chefe para providenciar a peça</p>
                  </div>
                </div>
                <button
                  onClick={() => setImpedimentModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <X size={18} className="text-slate-200" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Selecione ou digite o motivo:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Falta de Roteador no estoque',
                    'Switch queimado (troca)',
                    'Cabo de rede rompido',
                    'Acesso trancado / Sem chave',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setImpedimentReason(preset)
                        setCustomReason('')
                      }}
                      className={`rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-semibold transition ${
                        impedimentReason === preset && !customReason
                          ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                          : 'border-slate-600 bg-slate-900/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Ou descreva outro motivo aqui..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />

              <div className="rounded-xl bg-amber-400/10 p-2.5 text-[11px] leading-tight text-amber-200">
                💡 Ao confirmar, o chamado irá para a <strong>Aba Pausadas</strong> e{' '}
                <strong>piscará em vermelho no Kanban do Gestor</strong>!
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setImpedimentModalOpen(false)}
                  className="flex-1 rounded-xl bg-slate-700 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-600"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirmar-impedimento"
                  type="button"
                  onClick={handleConfirmImpediment}
                  className="flex-[1.5] rounded-xl bg-amber-400 py-2.5 text-xs font-extrabold text-slate-950 shadow-md hover:bg-amber-300 active:scale-95"
                >
                  🚨 Confirmar e Pausar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE IMPACTO SOCIAL (ESTILO "SPOTIFY WRAPPED") */}
        {showReward && (
          <div
            id="modal-recompensa"
            role="dialog"
            aria-modal="true"
            className="animate-fade-in absolute inset-0 z-40 flex items-center justify-center bg-black/85 p-3.5 backdrop-blur-md"
          >
            {/* Confetes animados */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <span
                  key={i}
                  className="confetti"
                  style={{
                    left: `${(i * 6.5 + 3) % 100}%`,
                    animationDelay: `${(i % 6) * 0.25}s`,
                    animationDuration: `${2.4 + (i % 4) * 0.5}s`,
                    background: ['#facc15', '#fb923c', '#38bdf8', '#34d399', '#a78bfa'][i % 5],
                  }}
                />
              ))}
            </div>

            <div className="animate-pop-in relative max-h-full w-full space-y-4 overflow-y-auto rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 text-center shadow-2xl">
              {/* TOPO FESTIVO COM ÍCONE TROPHY DOURADO */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 ring-4 ring-amber-400/30">
                <Trophy size={40} className="animate-bounce text-amber-400" fill="currentColor" />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-white">
                  🎉 MISSÃO CUMPRIDA, CARLOS!
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-300">
                  Laudo digital transmitido com sucesso à e-Prefeitura
                </p>
              </div>

              {/* BADGE CONQUISTADO */}
              <div className="space-y-1.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-sm font-black text-emerald-300">
                  <Sparkles size={16} className="text-emerald-400" />
                  🏅 Herói da Saúde Pública
                </p>
                <p className="text-[11px] font-bold text-emerald-200">
                  +5 Pontos de OS conquistados!
                </p>
                <p className="text-[10px] text-emerald-300/80">
                  OS #1042 (Alta: +3 pts) · OS #1088 (Média: +2 pts)
                </p>
              </div>

              {/* A CAIXA MISTERIOSA (PILAR 7: IMPREVISIBILIDADE E CURIOSIDADE) */}
              {!mysteryOpened ? (
                <button
                  id="btn-caixa-misteriosa"
                  type="button"
                  onClick={() => setMysteryOpened(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-amber-500/25 px-4 py-3.5 text-xs font-black text-amber-300 shadow-[0_0_22px_rgba(245,158,11,0.4)] animate-pulse transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Gift size={18} className="animate-bounce text-amber-400" />
                  <span>🎁 Tocar para Abrir Feedback de IA e Prêmio Surpresa</span>
                </button>
              ) : (
                <div
                  id="recompensa-surpresa-revelada"
                  className="animate-pop-in space-y-2.5 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-950/70 via-slate-900/95 to-amber-950/40 p-4 text-left shadow-[0_0_30px_rgba(251,191,36,0.35)]"
                >
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-black tracking-wide text-amber-300">
                      <Sparkles size={15} className="text-amber-400" />
                      <span>✨ FEEDBACK GERADO POR IA NO LOCAL</span>
                    </span>
                    <span className="rounded-md border border-amber-400/50 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      📍 UPA Central
                    </span>
                  </div>

                  <div className="space-y-1 rounded-xl border border-violet-500/30 bg-violet-950/30 p-2.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-violet-300">
                      <Bot size={13} className="text-violet-400" />
                      <span>Análise de Impacto Operacional (IA):</span>
                    </p>
                    <p className="text-xs leading-relaxed text-slate-100">
                      "Com a rede restabelecida no 3º Andar e a triagem reativada na <strong className="text-amber-300">UPA Central</strong>, a fila do pronto-socorro reduziu em <strong className="text-emerald-400">38%</strong> e <strong className="text-white">42 prontuários eletrônicos</strong> foram destravados em tempo recorde. Seu atendimento evitou a paralisação do plantão médico da UTI."
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs">
                    <p className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <Trophy size={14} className="text-emerald-400" />
                      <span>Prêmio Surpresa do Dia Conquistado:</span>
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-200">
                      Elogio formal de mérito cívico registrado no prontuário do Agente Carlos emitido pela Diretoria da UPA Central + Folga Cívica semestral aprovada!
                    </p>
                  </div>
                </div>
              )}

              {/* BOTÃO NO RODAPÉ */}
              <button
                id="btn-voltar-radar"
                onClick={() => {
                  setShowReward(false)
                  setActiveTab('concluidas')
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-3.5 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] transition hover:bg-sky-400 active:scale-95"
              >
                Voltar à Fila de Missões
              </button>
            </div>
          </div>
        )}

        {/* ============ MODAL META COLETIVA (SOMA DE TODOS OS TÉCNICOS NO FIM DO MÊS) ============ */}
        {showTeamModal && (
          <div
            id="modal-meta-coletiva"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <div className="animate-pop-in max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border-2 border-emerald-500/60 bg-slate-900 p-5 text-center text-white shadow-[0_0_40px_rgba(16,185,129,0.35)]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                    <Users size={18} className="text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-extrabold text-white">Meta Coletiva Mensal</h3>
                    <p className="text-[10px] text-slate-400">Pilar 5: Cooperação & Influência Social</p>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-fechar-meta-modal-x"
                  onClick={() => setShowTeamModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* CARD DE PROGRESSO DA SOMA MENSAL */}
              <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Soma de todas as OSs (Fim do Mês)</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-300">
                    {percentualEquipe}%
                  </span>
                </div>
                <p className="mt-1 text-2xl font-black text-white">
                  {totalEquipeOS} <span className="text-sm font-normal text-slate-300">de {metaMensalEquipeOS} OS concluídas</span>
                </p>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${percentualEquipe}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-200">
                  {faltamEquipeOS === 0
                    ? '🎉 Parabéns! A equipe atingiu a meta do mês e garantiu a gratificação coletiva!'
                    : `Faltam apenas ${faltamEquipeOS} OS somadas para liberar o bônus de produtividade de toda a equipe de Saúde!`}
                </p>
              </div>

              {/* LISTA DE CONTRIBUIÇÃO DOS TÉCNICOS NO MÊS */}
              <div className="mt-4 text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Contribuição dos Técnicos no Mês:
                </p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-2 text-xs">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span>🥇</span> Mariana Silva (Redes)
                    </span>
                    <span className="font-extrabold text-emerald-400">46 OS</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-2 text-xs">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span>🥈</span> João Mendes (Hardware)
                    </span>
                    <span className="font-extrabold text-emerald-400">44 OS</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border-2 border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs">
                    <span className="flex items-center gap-2 font-bold text-emerald-300">
                      <span>🥉</span> Carlos Alberto (Você)
                    </span>
                    <div className="text-right">
                      <span className="font-black text-white">{36 + osCarlosSessao} OS</span>
                      {osCarlosSessao > 0 && (
                        <span className="ml-1 text-[10px] font-bold text-emerald-400">(+{osCarlosSessao} hoje)</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-2 text-xs">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span>4º</span> Roberto Alves (Sistemas)
                    </span>
                    <span className="font-extrabold text-slate-300">36 OS</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-2 text-xs">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span>5º</span> Marcos Torres (Infraestrutura)
                    </span>
                    <span className="font-extrabold text-slate-300">34 OS</span>
                  </div>
                </div>
              </div>

              {/* REGRAS DO BÔNUS COLETIVO (OCTALYSIS PILAR 5) */}
              <div className="mt-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20 p-2.5 text-left text-[11px] text-sky-200">
                <p className="font-semibold text-white">🤝 Como funciona o Bônus Coletivo?</p>
                <p className="mt-0.5 text-slate-300 leading-relaxed">
                  Não é uma disputa: a soma de todos os chamados entregues até o último dia do mês beneficia igualmente todos os servidores do setor de TI da Saúde.
                </p>
              </div>

              <button
                type="button"
                id="btn-fechar-meta-modal"
                onClick={() => setShowTeamModal(false)}
                className="mt-4 w-full rounded-2xl bg-emerald-500 py-3 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition hover:bg-emerald-400 active:scale-95"
              >
                Continuar Trabalhando em Campo
              </button>
            </div>
          </div>
        )}

        {/* ============ MODAL OFENSIVA ESTILO DUOLINGO (PILAR 8: PERDA E PREVENÇÃO) ============ */}
        {showStreakModal && (
          <div
            id="modal-ofensiva-duolingo"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <div className="animate-pop-in max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border-2 border-amber-400/80 bg-slate-900 p-5 text-center text-white shadow-[0_0_50px_rgba(245,158,11,0.45)]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Duolingo Streak Style · Octalysis Pilar 8
                </span>
                <button
                  type="button"
                  id="btn-fechar-streak-modal-x"
                  onClick={() => setShowStreakModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* FOGO GIGANTE DUOLINGO */}
              <div className="mt-4 flex flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-400 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse">
                  <Flame size={54} className="fill-white text-white drop-shadow-md animate-bounce" />
                  <span className="absolute -bottom-2 rounded-full border-2 border-slate-900 bg-amber-300 px-3 py-0.5 text-xs font-black text-slate-950">
                    5 DIAS
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-black text-amber-300 tracking-tight">
                  VOCÊ ESTÁ PEGANDO FOGO! 🔥
                </h3>
                <p className="mt-1 text-xs text-slate-200 leading-relaxed px-2">
                  Você aceitou todas as OSs sugeridas pela IA nos <strong>5 dias úteis da semana</strong>!
                </p>
              </div>

              {/* CALENDÁRIO DA SEMANA DUOLINGO (DIAS ÚTEIS: SEG A SEX) */}
              <div className="mt-4 rounded-2xl border border-amber-500/30 bg-slate-800/80 p-3.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Sua Semana Útil de Ofensiva (Seg a Sex)
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-1.5 px-2">
                  {[
                    { dia: 'Seg', ativo: true },
                    { dia: 'Ter', ativo: true },
                    { dia: 'Qua', ativo: true },
                    { dia: 'Qui', ativo: true },
                    { dia: 'Sex', ativo: true, hoje: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition-all ${
                          item.ativo
                            ? item.hoje
                              ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.95)] ring-2 ring-white scale-110'
                              : 'bg-amber-500 text-slate-950'
                            : 'bg-slate-700/80 border border-slate-600 text-slate-500'
                        }`}
                      >
                        {item.ativo ? '✓' : '🔒'}
                      </div>
                      <span className={`text-[11px] mt-1.5 font-bold ${item.hoje ? 'text-amber-300 font-extrabold' : 'text-slate-400'}`}>
                        {item.dia}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD DE PROTEÇÃO DE OFENSIVA (STREAK FREEZE) */}
              <div className="mt-3 rounded-2xl border border-sky-500/30 bg-sky-950/20 p-3 text-left">
                <div className="flex items-center gap-2 text-sky-300 text-xs font-bold">
                  <span>🧊 Proteção de Ofensiva (Streak Freeze)</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300 leading-snug">
                  1 proteção ativa. Se imprevistos de trânsito ou peças acontecerem, sua sequência não é zerada!
                </p>
              </div>

              {/* MOTIVAÇÃO DO DIA (PILAR 8) */}
              <div className="mt-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200">
                <p className="font-semibold">⚡ Não quebre o ritmo hoje!</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Conclua a OS unificada da UPA Central para estender sua ofensiva para <strong>7 dias</strong> amanhã!
                </p>
              </div>

              {/* BOTÃO ESTILO DUOLINGO COM EFEITO 3D */}
              <button
                type="button"
                id="btn-continuar-streak"
                onClick={() => setShowStreakModal(false)}
                className="mt-4 w-full rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_0_rgb(5,150,105)] transition hover:brightness-110 active:translate-y-1 active:shadow-none cursor-pointer"
              >
                Continuar a Missão
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
