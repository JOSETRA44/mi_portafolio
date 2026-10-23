import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import landscape from '../assets/landscape.svg'

const ThreeScene = lazy(() => import('../3d/ThreeScene'))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(context)
  } catch {
    return false
  }
}

class SceneErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return <div className="scene-loading"><p>No se pudo iniciar la escena 3D. El resto del portafolio sigue disponible.</p></div>
    return this.props.children
  }
}

export default function SceneExperience() {
  const containerRef = useRef(null)
  const [supported, setSupported] = useState(null)
  const [activated, setActivated] = useState(false)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      const timer = window.setTimeout(() => setSupported(supportsWebGL()), 0)
      return () => window.clearTimeout(timer)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSupported(supportsWebGL())
        observer.disconnect()
      }
    }, { rootMargin: '300px' })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const shouldRender = supported === true && (!reducedMotion || activated)

  return (
    <div ref={containerRef}>
      {shouldRender ? (
        <SceneErrorBoundary>
          <Suspense fallback={<div className="scene-loading" role="status">Cargando escena 3D…</div>}>
            <ThreeScene />
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        <div className="scene-loading">
          <img className="scene-poster" src={landscape} alt="" />
          {supported === false ? <p>Tu navegador no puede mostrar esta escena 3D. Puedes explorar los proyectos desde el menú.</p> :
            reducedMotion && !activated ? <div><p>La animación está pausada según tu preferencia de movimiento.</p><button className="button primary" type="button" onClick={() => setActivated(true)}>Activar escena 3D</button></div> :
              <p role="status">La escena se cargará al llegar a esta sección.</p>}
        </div>
      )}
    </div>
  )
}
