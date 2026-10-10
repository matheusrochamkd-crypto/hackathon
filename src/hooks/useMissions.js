import { useCallback, useRef, useState } from 'react'
import { COLUMN_LABELS, INITIAL_MISSIONS, SIMULATED_CALLS } from '../data/missions'

const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

/**
 * Estado global das missões. Vive no componente pai (App), então sobrevive
 * ao trocar de tela (Gestor <-> Técnico), provando a sincronização em memória.
 */
export default function useMissions() {
  const [missions, setMissions] = useState(INITIAL_MISSIONS)
  const simCounter = useRef(0)

  /** Move um card para outra coluna (o card vai para o topo da coluna de destino). */
  const moveMission = useCallback((id, column, actor = 'Gestor') => {
    setMissions((prev) => {
      const target = prev.find((m) => m.id === id)
      if (!target || target.column === column) return prev
      const updated = {
        ...target,
        column,
        isNew: false,
        timeline: [...target.timeline, { time: now(), text: `${actor} moveu para "${COLUMN_LABELS[column]}"` }],
      }
      return [updated, ...prev.filter((m) => m.id !== id)]
    })
  }, [])

  /** Disparada pelo Técnico em "Finalizar e Enviar Evidência": IA -> Concluído. */
  const completeGroupedMission = useCallback(() => {
    setMissions((prev) => {
      const target = prev.find((m) => m.kind === 'grouped')
      if (!target || target.column === 'concluido') return prev
      const updated = {
        ...target,
        column: 'concluido',
        isNew: false,
        timeline: [
          ...target.timeline,
          { time: now(), text: 'Missão unificada aceita pelo Agente João (app mobile)' },
          { time: now(), text: 'Evidência enviada — OS #1042 e #1088 finalizadas (+5 Pontos de OS: Alta 3 + Média 2)' },
        ],
      }
      return [updated, ...prev.filter((m) => m.id !== target.id)]
    })
  }, [])

  /** Modo simulação: chega um chamado novo na Entrada e, após 3s, a IA o prioriza. */
  const simulateNewCall = useCallback(() => {
    const n = simCounter.current++
    const tpl = SIMULATED_CALLS[n % SIMULATED_CALLS.length]
    const shift = Math.floor(n / SIMULATED_CALLS.length) * 0.0006
    const id = `sim-${1101 + n}`
    const mission = {
      id,
      kind: 'simple',
      column: 'entrada',
      title: `OS #${1101 + n} - ${tpl.problem}`,
      location: tpl.location,
      region: tpl.region,
      urgency: tpl.urgency,
      coords: [tpl.coords[0] + shift, tpl.coords[1] + shift],
      isNew: true,
      timeline: [{ time: now(), text: 'Chamado recebido via API bidirecional (e-Prefeitura)' }],
    }
    setMissions((prev) => [mission, ...prev])

    setTimeout(() => {
      setMissions((prev) => {
        const t = prev.find((m) => m.id === id)
        if (!t) return prev
        if (t.column !== 'entrada') return prev.map((m) => (m.id === id ? { ...m, isNew: false } : m))
        const updated = {
          ...t,
          column: 'ia',
          isNew: false,
          timeline: [
            ...t.timeline,
            { time: now(), text: 'Motor IA calculou prioridade e rota — movido para "Priorizado por IA"' },
          ],
        }
        return [updated, ...prev.filter((m) => m.id !== id)]
      })
    }, 3000)

    return mission
  }, [])

  /** Disparada pelo Técnico ao relatar impedimento: card vai para a lista de espera e alerta gestor. */
  const reportImpediment = useCallback(
    (id = 'grouped-1042-1088', reason = 'Falta de Peça / Switch Queimado', details = '') => {
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === id || (id === 'grouped' && m.kind === 'grouped')) {
            return {
              ...m,
              hasImpediment: true,
              partPurchased: false,
              impedimentReason: reason,
              impedimentDetails:
                details ||
                'Switch de distribuição do 3º andar inoperante após pico de tensão. Necessária aquisição urgente de switch 24p pelo gestor.',
              impedimentTime: now(),
              timeline: [
                ...m.timeline,
                {
                  time: now(),
                  text: `🚨 Impedimento relatado pelo Técnico em campo: ${reason} (Aguardando compra pelo Gestor)`,
                },
              ],
            }
          }
          return m
        })
      )
    },
    []
  )

  /** Disparada pelo Gestor no Kanban para aprovar a compra da peça e liberar o chamado. */
  const resolveImpediment = useCallback((id = 'grouped-1042-1088') => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id || (id === 'grouped' && m.kind === 'grouped')) {
          return {
            ...m,
            hasImpediment: false,
            partPurchased: true,
            timeline: [
              ...m.timeline,
              {
                time: now(),
                text: '🛒 Chefe autorizou compra da peça (Pedido #PC-2026 emitido via e-Compras Municipal). Chamado liberado para o técnico!',
              },
            ],
          }
        }
        return m
      })
    )
  }, [])

  /** Reinicia as missões para o estado inicial da demonstração. */
  const resetMissions = useCallback(() => {
    setMissions(INITIAL_MISSIONS)
  }, [])

  return {
    missions,
    moveMission,
    completeGroupedMission,
    simulateNewCall,
    reportImpediment,
    resolveImpediment,
    resetMissions,
  }
}

