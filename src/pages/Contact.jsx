import { profile } from '../data/portfolio'

export default function Contact() {
  return (
    <main id="main-content" tabIndex={-1} className="page content-page contact-page">
      <p className="eyebrow">Contacto</p>
      <h1>Construyamos algo útil.</h1>
      <p className="lead">Estoy abierto a colaboraciones, proyectos académicos y oportunidades que conecten economía y tecnología.</p>
      <div className="contact-links">
        <a href={`mailto:${profile.email}`}><span>Correo electrónico</span><strong>{profile.email}</strong><span aria-hidden="true">↗</span></a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span><strong>JOSETRA44</strong><span aria-hidden="true">↗</span></a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><strong>José Gabriel</strong><span aria-hidden="true">↗</span></a>
      </div>
    </main>
  )
}
