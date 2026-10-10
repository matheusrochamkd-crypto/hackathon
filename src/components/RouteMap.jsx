import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BASE, COLUMN_COLORS } from '../data/missions'

const EMOJI = { entrada: '📥', ia: '🧠', execucao: '🚀', concluido: '✅' }

function pin(color, emoji, extra = '') {
  return L.divIcon({
    className: '',
    html: `<div class="map-pin ${extra}" style="background:${color}">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

/**
 * Mapa interativo (OpenStreetMap, sem dependência de provedores proprietários).
 * Mostra a base, as OS por coluna e as rotas despachadas.
 * Se `focusId` for informado, enquadra a base e aquela missão.
 */
export default function RouteMap({ missions, focusId = null, className = 'h-72' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)

  useEffect(() => {
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(BASE.coords, 14)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    const t = setTimeout(() => map.invalidateSize(), 300)
    return () => {
      clearTimeout(t)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()

    const points = [BASE.coords]
    L.marker(BASE.coords, { icon: pin('#1e3a8a', '🏢'), zIndexOffset: 500 }).bindTooltip(BASE.name).addTo(layer)

    missions.forEach((m) => {
      const grouped = m.kind === 'grouped'
      const color = COLUMN_COLORS[m.column]
      points.push(m.coords)

      if (m.column === 'ia' || m.column === 'execucao') {
        L.polyline([BASE.coords, m.coords], {
          color,
          weight: grouped ? 4 : 3,
          dashArray: '8 8',
          opacity: 0.85,
        }).addTo(layer)
      }

      if (m.column === 'execucao' && m.fieldStatus) {
        L.circle(m.coords, { radius: 200, color: '#f59e0b', fillColor: '#fbbf24', fillOpacity: 0.2, weight: 1 }).addTo(layer)
        L.marker([m.coords[0] + 0.0016, m.coords[1]], { icon: pin('#f59e0b', '🛠️') })
          .bindTooltip(m.fieldStatus)
          .addTo(layer)
      }

      L.marker(m.coords, {
        icon: pin(color, grouped ? '✨' : EMOJI[m.column], grouped ? 'map-pin-ai' : ''),
        zIndexOffset: grouped ? 400 : 0,
      })
        .bindTooltip(m.title)
        .addTo(layer)
    })

    const focus = missions.find((m) => m.id === focusId)
    if (focus) map.fitBounds([BASE.coords, focus.coords], { padding: [50, 50], maxZoom: 16 })
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40] })
  }, [missions, focusId])

  return <div ref={containerRef} className={`isolate z-0 w-full overflow-hidden rounded-xl border border-slate-200 ${className}`} />
}
