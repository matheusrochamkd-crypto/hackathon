import { useState } from 'react'
import GestorScreen from './components/GestorScreen.jsx'
import TecnicoScreen from './components/TecnicoScreen.jsx'
import useMissions from './hooks/useMissions.js'
import {
  RefreshCw,
  Server,
  Lock,
  Monitor,
  Smartphone,
  ShieldCheck,
  Headset,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Rodapé de Compliance (aparece em todas as telas)                    */
/* ------------------------------------------------------------------ */
function ComplianceFooter() {
  const badges = [
    { icon: RefreshCw, label: 'API Bidirecional Ativa (e-Prefeitura)' },
    { icon: Server, label: 'Host: Datacenter Municipal (Soberania Local)' },
    { icon: Lock, label: 'Log de Rastreabilidade On' },
  ]

  return (
    <footer
      id="compliance-footer"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-[#1E3A8A]/40 bg-[#0B1329] text-slate-300 shadow-lg"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-3 py-2 sm:justify-between">
        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-400 md:flex">
          <img src="/logo.png" alt="Logo" className="h-4 w-4 object-contain" />
          <ShieldCheck size={12} className="text-[#34D399]" /> Compliance de Infraestrutura
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {badges.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E3A8A]/50 bg-slate-900/80 px-2 py-1 font-mono text-[10px] sm:text-[11px]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              </span>
              <Icon size={12} className="text-[#3B82F6]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Tela de Login                                                       */
/* ------------------------------------------------------------------ */
function LoginScreen({ onLogin }) {
  return (
    <main className="flex min-h-full items-center justify-center bg-gradient-to-br from-[#0B1329] via-[#1E3A8A] to-[#0B1329] px-4 pb-28 pt-10">
      <section className="animate-slide-in relative w-full max-w-lg rounded-3xl border border-[#3B82F6]/30 bg-white/95 p-6 text-center shadow-[0_0_50px_rgba(59,130,246,0.3)] backdrop-blur-md sm:p-10">
        {/* LOGO OFICIAL */}
        <div className="mx-auto mb-4 flex justify-center">
          <img
            src="/logo.png"
            alt="Help Desk Inteligente"
            className="h-24 w-24 object-contain drop-shadow-[0_10px_25px_rgba(30,58,138,0.4)] transition-transform duration-300 hover:scale-105"
          />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[#1E3A8A] sm:text-4xl">
          Help Desk Inteligente
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
          Motor de Priorização e Roteamento Dinâmico
        </p>

        {/* SELO DE DESIGN INSTITUCIONAL */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#34D399]/40 bg-[#34D399]/15 px-3 py-0.5 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-[#34D399]" />
            Sistema Integrado Municipal
          </span>
        </div>

        <div className="my-7 h-px bg-slate-200" />

        <div className="flex flex-col gap-4">
          <button
            id="btn-login-gestor"
            onClick={() => onLogin('gestor')}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] px-5 py-4 text-base font-bold text-white shadow-[0_4px_18px_rgba(59,130,246,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#2563EB] hover:to-[#172554] hover:shadow-[0_8px_24px_rgba(30,58,138,0.45)] focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/30 active:scale-95"
          >
            <Monitor size={22} className="text-white" />
            Entrar como Gestor (Dashboard Web)
          </button>
          <button
            id="btn-login-tecnico"
            onClick={() => onLogin('tecnico')}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#34D399] bg-gradient-to-r from-[#34D399]/10 to-teal-500/10 px-5 py-4 text-base font-bold text-[#1E3A8A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#34D399]/20 hover:shadow-[0_8px_20px_rgba(52,211,153,0.35)] focus:outline-none focus:ring-4 focus:ring-[#34D399]/30 active:scale-95"
          >
            <Smartphone size={22} className="text-emerald-600" />
            Entrar como Técnico (PWA Mobile)
          </button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Lock size={12} className="text-[#3B82F6]" /> Autenticação com controle de acesso por perfil
        </p>
      </section>
    </main>
  )
}




/* ------------------------------------------------------------------ */
/* App (estado de navegação)                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login') // 'login' | 'gestor' | 'tecnico'
  // Estado global das missões: elevado ao App para sincronizar Gestor <-> Técnico
  const {
    missions,
    moveMission,
    completeGroupedMission,
    simulateNewCall,
    reportImpediment,
    resolveImpediment,
    resetMissions,
  } = useMissions()
  const groupedDone = missions.some((m) => m.kind === 'grouped' && m.column === 'concluido')
  const groupedMission = missions.find((m) => m.kind === 'grouped')

  return (
    <div className="h-full">
      {currentScreen === 'login' && <LoginScreen onLogin={setCurrentScreen} />}
      {currentScreen === 'gestor' && (
        <GestorScreen
          missions={missions}
          onMoveMission={moveMission}
          onSimulate={simulateNewCall}
          onResolveImpediment={resolveImpediment}
          onResetMissions={resetMissions}
          onLogout={() => setCurrentScreen('login')}
        />
      )}
      {currentScreen === 'tecnico' && (
        <TecnicoScreen
          missions={missions}
          onLogout={() => setCurrentScreen('login')}
          onFinishMission={completeGroupedMission}
          onReportImpediment={reportImpediment}
          onResolveImpediment={resolveImpediment}
          onResetMissions={resetMissions}
          alreadyCompleted={groupedDone}
          activeMission={groupedMission}
        />
      )}
      <ComplianceFooter />
    </div>
  )
}
