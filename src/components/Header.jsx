import { NavLink } from 'react-router-dom'
import { profile } from '../data/portfolio'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/about', label: 'Acerca de' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/contact', label: 'Contacto' },
]

export default function Header() {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/" aria-label={`Portafolio de ${profile.shortName}, ir al inicio`}>JG<span>.</span></NavLink>
      <nav aria-label="Navegación principal">
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
