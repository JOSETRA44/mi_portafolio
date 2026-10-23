// Curated from the public portfolio at ../JOSETRA44 (lib/projects.ts and components).
// Keep this small and explicit so the site can render without fetching another app.
export const profile = {
  name: 'José Gabriel Huanaco Muñoz',
  shortName: 'José Gabriel',
  lastName: 'Huanaco Muñoz',
  location: 'Challhuahuacho, Cotabambas · Perú',
  focus: 'Economía × Tecnología',
  email: 'josehuanacomunoz@gmail.com',
  github: 'https://github.com/JOSETRA44',
  repository: 'https://github.com/JOSETRA44/mi_portafolio',
  linkedin: 'https://linkedin.com/in/jose-gabriel-hm',
  portfolio: 'https://josetra44.github.io/',
}

export const projects = [
  {
    name: 'Wayqui',
    category: 'App móvil',
    summary: 'Gestión de deudas y préstamos personales con flujos de pago pensados para billeteras digitales peruanas.',
    stack: ['Flutter', 'Finanzas personales', 'Clean Architecture'],
    url: 'https://josetra44.github.io/wayqui/',
    status: 'En desarrollo',
  },
  {
    name: 'unicali',
    category: 'App educativa',
    summary: 'Información curricular y cálculo de notas sin conexión para estudiantes de la UNSA.',
    stack: ['Flutter', 'Offline', 'Educación'],
    url: 'https://www.unicali.app/',
    status: 'Disponible',
  },
  {
    name: 'ASCHU',
    category: 'App de logística',
    summary: 'Seguimiento de vehículos y conductores para operaciones de logística rural en Perú.',
    stack: ['Mapas', 'Supabase', 'Tiempo real'],
    url: 'https://josetra44.github.io/aschu/',
    status: 'Beta',
  },
  {
    name: 'Jaravi',
    category: 'Sistema / MCP',
    summary: 'Orquestador de agentes de programación que resume la salida de distintas herramientas CLI.',
    stack: ['C#', '.NET', 'MCP'],
    url: 'https://github.com/JOSETRA44/jaravi',
    status: 'En desarrollo',
  },
  {
    name: 'Wacon',
    category: 'CLI / MCP',
    summary: 'Conecta WhatsApp con agentes de IA mediante una CLI y un servidor MCP con memoria de estilo por contacto.',
    stack: ['TypeScript', 'SQLite', 'MCP'],
    url: 'https://github.com/JOSETRA44/wacon-mcp',
    status: 'En desarrollo',
  },
  {
    name: 'OpenAlex MCP',
    category: 'Investigación / MCP',
    summary: 'Herramientas para que agentes consulten trabajos, autores e instituciones de la base académica abierta OpenAlex.',
    stack: ['Python', 'OpenAlex', 'MCP'],
    url: 'https://github.com/JOSETRA44/openalex-mcp',
    status: 'Publicado',
  },
]
