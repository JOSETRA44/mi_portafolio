import { profile } from '../data/portfolio'

export default function About() {
  return (
    <main id="main-content" tabIndex={-1} className="page content-page">
      <p className="eyebrow">Sobre mí / {profile.location}</p>
      <h1>Donde la economía encuentra la tecnología.</h1>
      <p className="lead">Soy {profile.name}, estudiante de Economía en la Universidad Nacional de San Agustín de Arequipa. Diseño y construyo herramientas digitales para resolver problemas cotidianos.</p>
      <div className="content-grid">
        <section className="info-card"><span className="card-number">01 / Formación</span><h2>Economía en la UNSA</h2><p>Combino análisis económico con desarrollo de software y diseño de interfaces. Soy becario por excelencia académica.</p></section>
        <section className="info-card"><span className="card-number">02 / Enfoque</span><h2>Tecnología para contextos reales</h2><p>Desarrollo aplicaciones móviles, herramientas para agentes y productos útiles incluso donde la conectividad es limitada.</p></section>
        <section className="info-card"><span className="card-number">03 / Idiomas</span><h2>Perspectiva local</h2><p>Hablo quechua y español de forma nativa. Mi origen en Challhuahuacho influye en cómo pienso la accesibilidad y la utilidad de cada producto.</p></section>
      </div>
    </main>
  )
}
