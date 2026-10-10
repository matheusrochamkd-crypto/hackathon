import { useEffect } from 'react'
import { X, MapPin, User, Route, Lock, ArrowRightLeft, Globe2, AlertOctagon, ShoppingCart, CheckCircle2, FileText } from 'lucide-react'
import RouteMap from './RouteMap'
import { COLUMNS, COLUMN_LABELS, URGENCY_STYLES } from '../data/missions'

function Field({ label, children }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{children}</dd>
    </div>
  )
}

export default function MissionDetailModal({ mission, onClose, onMove, onResolveImpediment }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const column = COLUMNS.find((c) => c.id === mission.column)
  const grouped = mission.kind === 'grouped'

  return (
    <div
      id="modal-detalhe-os"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${mission.title}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="animate-fade-in fixed inset-0 z-[45] flex items-center justify-center bg-slate-900/50 px-4 pb-20 pt-6 backdrop-blur-sm"
    >
      <div className="animate-pop-in flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Cabeçalho */}
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{mission.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                <span className={`h-2 w-2 rounded-full ${column.accent}`} />
                {column.label}
              </span>
              <span className={`rounded-full px-2.5 py-1 ${URGENCY_STYLES[mission.urgency]}`}>
                Urgência: {mission.urgency}
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">{mission.region}</span>
              {mission.hasImpediment && (
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-red-800 font-bold animate-pulse">
                  🚨 Aguardando Compra de Peça
                </span>
              )}
            </div>
          </div>
          <button
            id="btn-fechar-detalhe"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-2 text-slate-500 transition-all duration-300 hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-2">
          {/* Coluna esquerda */}
          <div className="space-y-5">
            {/* ALERTA DE IMPEDIMENTO SE HOUVER */}
            {mission.hasImpediment && (
              <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-4 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                  <AlertOctagon size={18} className="text-red-600 animate-bounce" />
                  <span>Impedimento em Campo Relatado</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  <strong>Motivo:</strong> {mission.impedimentReason || 'Falta de Roteador no estoque'}
                </p>
                <p className="text-[11px] text-red-700">
                  {mission.impedimentDetails || 'Técnico pausou a execução aguardando providências da gestão.'}
                </p>
                <button
                  id="btn-autorizar-compra-modal"
                  onClick={() => {
                    onResolveImpediment?.(mission.id)
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow hover:bg-red-700 active:scale-95"
                >
                  <ShoppingCart size={15} />
                  🛒 Autorizar Compra de Peça (Chefe)
                </button>
              </div>
            )}

            {mission.partPurchased && !mission.hasImpediment && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>
                  <strong>Peça autorizada pelo Gestor!</strong> Chamado liberado para conclusão.
                </span>
              </div>
            )}

            <dl className="grid grid-cols-2 gap-2">
              <Field label="Local">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="shrink-0 text-slate-400" /> {mission.location}
                </span>
              </Field>
              <Field label="Origem">
                <span className="flex items-center gap-1.5">
                  <Globe2 size={14} className="shrink-0 text-slate-400" /> e-Prefeitura (API)
                </span>
              </Field>
              <Field label="Responsável">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="shrink-0 text-slate-400" />
                  {mission.agent ? mission.agent.name : 'Aguardando alocação'}
                </span>
              </Field>
              <Field label="Região">{mission.region}</Field>
            </dl>

            {grouped && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  <Route size={13} /> Chamados unificados · {mission.kmSaved} km poupados
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {mission.items.map((it) => (
                    <li key={it.code} className="flex gap-2">
                      <span className="font-mono font-semibold text-emerald-700">{it.code}</span>
                      {it.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Impacto Sustentabilidade: Economia de Papel */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-2.5 text-xs text-teal-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <FileText size={14} className="text-teal-600" />
                OS 100% Digital (Zero Papel)
              </span>
              <span className="font-bold text-teal-700">
                🌱 {grouped ? '2 folhas de papel poupadas' : '1 folha de papel poupada'}
              </span>
            </div>

            {/* Mover para */}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <ArrowRightLeft size={13} /> Mover para
              </p>
              <div className="flex flex-wrap gap-2">
                {COLUMNS.filter((c) => c.id !== mission.column).map((c) => (
                  <button
                    key={c.id}
                    id={`mover-${c.id}`}
                    onClick={() => onMove(mission.id, c.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 active:scale-95"
                  >
                    <span className={`h-2 w-2 rounded-full ${c.accent}`} />
                    {COLUMN_LABELS[c.id]}
                  </button>
                ))}
              </div>
            </div>

            {/* Linha do tempo / rastreabilidade */}
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <Lock size={13} /> Log de Rastreabilidade
              </p>
              <ol className="relative ml-2 space-y-3 border-l-2 border-slate-200 pl-5">
                {mission.timeline.map((ev, i) => {
                  const last = i === mission.timeline.length - 1
                  return (
                    <li key={`${ev.time}-${i}`} className="relative">
                      <span
                        className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                          last ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-300'
                        }`}
                      />
                      <p className="font-mono text-[11px] font-semibold text-slate-400">{ev.time}</p>
                      <p className={`text-sm ${last ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{ev.text}</p>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>

          {/* Coluna direita: mapa */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
              <Route size={13} /> Rota até o local
            </p>
            <RouteMap missions={[mission]} focusId={mission.id} className="h-72 md:h-[360px]" />
            <p className="mt-2 text-[11px] text-slate-400">Coordenadas fictícias para demonstração.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
