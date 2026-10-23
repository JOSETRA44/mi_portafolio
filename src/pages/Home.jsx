import { Link } from 'react-router-dom'
import { profile } from '../data/portfolio'
import SceneExperience from '../components/SceneExperience'

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="page home">
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">{profile.location}</p>
          <h1 id="hero-title">Ideas que nacen<br />del <span>territorio.</span></h1>
          <p className="hero-focus">{profile.name} · {profile.focus}</p>
          <p className="lead">Estudio economía y construyo herramientas digitales para problemas concretos. Mi trabajo conecta la realidad local con tecnología útil.</p>
          <div className="actions">
            <Link className="button primary" to="/projects">Ver proyectos <span aria-hidden="true">↗</span></Link>
            <button className="button secondary" type="button" onClick={() => document.getElementById('escena')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Explorar escena <span aria-hidden="true">↓</span></button>
          </div>
        </div>
        <div className="hero-aside" aria-hidden="true"><span>01 / 02</span><strong>Economía<br />y código.</strong><small>Desde los Andes<br />para donde haga falta.</small></div>
      </section>
      <section id="escena" className="scene-section" aria-labelledby="scene-title">
        <div className="section-heading"><div><p className="eyebrow">Un espacio para explorar</p><h2 id="scene-title">Sal a recorrer.</h2></div><p>Camina con W A S D o las flechas. Arrastra para girar la cámara. En móvil, usa los botones de dirección.</p></div>
        <SceneExperience />
      </section>
    </main>
  )
}
