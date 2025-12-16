import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <nav>
        <Link to="/">Home</Link>
        <span> · </span>
        <Link to="/about">About</Link>
        <span> · </span>
        <Link to="/projects">Projects</Link>
        <span> · </span>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  )
}
