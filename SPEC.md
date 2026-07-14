# KettenKI — Portfolio & Blog — SPEC

## 1. Propósito

`kettenki.com` es el sitio comercial de KettenKI (prototipos de IA: Bambera, Liviana, Fandango). Este spec cubre la ampliación del sitio con dos secciones nuevas, **sin alterar el posicionamiento comercial de la home**:

- **Portfolio** — casos de estudio de ingeniería (proyectos propios y experiencia profesional). Contenido atemporal, ficha fija.
- **Blog** — artículos personales, cronológicos, sobre lo que Javi aprende/construye/piensa. Sin ficha fija, voz personal.

**Diferencia conceptual:** portfolio = "esto hice y funcionó" (qué). Blog = "esto pensé/aprendí/debuggeé" (proceso). Un mismo proyecto (ej. Bambera) puede tener ficha de portfolio y varios posts de blog sobre él — no es contenido duplicado, es ángulo distinto.

## 2. Decisión de arquitectura de información

- Sin subdominio. Ambas secciones viven en subcarpetas del mismo repo/dominio: `kettenki.com/portfolio/` y `kettenki.com/blog/`.
- **Menú propio en Portfolio/Blog, distinto del menú comercial.** El header (logo, estilo, posición) se mantiene igual en todo el sitio, pero el contenido del menú cambia según el contexto:
  - Resto del sitio (`index.html`, `about.html`, `services.html`, `contact.html`): `Home | About | Services | Contact`.
  - Portfolio/Blog (`portfolio/*`, `blog/*`): `Portfolio | Blog | Contact`.
  - El logo, en ambos casos, enlaza siempre a `index.html` (vuelta a la marca comercial).
  - `Contact` aparece en los dos menús porque es universal.
  - Motivo: evita la incoherencia de mostrar "Services" (mensaje comercial) dentro de una ficha técnica de portfolio, y da a Portfolio/Blog una navegación autosuficiente entre sí, sin depender solo del enlace desde `about.html` como único punto de entrada.
- Se sigue enlazando a Portfolio **también** desde `about.html` (callout al final), como refuerzo, no como único acceso.
- Razón de fondo: separar audiencias (cliente de negocio vs. reclutador/curioso técnico) sin fragmentar dominio, SEO ni mantenimiento.

## 3. Restricciones técnicas

- **Sin frameworks ni generadores** (no Jekyll, no build system). HTML + CSS + JS vanilla, igual que el resto del sitio.
- Reusar el CSS existente de `services.html` (estética oscura, degradado azul eléctrico → verde esmeralda, badges) como base visual estructural para tarjetas de portfolio y blog (tipografía, spacing, grid, badges) — el color de fondo cambia según 3.2.
- Reusar el sistema **i18n existente** (`data-i18n` + localStorage, default alemán) en todo contenido nuevo.

### 3.1 Idiomas — REGLA CRÍTICA

- El sitio es **bilingüe DE/EN únicamente**. **Alemán es el idioma por defecto.**
- **Todo contenido nuevo** (portfolio, blog, chatbot) debe existir en **ambos idiomas**, con su clave `data-i18n` correspondiente. Ninguna página nueva puede quedar solo en un idioma.
- **El sitio NO tiene versión en español.** Javi conversa en español durante el desarrollo, pero eso no es el idioma del producto. No escribir contenido de cara al usuario en español, ni añadir español como tercer idioma.
- Las fichas de portfolio y posts de blog redactados en español durante la planificación son **borradores de contenido**, no texto final. Deben traducirse a DE y EN al maquetarse.
- El chatbot (SPEC 7) responde en DE y EN, siguiendo el mismo criterio: alemán por defecto.
- Nav/footer compartido: si se decide extraer a partial, usar el mismo patrón ya existente en el sitio (evitar introducir un sistema de templating nuevo).

### 3.2 Tema visual — Portfolio/Blog vs. resto del sitio

**Decisión:** Portfolio y Blog usan un tema claro (fondo blanco) en el cuerpo de la página, distinto del tema oscuro del resto de KettenKI (`index.html`, `about.html`, `services.html`, `contact.html`).

- **Header/nav**: se mantiene igual en todo el sitio (oscuro, mismo logo, mismo componente). Es la constante de identidad — el visitante siempre sabe que sigue en kettenki.com.
- **Cuerpo de página**: oscuro en el sitio comercial (como está ahora), **blanco** en `portfolio/`, `portfolio/*.html` y `blog/`, `blog/*.html`.
- **Motivo:** refuerza a nivel visual la separación de audiencias ya decidida en la sección 2 — entrar en Portfolio/Blog debe sentirse como pasar del espacio de marca (KettenKI, prototipos comerciales) al espacio personal de Javi (trayectoria, blog), sin dejar de ser el mismo sitio.

**Implementación técnica sugerida:**
- Nueva hoja de estilos `css/portfolio-blog.css` (o clase de tema `theme-light` en `<body>`) que sobrescribe únicamente las variables de color relevantes (fondo, texto, superficies de tarjeta), reutilizando el resto del sistema existente sin duplicarlo.
- No crear un segundo sistema de diseño desde cero — es un cambio de paleta sobre la misma base, no una reconstrucción.
- Los componentes que ya existen (badges de stack, tabla de stack, callout box) deben verse bien en ambos temas; ajustar solo contraste/color, no estructura.

Esta decisión aplica retroactivamente a todo lo ya maquetado de RailTrack Manager — pendiente de re-tematizar cuando se implemente.

## 4. Estructura de archivos

Los índices son `index.html` **dentro** de su carpeta, no archivos sueltos en la raíz. Así `kettenki.com/portfolio/` resuelve sin `.html` y sin 404 — convención estándar en sitios estáticos, y coherente con las URLs canónicas usadas en este SPEC.

```
/
├── SPEC.md
├── PROJECT-STATUS.md
├── index.html
├── about.html              ← enlace a /portfolio/ (callout al final)
├── services.html
├── contact.html
├── portfolio/
│   ├── index.html           ← índice del portfolio (grid de tarjetas)
│   ├── railtrack-manager.html
│   ├── spicy.html
│   ├── bambera.html
│   └── mini-midoffice.html
└── blog/
    ├── index.html           ← índice del blog (listado + filtro por tags)
    └── biomedicina-ai.html 
```

URLs resultantes: `/portfolio/`, `/portfolio/railtrack-manager.html`, `/blog/`.

## 5. Portfolio

### 5.1 `portfolio.html` (índice)

- Intro breve (2-3 líneas): qué va a encontrar el visitante — trabajo real como ingeniero backend/full-stack, más allá de los prototipos de IA de Services.
- Grid de tarjetas. Cada tarjeta:
  - Thumbnail (captura del proyecto)
  - Título
  - Una línea de resumen/gancho (no el contexto completo)
  - 3-4 badges de stack (mismo estilo visual que badges de tecnología en `services.html`)
  - Badges de tipo, en dos ejes independientes (no una escala única):
    - **Eje 1 — Propiedad** (siempre uno de los dos): 🎓 **Eigenes Projekt** vs. 🤝 **Kundenprojekt** (encargo de cliente).
    - **Eje 2 — Estado** (opcional, solo si aplica): 🚀 **In Produktion**.
    - Ejemplo: RailTrack Manager → solo Eigenes Projekt. Spicy Feedback Tool → Kundenprojekt + In Produktion (los dos a la vez).
    - Colores: Eigenes Projekt en verde, Kundenprojekt en azul, In Produktion en verde/esmeralda (distinto del verde de Eigenes Projekt, para que no se confundan si coinciden en la misma tarjeta).
  - Link a la ficha completa
- Orden: por relevancia/fuerza de evidencia, no cronológico. Proyectos con repo público y capturas primero.
- La raíz **no** lleva contenido de ficha (nada de reto técnico, resultado, etc.) — es índice visual, no resumen ejecutivo.

### 5.1.1 Foto de perfil con efecto morph (solo en portfolio/index.html)

Debajo del título "Portfolio", círculo de ~150px con la foto de Javi. Comportamiento tipo interruptor (no un simple hover que revierte):

- **Estado inicial:** foto normal (`profile-photo.jpg`), quieta.
- **Al pasar el ratón (estado = foto):** reproduce `profile-forward.mp4` completo, sin interrupción aunque el ratón salga antes de terminar. Al acabar, queda fijo en el frame final = imagen geométrica (`profile-geometric.jpg`), estado pasa a "geométrica".
- **Al pasar el ratón (estado = geométrica):** reproduce `profile-reverse.mp4` completo (generado invirtiendo el vídeo forward con `ffmpeg -i profile-forward.mp4 -vf reverse profile-reverse.mp4`, no con una segunda generación de IA). Al acabar, queda fijo en `profile-photo.jpg`, estado vuelve a "foto".
- Un vídeo en marcha ignora el `mouseleave`: siempre termina el ciclo completo antes de aceptar la siguiente interacción.
- `clip-path: circle()` o `border-radius: 50%` con `overflow: hidden` en el contenedor para el recorte circular. Vídeos sin controles, sin sonido (`muted`), `playsinline`.
- Assets en `portfolio/img/javier-carranza/` (imágenes) y `portfolio/vid/javier-carranza/` (vídeos): `profile-photo.jpg`, `profile-geometric.jpg` en la primera; `profile-forward.mp4`, `profile-reverse.mp4` en la segunda.

### 5.2 Ficha de proyecto (plantilla base, adaptable por proyecto)

Orden por defecto:

1. **Contexto** — por qué existe el proyecto. Puede llevar un toque personal/literario en la apertura (ver ejemplo RailTrack Manager) para no sonar a ficha corporativa seca. Incluir link a repo si es público.
2. **Recorrido de pantallas** *(cuando el proyecto tiene UI navegable)* — no es una galería suelta: cada captura va precedida de un párrafo breve explicando qué se ve y, si aplica, qué hace falta para llegar ahí (ej. levantar un servicio externo, crear un usuario). Ver ejemplo RailTrack Manager en 5.4. Nada de grid 2x2 ni carrusel — es un recorrido guiado, texto + imagen intercalados.
3. **Arquitectura** *(cuando aporte)* — diagrama de componentes y flujo (generado con Eraser u otra herramienta), colocado antes de la tabla de stack: primero la vista de pájaro, luego el detalle capa por capa.
4. **Stack** — tabla Capa / Tecnología.
5. **Qué hice yo** — bullets concretos, primera persona, verbos de acción.
6. **Reto técnico** — el obstáculo real, no genérico.
7. **Resultado / aprendizaje** — qué se consiguió y qué se aprendió.

No todos los proyectos necesitan las 7 secciones (ej. un proyecto sin UI navegable no lleva "recorrido de pantallas"). La plantilla se adapta; el orden relativo entre las secciones presentes se mantiene.

**Imágenes clicables (lightbox):** todas las imágenes de "Recorrido de pantallas" y "Arquitectura" abren en un lightbox a tamaño real al hacer clic (fondo oscuro, cierre con la X, clic fuera de la imagen o tecla Escape). Se activa automáticamente por convención de clases: cualquier `<img>` dentro de `.screen-walkthrough-item` o `.architecture-block` queda clicable sin marcado ni JS adicional por página — solo hace falta incluir `<script src="../js/lightbox.js"></script>` en la página (después de `translations.js` y `main.js`, ver `portfolio/railtrack-manager.html`). El texto del botón de cierre usa `data-i18n-aria-label` (clave `lightbox_close`, ya traducida DE/EN en `js/translations.js`), siguiendo el mismo mecanismo que `data-i18n-alt` para los `alt` de imagen.

### 5.3 Selección de proyectos (curada, no exhaustiva)

Basado en investigación de mejores prácticas 2026: 3-6 proyectos curados superan a listas largas — los reclutadores escanean ~8 segundos y priorizan evidencia verificable (repo/demo) sobre volumen. Portfolio final, por orden de fuerza de evidencia:

1. **RailTrack Manager** — proyecto propio, repo público, capturas. Máxima evidencia verificable.
2. **Spicy** (spicy-kunstraum.ch) — caso real: herramienta de feedback para galería de arte, cliente real, en uso.
3. **Bambera** — no es un prototipo: está en producción real en Lumis. Caso más fuerte de "IA aplicada de verdad".
4. **mini-midoffice** — repo propio, migración Spring 5→6 documentada y tageada en Git (preparado en contexto Umbrella AG).
5. *(Opcional, añadir solo si hay tiempo/valor)* Fandango — complementa a Bambera. SBB/TIP2 — sin repo propio, mejor tratado como post de blog (reflexión de arquitectura) que como ficha de portfolio.

**No incluir en portfolio profesional:** Iledysile (web personal para su pareja) — proyecto real pero de naturaleza distinta (regalo personal, no caso de estudio técnico). 

### 5.4 RailTrack Manager — copy definitivo

Texto cerrado y aprobado por Javi. **Está en español: es el borrador fuente.** Debe traducirse a DE/EN con sus claves `data-i18n` al maquetarse (ver 3.1).

Repo: https://github.com/carranza-javier/railtrack-manager

---

**Stack**

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21, Angular Material, standalone components |
| Backend | Spring Boot 3.5, Java 21 |
| Sicherheit | Spring Security + JWT |
| Secrets | HashiCorp Vault |
| Persistencia | H2 en memoria (desarrollo) |

**Was ich gemacht habe / Qué hice yo**

- Diseñé e implementé la API REST completa (CRUD de tramos de vía e incidencias) con Spring Boot y Spring Data JPA.
- Implementé autenticación JWT con soporte de roles desde cero.
- Construí el frontend en Angular 21 con standalone components y Angular Material — mi primer proyecto serio de frontend, viniendo de un perfil backend puro.
- Diseñé el modelo de datos y lo poblé con datos del dominio ferroviario suizo para que la demo reflejara un caso de uso real.

**Herausforderung / Reto técnico**

> Venía de un perfil 100% backend. El reto no fue la API —terreno conocido— sino subir la curva de Angular y Angular Material lo suficiente como para construir un frontend coherente: standalone components, servicios HTTP reactivos, guards de autenticación y componentes de Material bien integrados con el flujo de la app.

**Ergebnis / Resultado y aprendizaje**

> Aplicación full-stack funcional de extremo a extremo (auth JWT, CRUD, roles) que demuestra capacidad real de frontend más allá del backend, y que sirve como plantilla reutilizable para futuros proyectos rápidos Angular + Spring Boot.

**Screenshots / Recorrido de pantallas**

Ubicación de las imágenes: repo de la web (no el de railtrack-manager), en `portfolio/img/railtrack-manager/` 

Estructura: párrafo breve + imagen, en este orden. Contenido (borrador en español, traducir a DE/EN):

> **Antes de entrar**
> La aplicación usa [HashiCorp Vault](https://www.vaultproject.io/) para la gestión de secretos, así que antes de levantar el backend hace falta tener un servidor de Vault en marcha. Con Vault listo, se arranca el backend y después el frontend. Para entrar no hay usuarios sembrados por defecto: primero hay que crear uno a través de la API, y con esas credenciales se accede a la pantalla de login.
>
> *[rtm-login.png]*
>
> **Track Segments**
> El panel de Track Segments es el corazón de la aplicación: aquí se gestionan los tramos de la red, con su línea, tipo, estado operativo y última fecha de mantenimiento. Los datos están sembrados con tramos reales de la red suiza — Bern–Olten, Lausanne–Yverdon y el depósito de Zúrich.
>
> *[rtm-tracks.png]*
>
> **Incidents**
> La sección de Incidents recoge las incidencias reportadas sobre cada tramo, desde fallos de señalización hasta desviaciones de geometría de vía, con su severidad y estado de resolución.
>
> *[rtm-incidents.png]*
>
> **Dashboard**
> El Dashboard da una vista general del estado de la red: número de tramos, incidencias totales y abiertas, tramos en mantenimiento, y un desglose por severidad y estado. Es la pantalla pensada para una lectura rápida de la salud del sistema.
>
> *[rtm-dashboard.png]*

**Arquitectura**

Diagrama generado con Eraser (`rtm-architecture.png`, en `portfolio/img/railtrack/`): Browser → Frontend (Angular, puerto 4200) → Backend (Spring Boot, puerto 8080, JWT) → Vault (secretos, leídos al arrancar) y H2 (JPA). Flujo: Vault arranca antes que el backend → login emite JWT → JWT viaja en Authorization header en las siguientes peticiones → Spring Security lo valida antes de procesar CRUD de tracks/incidents.

---

Usar esta ficha como plantilla visual y estructural para las siguientes.

## 6. Blog

### 6.1 `blog.html` (índice)

- Listado cronológico (más reciente primero) de posts, **con filtro por tags** (botones simples, JS vanilla, sin rutas nuevas: `Todos | KI | Observabilidad | Java & Arquitectura | Exploración`).
- Cada entrada: título, fecha, resumen corto, 1-2 tags.
- Sin restricción de longitud ni estructura fija por post — a diferencia del portfolio, aquí el formato es libre.
- **Decisión de fondo:** no crear secciones de sitio separadas por tema (KI, BioInformática, Observabilidad, Buenas prácticas como páginas independientes). Son *tags dentro de un único blog*, no arquitectura de sitio nueva. Motivo: escritura irregular por tema haría que secciones separadas se vean vacías la mayoría del tiempo; un blog único con tags se ve activo siempre.

### 6.2 Tags iniciales y temas con sustancia real (para no partir de cero)

- **Observabilidad** — plan de estudio Dynatrace (15h), curso OpenTelemetry (Vinoth Selvaraj), preparación entrevista AXA. Contenido ya vivido, no teórico.
- **Java & Arquitectura** — Canary migration en Mango (AWS EKS), migración monolito↔microservicios (Amadeus, y lo aprendido sobre TIP2 en SBB), Terraform self-service para 25 equipos.
- **KI** — decisiones concretas detrás de Bambera/Fandango (ej. routing contextual vs. RAG puro, debugging de alucinaciones).
- **BioInformática/IA** - Opinión personal tras leer libro The Code Breaker
- **Exploración** — temas nuevos sin proyecto propio detrás todavía, ej. BioInformática/IA en biomedicina. Tratar como exploración honesta ("esto me interesa y esto estoy leyendo"), no prometer una categoría consolidada que aún no existe.

### 6.2 Posts individuales (`blog/*.html`)

- Voz personal, primera persona, sin ficha obligatoria.
- Pueden documentar: debugging concreto, aprendizaje de un concepto, reflexión sobre una herramienta, proceso detrás de un proyecto del portfolio.
- Mismo layout base (header/footer, tipografía, colores) que el resto del sitio, pero con más libertad de formato en el cuerpo (código, citas, imágenes intercaladas).

## 7. Chatbot del sitio (widget flotante)

### 7.1 Qué es

Un chatbot público en kettenki.com que responde sobre KettenKI y sus servicios. **No es una pieza nueva: es Liviana desplegada en el propio sitio.** Liviana ya se define en `services.html` como chatbot de atención al cliente 24/7 — desplegarla aquí la convierte simultáneamente en producto en venta y en demo en vivo. El visitante que pregunta "¿qué hace Bambera?" está usando Liviana y viéndola funcionar al mismo tiempo.

Esto lo hace también la pieza de portfolio más fuerte del sitio: no es una captura ni un repo, es evidencia interactiva en la misma visita.

### 7.2 Ubicación y presentación

- **Widget flotante**, presente en todas las páginas del sitio.
- Avatar: **el gato** (mascota ya existente en la identidad de KettenKI). Da personalidad y coherencia de marca, evita que parezca un chat de soporte genérico.
- Estados a maquetar: cerrado (burbuja), abierto, escribiendo/cargando, error, sin conexión.

### 7.3 Alcance de conocimiento (acotado a propósito)

**Debe responder sobre:**
- Qué es KettenKI y su filosofía ("prueba antes de comprar", prototipos sin SLA, co-financiamiento al escalar).
- Los 3 productos: Bambera, Liviana, Fandango.
- Cómo contactar (email, LinkedIn).
- El portfolio, una vez exista.

**NO debe responder sobre:**
- Información personal de Javi: búsqueda de empleo, CV, entrevistas, disponibilidad laboral.
- Razón: el chatbot habla **como KettenKI (empresa)**, no como Javier candidato. Mezclarlo rompería el posicionamiento comercial que el sitio ya cuida deliberadamente (JSON-LD, `ProfessionalService`, disclaimers de prototipo).

### 7.4 Arquitectura

Reusar el patrón ya existente de Bambera: **AWS Bedrock + Lambda**, invocado desde JS vanilla en el frontend estático. Sin frameworks, coherente con el resto del sitio.

Diferencias importantes respecto a Bambera (que corre en Lumis con acceso controlado): este chatbot es **público y sin login**, lo que exige:

- **Rate limiting** vía API Gateway throttling — protección de costes frente a abuso.
- **System prompt estrictamente acotado** al alcance de 7.3, para evitar alucinaciones fuera de tema o que responda como si fuera Javi.
- **Sin RAG ni vector DB.** El contenido fuente (about, services, portfolio) cabe entero en el prompt. Añadir infraestructura de recuperación aquí sería sobreingeniería.

### 7.5 Desarrollo local y entorno de test

- **Sitio estático**: no necesita entorno de test. `python -m http.server` en la raíz del repo → `localhost:8000`. No hay build system.
- **Chatbot**: no montar un stage de test en AWS (sobreingeniería y coste innecesario para un proyecto de una persona). En su lugar:
  - Implementar un **mock local** (`assets/js/chat-mock.js`) que devuelva respuestas fijas.
  - Activarlo con un flag: detección de `localhost` o query param `?mock=true`.
  - Permite maquetar toda la UI del widget (estados, scroll, avatar, errores) sin gastar una sola invocación de Bedrock.
  - Conectar el endpoint real solo cuando la UI esté terminada.
- **Todo el trabajo inicial se hace en local.** Nada se despliega a producción hasta que Javi lo decida explícitamente.

## 8. Pendiente / próximos pasos

- [ ] Maquetar `portfolio.html` (índice) con grid vacío o placeholder inicial.
- [ ] Maquetar `portfolio/railtrack-manager.html` con el contenido ya redactado (sección 5.3).
- [ ] Añadir capturas de RailTrack Manager (login, listado de tramos, formulario de incidencia, dashboard).
- [ ] Añadir enlace desde `about.html` hacia `/portfolio/`.
- [ ] Definir y maquetar `blog.html` (índice) — vacío hasta tener el primer post.
- [ ] Redactar y maquetar primer post de blog (candidato: Bambera — fix de alucinación vía routing contextual).
- [ ] Redactar fichas restantes de portfolio: Spicy, Bambera, mini-midoffice (ver 5.3 para la selección curada).
- [ ] Chatbot: maquetar widget flotante con avatar del gato + `chat-mock.js` (sin backend).
- [ ] Chatbot: definir system prompt acotado según 7.3.
- [ ] Chatbot: conectar Lambda + Bedrock con rate limiting, solo cuando la UI esté cerrada en local.