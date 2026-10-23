import { profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="site-footer">
      <small>© {new Date().getFullYear()} {profile.name}</small>
      <a href={profile.repository} target="_blank" rel="noopener noreferrer">Código en GitHub <span aria-hidden="true">↗</span></a>
    </footer>
  )
}
