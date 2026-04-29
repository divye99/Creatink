import { useEffect } from 'react'

export default function Splash({ onDone }) {
  useEffect(() => {
    if (!onDone) return
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <h1
        className="splash-fade-in font-display text-6xl sm:text-7xl text-creme"
        style={{ fontWeight: 800, letterSpacing: '0.15em' }}
      >
        CREATINK
      </h1>
      <p
        className="splash-fade-in mt-4 text-base text-prairie"
        style={{ animationDelay: '300ms', fontWeight: 300, letterSpacing: '0.22em' }}
      >
        CREATOR LINK
      </p>
    </div>
  )
}
