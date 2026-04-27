import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-body px-6 text-center">
      <h1 className="font-display text-6xl text-slateblue">404</h1>
      <p className="text-muted mt-2">That page doesn't exist on Creatink.</p>
      <Button asChild className="mt-6"><Link to="/home">Back to Home</Link></Button>
    </div>
  )
}
