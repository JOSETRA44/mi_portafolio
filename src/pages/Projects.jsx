import { projects, profile } from '../data/portfolio'

export default function Projects() {
  return (
    <main id="main-content" tabIndex={-1} className="page content-page">
      <p className="eyebrow">Proyectos</p>
      <h1>Soluciones para problemas reales.</h1>
      <p className="lead">Una selección de aplicaciones y herramientas que conectan economía, educación e inteligencia artificial.</p>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <article className="project-card" key={project.name}>
            <div className="project-top"><span className="card-number">{String(index + 1).padStart(2, '0')} / {project.category}</span><span className="project-status">{project.status}</span></div>
            <h2>{project.name}</h2><p>{project.summary}</p>
            <ul className="tag-list" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <a href={project.url} target="_blank" rel="noopener noreferrer">Explorar proyecto <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </div>
      <p className="more-projects">Más proyectos en <a href={profile.portfolio} target="_blank" rel="noopener noreferrer">mi portafolio principal <span aria-hidden="true">↗</span></a>.</p>
    </main>
  )
}
