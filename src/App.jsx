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
/* Tela de Login com Autenticação de Usuário e Senha                   */
/* ------------------------------------------------------------------ */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('gestor@prefeitura.gov.br')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('gestor') // 'gestor' | 'tecnico'
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Preenchimento rápido para apresentação ágil perante a banca
  const handleQuickFill = (role) => {
    setSelectedRole(role)
    setErrorMessage('')
    if (role === 'gestor') {
      setUsername('gestor@prefeitura.gov.br')
      setPassword('123456')
    } else {
      setUsername('carlos.tecnico@prefeitura.gov.br')
      setPassword('123456')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!username.trim()) {
      setErrorMessage('Informe sua matrícula funcional ou e-mail institucional.')
      return
    }

    if (!password) {
      setErrorMessage('Digite sua senha de acesso.')
      return
    }

    setIsLoading(true)

    // Simula autenticação segura no Datacenter Municipal
    setTimeout(() => {
      setIsLoading(false)
      const userLower = username.toLowerCase()

      // Determina perfil se inserido livremente ou baseado na escolha
      if (userLower.includes('tecnico') || userLower.includes('carlos') || selectedRole === 'tecnico') {
        onLogin('tecnico')
      } else {
        onLogin('gestor')
      }
    }, 600)
  }

  return (
    <main className="flex min-h-full items-center justify-center bg-gradient-to-br from-[#0B1329] via-[#1E3A8A] to-[#0B1329] px-4 pb-28 pt-10">
      <section className="animate-slide-in relative w-full max-w-md rounded-3xl border border-[#3B82F6]/30 bg-white/95 p-6 shadow-[0_0_60px_rgba(59,130,246,0.35)] backdrop-blur-md sm:p-8">
        
        {/* LOGO E IDENTIDADE INSTITUCIONAL */}
        <div className="mx-auto mb-3 flex justify-center">
          <img
            src="/logo.png"
            alt="Help Desk Inteligente"
            className="h-20 w-20 object-contain drop-shadow-[0_10px_20px_rgba(30,58,138,0.4)] transition-transform duration-300 hover:scale-105"
          />
        </div>

        <h1 className="text-center text-2xl font-black tracking-tight text-[#1E3A8A] sm:text-3xl">
          Help Desk Inteligente
        </h1>
        <p className="mt-1 text-center text-xs font-semibold text-slate-500 sm:text-sm">
          Acesso Seguro ao Sistema Integrado Municipal
        </p>

        {/* SELO DE DESIGN INSTITUCIONAL */}
        <div className="mt-2.5 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#34D399]/40 bg-[#34D399]/15 px-3 py-0.5 text-[11px] font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
            Governo Digital · Autenticação Cidadã & Funcional
          </span>
        </div>

        {/* SELETOR DE PERFIL RÁPIDO */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            id="tab-role-gestor"
            onClick={() => handleQuickFill('gestor')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              selectedRole === 'gestor'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Monitor size={15} />
            Gestor (Web)
          </button>
          <button
            type="button"
            id="tab-role-tecnico"
            onClick={() => handleQuickFill('tecnico')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              selectedRole === 'tecnico'
                ? 'border border-[#34D399] bg-gradient-to-r from-[#34D399] to-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Smartphone size={15} />
            Técnico (PWA)
          </button>
        </div>

        {/* FORMULÁRIO DE LOGIN E SENHA */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700 animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {errorMessage}
            </div>
          )}

          {/* CAMPO USUÁRIO / MATRÍCULA */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Matrícula ou E-mail Institucional
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <ShieldCheck size={18} className="text-[#3B82F6]" />
              </div>
              <input
                id="input-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: gestor@prefeitura.gov.br ou 1042"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20"
              />
            </div>
          </div>

          {/* CAMPO SENHA */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Senha de Acesso
              </label>
              <span className="text-[11px] font-semibold text-[#3B82F6] hover:underline cursor-pointer">
                Esqueceu a senha?
              </span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock size={18} className="text-[#3B82F6]" />
              </div>
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/70 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20"
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <span className="text-[11px] font-bold text-slate-500">Ocultar</span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-500">Exibir</span>
                )}
              </button>
            </div>
          </div>

          {/* BOTÃO ENTRAR */}
          <button
            type="submit"
            id="btn-submit-login"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] py-3 text-sm font-bold text-white shadow-[0_4px_18px_rgba(59,130,246,0.35)] transition-all duration-300 hover:from-[#2563EB] hover:to-[#172554] hover:shadow-[0_8px_24px_rgba(30,58,138,0.45)] focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/30 active:scale-95 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin text-white" />
                <span>Autenticando no Datacenter...</span>
              </>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </>
            )}
          </button>
        </form>

        {/* ATALHOS DE 1 CLIQUE PARA O PITCH */}
        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50 p-3 text-center">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Acesso Rápido para a Banca (1 Clique)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="quick-login-gestor"
              onClick={() => onLogin('gestor')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#3B82F6]/40 bg-white py-1.5 px-2 text-xs font-bold text-[#1E3A8A] shadow-sm transition hover:bg-blue-50 hover:border-[#3B82F6]"
            >
              <Monitor size={14} className="text-[#3B82F6]" />
              Direto Gestor
            </button>
            <button
              type="button"
              id="quick-login-tecnico"
              onClick={() => onLogin('tecnico')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#34D399]/50 bg-white py-1.5 px-2 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 hover:border-[#34D399]"
            >
              <Smartphone size={14} className="text-[#34D399]" />
              Direto Técnico
            </button>
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Lock size={12} className="text-[#3B82F6]" /> Controle de Acesso Baseado em Perfis (RBAC / LGPD)
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
