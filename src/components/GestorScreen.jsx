import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Layers,
  LogOut,
  Map as MapIcon,
  MapPin,
  Navigation,
  Radio,
  RotateCcw,
  Route,
  Search,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
  AlertOctagon,
  AlertTriangle,
  FileText,
} from 'lucide-react'
import RouteMap from './RouteMap'
import MissionDetailModal from './MissionDetailModal'
import useCountUp from '../hooks/useCountUp'
import { COLUMNS, REGIONS, URGENCIES, URGENCY_STYLES, normalize } from '../data/missions'

/* ------------------------------------------------------------------ */
/* KPIs                                                                */
/* ------------------------------------------------------------------ */
function KpiCard({ id, icon: Icon, iconClass, iconBg, label, value, suffix, sub, subClass }) {
  const shown = useCountUp(value)
  return (
    <div
      id={id}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={24} className={iconClass} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {shown}
          {suffix}
        </p>
        {sub && <p className={`text-xs font-semibold ${subClass}`}>{sub}</p>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Filtros                                                             */
/* ------------------------------------------------------------------ */
function FilterDropdown({ id, label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const active = value !== 'Todas'

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
          active
            ? 'border-blue-400 bg-blue-50 text-blue-900'
            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
        }`}
      >
        <Filter size={15} className={active ? 'text-blue-600' : 'text-slate-400'} />
        {active ? `${label}: ${value}` : label}
        <ChevronDown size={15} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="animate-slide-in absolute left-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {['Todas', ...options].map((o) => (
            <li key={o}>
              <button
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                {o}
                {o === value && <Check size={14} className="text-blue-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cards do Kanban                                                     */
/* ------------------------------------------------------------------ */
const cardBase =
  'rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'

function StatusTag({ m }) {
  if (m.column === 'concluido') {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={12} /> {m.resolvedIn ? `Resolvido em ${m.resolvedIn}` : 'Resolvido'}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-teal-700">
          <FileText size={11} className="text-teal-600" /> 1 folha poupada
        </span>
      </div>
    )
  }
  if (m.column === 'execucao') {
    return (
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
        <Navigation size={12} /> {m.fieldStatus || 'Em atendimento'}
      </span>
    )
  }
  return (
    <span className={`mt-3 inline-flex rounded-md px-2 py-1 text-xs font-semibold ${URGENCY_STYLES[m.urgency]}`}>
      Urgência: {m.urgency}
    </span>
  )
}

function MissionCardView({ m, overlay = false, onResolveImpediment }) {
  // SE A MISSÃO TEM IMPEDIMENTO: PISCA EM VERMELHO NO KANBAN DO GESTOR
  if (m.hasImpediment) {
    return (
      <article
        id={`card-${m.id}`}
        className={`relative rounded-xl border-2 border-red-600 bg-red-50/90 p-4 shadow-[0_0_28px_rgba(239,68,68,0.55)] ring-4 ring-red-400 animate-pulse transition-all duration-300 ${
          overlay ? 'rotate-2 shadow-2xl' : ''
        }`}
      >
        <div className="mb-2.5 flex items-center justify-between rounded-lg bg-red-600 px-2.5 py-1 text-white shadow-xs">
          <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
            <AlertTriangle size={13} className="animate-bounce" /> 🚨 FALTA DE PEÇA (COMPRAR)
          </span>
          <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded">Pausado em Campo</span>
        </div>

        <h3 className="text-sm font-bold leading-snug text-slate-900">{m.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin size={13} /> {m.location}
        </p>

        {/* MOTIVO DO IMPEDIMENTO RELATADO PELO TÉCNICO */}
        <div className="mt-2.5 rounded-lg border border-red-200 bg-red-100/90 p-2.5 text-xs text-red-950">
          <p className="font-bold flex items-center gap-1 text-red-900">
            <AlertOctagon size={12} /> Relato do Técnico João:
          </p>
          <p className="text-[11px] font-medium mt-0.5 leading-relaxed">
            "{m.impedimentReason || 'Falta de Roteador no estoque'}"
          </p>
        </div>

        {/* BOTÃO PARA O CHEFE APROVAR A COMPRA DA PEÇA */}
        <button
          id={`btn-aprovar-compra-${m.id}`}
          onClick={(e) => {
            e.stopPropagation()
            onResolveImpediment?.(m.id)
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-red-700 hover:shadow-lg active:scale-95"
        >
          <ShoppingCart size={14} />
          🛒 Autorizar Compra de Peça (Chefe)
        </button>
      </article>
    )
  }

  if (m.kind === 'grouped') {
    const done = m.column === 'concluido'
    return (
      <article
        id="card-os-agrupada"
        className={`relative rounded-xl border-2 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 ${
          done
            ? 'border-emerald-500 shadow-md'
            : 'border-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
        } ${overlay ? 'rotate-2 shadow-2xl' : ''}`}
      >
        {m.partPurchased && !done && (
          <div className="mb-2 flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            <CheckCircle2 size={11} /> ✅ Peça Comprada pelo Chefe · Liberado p/ Retomada
          </div>
        )}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] px-3 py-1 text-xs font-bold text-white shadow-sm ${
            m.column === 'ia' ? 'animate-pulse' : ''
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
          {done ? '✅ Concluída · Rota Otimizada pela IA' : '✨ Rota Otimizada pela IA'}
        </span>
        <h3 className="mt-3 text-sm font-bold leading-snug text-slate-900">{m.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={13} /> {m.location}
        </p>

        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
          <Route size={13} /> 2 chamados · 1 viagem · {m.kmSaved} km poupados
        </div>

        {done && (
          <div className="mt-2 flex items-center justify-between rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
            <span className="flex items-center gap-1">
              <FileText size={12} className="text-teal-600" /> Processo 100% Digital
            </span>
            <span>🌱 2 folhas poupadas</span>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-900 text-xs font-bold text-white ring-2 ring-emerald-300">
            {m.agent.initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">{m.agent.name}</p>
            <p className="text-xs text-slate-500">
              {done ? 'Executado' : 'Alocado'} · Nível {m.agent.level}
            </p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article id={`card-${m.id}`} className={`${cardBase} ${overlay ? 'rotate-2 shadow-2xl' : ''}`}>
      {m.isNew && (
        <span className="mb-2 inline-flex animate-pulse items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
          <Zap size={10} /> Novo · via API
        </span>
      )}
      <h3 className="text-sm font-bold text-slate-800">{m.title}</h3>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <MapPin size={13} /> {m.location}
      </p>
      <StatusTag m={m} />
    </article>
  )
}

function DraggableCard({ m, onOpen, onResolveImpediment, guardRef }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: m.id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (Date.now() - guardRef.current < 250) return // ignora o clique gerado ao soltar um arraste
        onOpen(m.id)
      }}
      className={`cursor-grab outline-none transition-opacity active:cursor-grabbing ${
        isDragging ? 'opacity-30' : ''
      } ${m.isNew ? 'animate-slide-in' : ''}`}
    >
      <MissionCardView m={m} onResolveImpediment={onResolveImpediment} />
    </div>
  )
}

function KanbanColumn({ column, count, filtered, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  return (
    <section
      id={`col-${column.id}`}
      ref={setNodeRef}
      className={`flex min-h-[420px] flex-col rounded-2xl border p-3 transition-all duration-300 ${
        isOver ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300' : 'border-slate-200 bg-slate-100'
      }`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className={`h-2 w-2 rounded-full ${column.accent}`} />
          {column.title}
        </h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 shadow-sm">{count}</span>
      </header>
      <div className="flex flex-1 flex-col gap-3">
        {children}
        {count === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            {filtered ? 'Nenhum chamado para os filtros atuais' : 'Solte um card aqui'}
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Gráfico de economia de frota (últimos 7 dias)                       */
/* ------------------------------------------------------------------ */
const WEEK_KM = [48, 62, 55, 71, 66, 59]
const WEEK_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Hoje']

function WeeklyChart({ todayKm }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const data = [...WEEK_KM, todayKm]
  const max = Math.max(...data)
  const total = data.reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="flex h-44 items-end gap-2">
        {data.map((v, i) => {
          const today = i === data.length - 1
          return (
            <div key={WEEK_LABELS[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className={`text-xs font-semibold tabular-nums ${today ? 'text-emerald-600' : 'text-slate-500'}`}>{v}</span>
              <div
                className={`w-full rounded-t-lg transition-all duration-700 ${
                  today ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' : 'bg-blue-200'
                }`}
                style={{ height: mounted ? `${(v / max) * 100}%` : '0%', maxHeight: '75%' }}
              />
              <span className={`text-[11px] ${today ? 'font-bold text-slate-800' : 'text-slate-400'}`}>{WEEK_LABELS[i]}</span>
            </div>
          )
        })}
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-600">
        <TrendingUp size={16} className="text-emerald-600" />
        Total na semana: <strong className="text-slate-900">{total} km</strong> · média de{' '}
        <strong className="text-slate-900">{Math.round(total / data.length)} km/dia</strong>
      </p>
    </div>
  )
}

export default function GestorScreen({
  missions,
  onMoveMission,
  onSimulate,
  onResolveImpediment,
  onResetMissions,
  onLogout,
}) {
  const [search, setSearch] = useState('')
  const [urgency, setUrgency] = useState('Todas')
  const [region, setRegion] = useState('Todas')
  const [selectedId, setSelectedId] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [toast, setToast] = useState(null)
  const guardRef = useRef(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  )

  const filtersActive = urgency !== 'Todas' || region !== 'Todas' || search.trim() !== ''

  const filtered = useMemo(() => {
    const q = normalize(search.trim())
    return missions.filter((m) => {
      if (urgency !== 'Todas' && m.urgency !== urgency) return false
      if (region !== 'Todas' && m.region !== region) return false
      if (!q) return true
      return normalize(`${m.title} ${m.location} ${m.region}`).includes(q)
    })
  }, [missions, search, urgency, region])

  const groupedDone = missions.some((m) => m.kind === 'grouped' && m.column === 'concluido')
  const kmSaved = 84 + (groupedDone ? 12 : 0)
  const osOptimized = 12 + (groupedDone ? 2 : 0)
  // Economia de Papel: A cada OS = 1 folha de papel economizada
  // Base do dia: 36 folhas de papel poupadas (+2 quando a unificada #1042 e #1088 é concluída)
  const paperSaved = 36 + (groupedDone ? 2 : 0)

  const selected = missions.find((m) => m.id === selectedId) || null
  const activeMission = missions.find((m) => m.id === activeId) || null
  const impedimentMission = missions.find((m) => m.hasImpediment)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const clearFilters = () => {
    setSearch('')
    setUrgency('Todas')
    setRegion('Todas')
  }

  const handleSimulate = () => {
    const m = onSimulate()
    setToast({ key: m.id, text: `Novo chamado via e-Prefeitura: ${m.title}` })
  }

  const handleDragEnd = ({ active, over }) => {
    guardRef.current = Date.now()
    setActiveId(null)
    if (!over) return
    const m = missions.find((x) => x.id === active.id)
    if (m && m.column !== over.id) onMoveMission(active.id, over.id)
  }

  return (
    <div className="flex min-h-full flex-col bg-slate-50 pb-20">
      <header className="sticky top-0 z-40 border-b border-[#1E3A8A]/15 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Help Desk Inteligente" className="h-10 w-10 object-contain drop-shadow-sm" />
            <div className="hidden sm:block leading-tight">
              <h1 className="text-sm font-black text-[#1E3A8A]">Help Desk Inteligente</h1>
              <p className="text-[10px] font-semibold text-slate-500">Motor de Priorização e Roteamento</p>
            </div>
            <button
              id="seletor-setor"
              className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-[#1E3A8A] transition hover:bg-blue-100"
            >
              <Building2 size={15} className="text-[#3B82F6]" />
              Setor: T.I. / Help Desk
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="animate-glow inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] px-3.5 py-1.5 text-xs font-bold text-white shadow-md">
              <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
              Motor IA: Ativo
            </span>
            {onResetMissions && (
              <button
                id="btn-reset-gestor"
                onClick={onResetMissions}
                title="Reiniciar Demonstração"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <RotateCcw size={14} /> Reiniciar Demo
              </button>
            )}
            <button
              id="btn-sair-gestor"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col gap-5 p-4 sm:p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            id="kpi-economia"
            icon={TrendingDown}
            iconClass="text-emerald-600"
            iconBg="bg-emerald-50"
            label="Economia de Frota Hoje"
            value={kmSaved}
            suffix=" km poupados"
          />
          <KpiCard
            id="kpi-agrupados"
            icon={Layers}
            iconClass="text-blue-600"
            iconBg="bg-blue-50"
            label="Chamados Agrupados pela IA"
            value={osOptimized}
            suffix=" OS Otimizadas"
          />
          <KpiCard
            id="kpi-papel"
            icon={FileText}
            iconClass="text-teal-600"
            iconBg="bg-teal-50"
            label="Economia de Papel (Zero Papel)"
            value={paperSaved}
            suffix=" folhas poupadas"
            sub="🌱 1 folha por OS digital"
            subClass="text-teal-700 font-semibold"
          />
          <KpiCard
            id="kpi-sla"
            icon={Clock}
            iconClass="text-orange-500"
            iconBg="bg-orange-50"
            label="SLA Médio de Resposta"
            value={28}
            suffix=" min"
            sub="-15% vs ontem"
            subClass="text-emerald-600"
          />
        </div>

        {/* Toolbar */}
        <div className="relative z-20 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="busca-os"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar OS ou Local..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown id="btn-filtro-urgencia" label="Filtro Urgência" options={URGENCIES} value={urgency} onChange={setUrgency} />
            <FilterDropdown id="btn-filtro-localidade" label="Filtro Localidade" options={REGIONS} value={region} onChange={setRegion} />
            {filtersActive && (
              <button
                id="btn-limpar-filtros"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-300 hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={14} /> Limpar
              </button>
            )}
            <button
              id="btn-simular-chamado"
              onClick={handleSimulate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#3B82F6]/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#2563EB] hover:to-[#172554] hover:shadow-lg active:scale-95"
            >
              <Zap size={15} className="text-[#34D399]" /> Simular novo chamado
            </button>
          </div>
        </div>

        {/* BANNER DE ALERTA DE IMPEDIMENTO (PISCANDO EM VERMELHO PARA O CHEFE COMPRAR A PEÇA) */}
        {impedimentMission && (
          <div
            id="banner-alerta-impedimento"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-red-500 bg-red-50 p-4 shadow-lg animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white animate-bounce">
                <AlertOctagon size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-red-900 flex items-center gap-2">
                  <span>🚨 ALERTA CRÍTICO: TÉCNICO AGUARDA COMPRA DE PEÇA EM CAMPO!</span>
                  <span className="rounded-full bg-red-200 px-2 py-0.5 text-[10px] font-bold text-red-800">
                    {impedimentMission.location}
                  </span>
                </p>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  O Agente João relatou: <strong>"{impedimentMission.impedimentReason || 'Falta de Roteador no estoque'}"</strong>.
                  O chamado está na <strong>Lista de Espera dele (Aba Pausadas)</strong> e piscando em vermelho abaixo.
                </p>
              </div>
            </div>
            <button
              id="btn-aprovar-compra-banner"
              onClick={() => onResolveImpediment?.(impedimentMission.id)}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-red-700 hover:shadow-lg active:scale-95"
            >
              <ShoppingCart size={15} />
              🛒 Autorizar Compra de Peça (Chefe)
            </button>
          </div>
        )}

        <p className="-mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
          <span>
            Arraste os cards entre as colunas · clique em um card para ver os detalhes e a rota
          </span>
          <span className="font-semibold">
            Mostrando {filtered.length} de {missions.length} OS
          </span>
        </p>

        {/* Kanban com drag-and-drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            guardRef.current = Date.now()
            setActiveId(null)
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {COLUMNS.map((col) => {
              const items = filtered.filter((m) => m.column === col.id)
              return (
                <KanbanColumn key={col.id} column={col} count={items.length} filtered={filtersActive}>
                  {items.map((m) => (
                    <DraggableCard
                      key={m.id}
                      m={m}
                      onOpen={setSelectedId}
                      onResolveImpediment={onResolveImpediment}
                      guardRef={guardRef}
                    />
                  ))}
                </KanbanColumn>
              )
            })}
          </div>
          <DragOverlay dropAnimation={{ duration: 200 }}>
            {activeMission ? (
              <MissionCardView m={activeMission} overlay onResolveImpediment={onResolveImpediment} />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Mapa + gráfico */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <MapIcon size={16} className="text-blue-600" /> Mapa de Rotas Otimizadas
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                {[
                  ['bg-slate-400', 'Entrada'],
                  ['bg-blue-500', 'Priorizado IA'],
                  ['bg-amber-400', 'Em campo'],
                  ['bg-emerald-500', 'Concluído'],
                ].map(([c, l]) => (
                  <span key={l} className="inline-flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full ${c}`} /> {l}
                  </span>
                ))}
              </div>
            </div>
            <RouteMap missions={filtered} className="h-80" />
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Radio size={11} /> Mapa base: OpenStreetMap (dados abertos) · coordenadas fictícias para demonstração
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
              <TrendingDown size={16} className="text-emerald-600" /> Economia de Frota (km/dia)
            </h2>
            <WeeklyChart todayKm={kmSaved} />
          </section>
        </div>
      </main>

      {selected && (
        <MissionDetailModal
          mission={selected}
          onClose={() => setSelectedId(null)}
          onMove={onMoveMission}
          onResolveImpediment={onResolveImpediment}
        />
      )}

      {toast && (
        <div
          key={toast.key}
          role="status"
          className="animate-slide-in fixed bottom-20 right-4 z-[46] flex max-w-sm items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl sm:right-6"
        >
          <Zap size={16} className="shrink-0 text-violet-300" />
          {toast.text}
        </div>
      )}
    </div>
  )
}
