# Portafolio 3D de José Gabriel

Sitio en React y Vite con una escena 3D explorable. La información personal y los proyectos se tomaron del proyecto local `JOSETRA44` y quedaron en [`src/data/portfolio.js`](src/data/portfolio.js) para que sea fácil revisarlos y actualizarlos.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+.

```bash
npm ci
npm run dev
```

Verificaciones:

```bash
npm run lint
npm test
npm run build
```

El flujo de CI ejecuta las mismas verificaciones y una auditoría de dependencias en cada push y pull request.

## Estructura

- `src/data/portfolio.js`: contenido del perfil y tarjetas de proyectos.
- `src/pages/`: rutas de inicio, acerca de, proyectos y contacto.
- `src/components/`: navegación y carga progresiva de la escena.
- `src/3d/`: controles, modelo, terreno y efectos de la escena. Este módulo se descarga al acercarse a la sección 3D.
- `src/3d/Cheetah.jsx`: guepardo geométrico animado sin descargas adicionales.

La escena ofrece movimiento relativo a la cámara con WASD o flechas, giro de cámara al arrastrar y botones táctiles para desplazarse. No bloquea el cursor. El paisaje combina árboles instanciados, colinas, rocas y terreno generado en el navegador. Si WebGL no está disponible, muestra una alternativa de texto. La preferencia del sistema para reducir movimiento evita cargar la animación hasta que el visitante la active.

## Despliegue

El sitio está configurado para GitHub Pages en `https://josetra44.github.io/mi_portafolio/`. Vite genera las rutas de recursos bajo `/mi_portafolio/` y `HashRouter` permite recargar páginas como `/#/projects` sin reglas de reescritura.

El flujo [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila y publica `dist` al hacer push a `main`. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como origen. También puedes ejecutar el flujo manualmente desde la pestaña **Actions**.

## Contenido y modelo

El guepardo geométrico sustituye al triángulo de prueba que antes se cargaba como modelo. Las fichas de proyectos son una selección del portafolio `JOSETRA44`.
