# Registro Técnico — Dana Talía

> Planilla de referencias del sitio. ⚠ No subas contraseñas ni secretos reales a este archivo.
> Este sitio **NO usa base de datos**: todo el contenido se guarda como archivos JSON en el repositorio de GitHub.

## Sitio web

| Dato | Valor |
| --- | --- |
| Nombre de la página | Dana Talía |
| URL pública | https://danatalia.pages.dev |
| Panel de gestión | https://danatalia.pages.dev/panel |

## Repositorio (es la "base de datos")

| Dato | Valor |
| --- | --- |
| Repositorio | https://github.com/terracoderqta-jpg/danatalia |
| Rama | `main` |
| Framework | Next.js 15 (export estático) |
| Hosting / deploy | Cloudflare Pages (auto-deploy al hacer push a `main`) |

### Dónde se guarda cada cosa

| Contenido | Ruta en el repo |
| --- | --- |
| Banner principal / portada | `src/data/banner.json` |
| Categorías | `src/data/categorias/*.json` |
| Productos | `src/data/productos/*.json` |
| Banners adicionales | `src/data/banners/*.json` |
| Comentarios / testimonios | `src/data/comentarios/comentarios.json` |
| Fotos y videos subidos | `public/uploads/*` |

## Accesos y credenciales

La autenticación del panel usa el login de GitHub (OAuth) y guarda el token en el navegador (localStorage). No hay usuarios ni contraseñas propios del panel.

### 1. GitHub

| Dato | Valor |
| --- | --- |
| Usuario Git | `terracoderqta-jpg` |
| Email | `terracoderqta@gmail.com` |
| Contraseña | (se gestiona en github.com → Settings; NO está en el código) |
| App OAuth del panel | "Dana Talía Panel" (github.com → Settings → Developer settings → OAuth Apps) |

### 2. Cloudflare Pages (deploy automático)

| Dato | Valor |
| --- | --- |
| Cuenta | (login en https://dash.cloudflare.com) |
| Proyecto Pages | (mismo repo `danatalia`) |

#### Variables de entorno del proyecto Cloudflare

| Variable | Valor / Uso |
| --- | --- |
| `GITHUB_CLIENT_ID` | ID de la GitHub App (desde Developer settings de GitHub) |
| `GITHUB_CLIENT_SECRET` | Secreto de la GitHub App ⚠ confidencial |
| `GITHUB_REPO_PRIVATE` | `"1"` si el repo es privado (actual: repositorio público → no hace falta) |

## Flujo de publicación

1. El panel edita archivos JSON (queda en cola local).
2. "Publicar todos" sube los cambios a GitHub mediante la API de GitHub (rama `main`).
3. Cloudflare Pages detecta el push, reconstruye y publica el sitio (~1–2 min).
4. El navegador debe hacer **hard refresh (Ctrl+Shift+R)** para ver los cambios si quedó caché.