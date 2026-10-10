import { useEffect, useRef, useState } from 'react'

/** Anima um número de 0 (ou do valor anterior) até `target` com easing suave. */
export default function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    let raf

    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const v = from + (target - from) * eased
      fromRef.current = v
      setValue(v)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return Math.round(value)
}
