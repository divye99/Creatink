import { useEffect } from 'react'

export default function Splash({ onDone }) {
  useEffect(() => {
    if (!onDone) return
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg">
      <h1 className="splash-fade-in font-display font-bold text-6xl sm:text-7xl text-body tracking-tight">
        CREATINK
      </h1>
      <p
        className="splash-fade-in mt-3 text-lg font-light tracking-[0.18em] text-cognac"
        style={{ animationDelay: '300ms' }}
      >
        Creator Link
      </p>
    </div>
  )
}
