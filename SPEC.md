# KettenKI — Portfolio & Blog — SPEC

## 1. Propósito

`kettenki.com` es el sitio comercial de KettenKI (prototipos de IA: Bambera, Liviana, Fandango). Este spec cubre la ampliación del sitio con dos secciones nuevas, **sin alterar el posicionamiento comercial de la home**:

- **Portfolio** — casos de estudio de ingeniería (proyectos propios y experiencia profesional). Contenido atemporal, ficha fija.
- **Blog** — artículos personales, cronológicos, sobre lo que Javi aprende/construye/piensa. Sin ficha fija, voz personal.

**Diferencia conceptual:** portfolio = "esto hice y funcionó" (qué). Blog = "esto pensé/aprendí/debuggeé" (proceso). Un mismo proyecto (ej. Bambera) puede tener ficha de portfolio y varios posts de blog sobre él, no es contenido duplicado, es ángulo distinto.

## 2. Decisión de arquitectura de información

- Sin subdominio. Ambas secciones viven en subcarpetas del mismo repo/dominio: `kettenki.com/portfolio/` y `kettenki.com/blog/`.
- **Menú propio en Portfolio/Blog, distinto del menú comercial.** El header (logo, estilo, posición) se mantiene igual en todo el sitio, pero el contenido del menú cambia según el contexto:
  - Resto del sitio (`index.html`, `about.html`, `services.html`, `contact.html`): `Home | About | Services | Contact`.
  - Portfolio/Blog (`portfolio/*`, `blog/*`): `Portfolio | Blog | Contact`.
  - El logo, en ambos casos, enlaza siempre a `index.html` (vuelta a la marca comercial).
  - `Contact` aparece en los dos menús porque es universal.
  - Motivo: evita la incoherencia de mostrar "Services" (mensaje comercial) dentro de una ficha técnica de portfolio, y da a Portfolio/Blog una navegación autosuficiente entre sí, sin depender solo del enlace desde `about.html` como único punto de entrada.
- **Subtítulo bajo el logo, solo en Portfolio/Blog:** "Javier Carranza" debajo de "KettenKI", mismo color que el logo (verde/acento de marca), tamaño menor (~1rem frente a ~1.5rem del logo). No aparece en el resto del sitio (header comercial se queda solo con el logo). Refuerza que en Portfolio/Blog el foco es la persona, no la marca comercial.
- Se sigue enlazando a Portfolio **también** desde `about.html` (callout al final), como refuerzo, no como único acceso.
- Razón de fondo: separar audiencias (cliente de negocio vs. reclutador/curioso técnico) sin fragmentar dominio, SEO ni mantenimiento.

## 3. Restricciones técnicas

- **Sin frameworks ni generadores** (no Jekyll, no build system). HTML + CSS + JS vanilla, igual que el resto del sitio.
- Reusar el CSS existente de `services.html` (estética oscura, degradado azul eléctrico a verde esmeralda, badges) como base visual estructural para tarjetas de portfolio y blog (tipografía, spacing, grid, badges); el color de fondo cambia según 3.2.
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

- **Header/nav**: se mantiene igual en todo el sitio (oscuro, mismo logo, mismo componente). Es la constante de identidad, el visitante siempre sabe que sigue en kettenki.com.
- **Cuerpo de página**: oscuro en el sitio comercial (como está ahora), **blanco** en `portfolio/`, `portfolio/*.html` y `blog/`, `blog/*.html`.
- **Motivo:** refuerza a nivel visual la separación de audiencias ya decidida en la sección 2, entrar en Portfolio/Blog debe sentirse como pasar del espacio de marca (KettenKI, prototipos comerciales) al espacio personal de Javi (trayectoria, blog), sin dejar de ser el mismo sitio.

**Implementación técnica sugerida:**
- Nueva hoja de estilos `css/portfolio-blog.css` (o clase de tema `theme-light` en `<body>`) que sobrescribe únicamente las variables de color relevantes (fondo, texto, superficies de tarjeta), reutilizando el resto del sistema existente sin duplicarlo.
- No crear un segundo sistema de diseño desde cero, es un cambio de paleta sobre la misma base, no una reconstrucción.
- Los componentes que ya existen (badges de stack, tabla de stack, callout box) deben verse bien en ambos temas; ajustar solo contraste/color, no estructura.

**Tipografía — solo Portfolio/Blog:**
- Fuente: **Inter** (Google Fonts / self-hosted, SIL Open Font License, libre para uso comercial). Variable font, mismo patrón técnico que Zalando Sans Expanded en el resto del sitio.
- Pila: `font-family: 'Inter', 'Helvetica Neue', Roboto, Arial, sans-serif;`
- **No usar Amazon Ember**, es tipografía propietaria de Amazon/Dalton Maag, sin licencia disponible para terceros.
- El resto del sitio (`index.html`, `about.html`, `services.html`, `contact.html`) mantiene Zalando Sans Expanded sin cambios.
- El header/nav se mantiene con Zalando Sans Expanded en todo el sitio (constante de identidad, igual que en 3.2); Inter aplica solo al cuerpo de página en Portfolio/Blog.

Esta decisión aplica retroactivamente a todo lo ya maquetado de RailTrack Manager y Spicy Feedback Tool.

## 4. Estructura de archivos

Los índices son `index.html` **dentro** de su carpeta, no archivos sueltos en la raíz. Así `kettenki.com/portfolio/` resuelve sin `.html` y sin 404, convención estándar en sitios estáticos, y coherente con las URLs canónicas usadas en este SPEC.

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
│   ├── spicy-feedback-tool.html
│   ├── bambera.html
│   └── mini-midoffice.html
└── blog/
    ├── index.html           ← índice del blog (listado + filtro por tags)
    └── biomedicina-ai.html
```

URLs resultantes: `/portfolio/`, `/portfolio/railtrack-manager.html`, `/blog/`.

## 5. Portfolio

### 5.1 `portfolio/index.html` (índice)

- Intro breve (2-3 líneas): qué va a encontrar el visitante, trabajo real como ingeniero backend/full-stack, más allá de los prototipos de IA de Services.
- Grid de tarjetas. Cada tarjeta:
  - Thumbnail (captura del proyecto)
  - Título
  - Una línea de resumen/gancho (no el contexto completo)
  - 3-4 badges de stack (mismo estilo visual que badges de tecnología en `services.html`)
  - Badges de tipo, en dos ejes independientes (no una escala única):
    - **Eje 1, Propiedad** (siempre uno de los dos): 🎓 **Eigenes Projekt** vs. 🤝 **Kundenprojekt** (encargo de cliente).
    - **Eje 2, Estado** (opcional, solo si aplica): 🚀 **In Produktion**.
    - Ejemplo: RailTrack Manager → solo Eigenes Projekt. Spicy Feedback Tool → Kundenprojekt + In Produktion (los dos a la vez).
    - Colores: Eigenes Projekt en verde, Kundenprojekt en azul, In Produktion en verde/esmeralda (distinto del verde de Eigenes Projekt, para que no se confundan si coinciden en la misma tarjeta).
  - Link a la ficha completa
- Orden: por relevancia/fuerza de evidencia, no cronológico. Proyectos con repo público y capturas primero.
- La raíz **no** lleva contenido de ficha (nada de reto técnico, resultado, etc.), es índice visual, no resumen ejecutivo.

### 5.1.1 Foto de perfil con efecto morph (solo en portfolio/index.html)

Debajo del título "Portfolio", círculo de ~150px con la foto de Javi. Comportamiento tipo interruptor (no un simple hover que revierte):

- **Estado inicial:** foto normal (`profile-photo.jpg`), quieta.
- **Al pasar el ratón (estado = foto):** reproduce `profile-forward.mp4` completo, sin interrupción aunque el ratón salga antes de terminar. Al acabar, queda fijo en el frame final, imagen geométrica (`profile-geometric.jpg`), estado pasa a "geométrica".
- **Al pasar el ratón (estado = geométrica):** reproduce `profile-reverse.mp4` completo. Al acabar, queda fijo en `profile-photo.jpg`, estado vuelve a "foto".
- Un vídeo en marcha ignora el `mouseleave`: siempre termina el ciclo completo antes de aceptar la siguiente interacción.
- Recorte circular vía `clip-path: circle(50%)` en el contenedor (no `border-radius` sobre el propio vídeo, da un recorte más limpio con contenido de vídeo) + `overflow: hidden`. Vídeos sin controles, sin sonido (`muted`), `playsinline`.
- Sin borde decorativo en el contenedor (`.profile-morph`): un borde de 1px sobre el recorte circular con vídeo genera una línea visible en el borde, confirmado en sesión de depuración.
- Descubribilidad: pulso sutil en el borde los primeros ciclos tras cargar la página (se detiene solo, no es infinito) + texto de pista discreto debajo del círculo, que desaparece con fundido tras el primer hover y no vuelve a mostrarse en esa sesión.
- Assets en `portfolio/img/javier-carranza/` (imágenes) y `portfolio/vid/javier-carranza/` (vídeos): `profile-photo.jpg`, `profile-geometric.jpg` en la primera; `profile-forward.mp4`, `profile-reverse.mp4` en la segunda.

### 5.2 Ficha de proyecto (plantilla base, adaptable por proyecto)

Orden por defecto:

1. **Contexto**, por qué existe el proyecto. Puede llevar un toque personal/literario en la apertura para no sonar a ficha corporativa seca. Incluir link a repo si es público.
2. **Recorrido de pantallas** *(cuando el proyecto tiene UI navegable)*, no es una galería suelta: cada captura va precedida de un párrafo breve explicando qué se ve y, si aplica, qué hace falta para llegar ahí (ej. levantar un servicio externo, crear un usuario). Nada de grid 2x2 ni carrusel, es un recorrido guiado, texto + imagen intercalados. Selección curada (3-6 capturas relevantes), no exhaustiva: cada imagen debe aportar algo que las demás no dicen.
3. **Arquitectura** *(cuando aporte)*, diagrama de componentes y flujo (generado con Eraser u otra herramienta), colocado antes de la tabla de stack: primero la vista de pájaro, luego el detalle capa por capa.
4. **Stack**, tabla Capa / Tecnología.
5. **Qué hice yo**, bullets concretos, primera persona, verbos de acción.
6. **Reto técnico**, el obstáculo real, no genérico. Puede reconocer que el proyecto no fue técnicamente muy complejo, sin restarle mérito: el criterio de no sobreingenierizar es en sí mismo una habilidad a destacar.
7. **Resultado / aprendizaje**, qué se consiguió y qué se aprendió. Puede llevar un cierre con toque personal/humor si encaja con el proyecto (ver ejemplo Spicy Feedback Tool).

No todos los proyectos necesitan las 7 secciones (ej. un proyecto sin UI navegable no lleva "recorrido de pantallas"). La plantilla se adapta; el orden relativo entre las secciones presentes se mantiene.

**Imágenes clicables (lightbox):** todas las imágenes de "Recorrido de pantallas" y "Arquitectura" abren en un lightbox a tamaño real al hacer clic (fondo oscuro, cierre con la X, clic fuera de la imagen o tecla Escape). Se activa automáticamente por convención de clases: cualquier `<img>` dentro de `.screen-walkthrough-item` o `.architecture-block` queda clicable sin marcado ni JS adicional por página, solo hace falta incluir `<script src="../js/lightbox.js"></script>` en la página (después de `translations.js` y `main.js`, ver `portfolio/railtrack-manager.html`). El texto del botón de cierre usa `data-i18n-aria-label` (clave `lightbox_close`, ya traducida DE/EN en `js/translations.js`), siguiendo el mismo mecanismo que `data-i18n-alt` para los `alt` de imagen.

**Estilo de redacción, sin rayas largas:** no usar rayas largas "—" (em dash) en ningún texto de ficha, ni en español ni en las traducciones DE/EN. Usar puntos o comas en su lugar.

### 5.3 Selección de proyectos (curada, no exhaustiva)

Basado en investigación de mejores prácticas 2026: 3-6 proyectos curados superan a listas largas, los reclutadores escanean ~8 segundos y priorizan evidencia verificable (repo/demo) sobre volumen. Portfolio final, por orden de fuerza de evidencia:

1. **RailTrack Manager**, proyecto propio, repo público, capturas. Máxima evidencia verificable. ✅ Completado.
2. **Spicy Feedback Tool** (spicy-kunstraum.ch), caso real: herramienta de feedback para galería de arte (Kunstraum), cliente real, en producción. ✅ Completado.
3. **Bambera**, no es un prototipo: está en producción real en Lumis. Caso más fuerte de "IA aplicada de verdad". Pendiente.
4. **mini-midoffice**, repo propio, migración Spring 5→6 documentada y tageada en Git (preparado en contexto Umbrella AG). Pendiente.
5. *(Opcional, añadir solo si hay tiempo/valor)* Fandango, complementa a Bambera. SBB/TIP2, sin repo propio, mejor tratado como post de blog (reflexión de arquitectura) que como ficha de portfolio.

**No incluir en portfolio profesional:** Iledysile (web personal para su pareja), proyecto real pero de naturaleza distinta (regalo personal, no caso de estudio técnico).

## 6. Blog

### 6.1 `blog/index.html` (índice)

- Listado cronológico (más reciente primero) de posts, **con filtro por tags** (botones simples, JS vanilla, sin rutas nuevas: `Todos | KI | Observabilidad | Java & Arquitectura | Exploración`).
- Cada entrada: título, fecha, resumen corto, 1-2 tags.
- Sin restricción de longitud ni estructura fija por post, a diferencia del portfolio, aquí el formato es libre.
- **Decisión de fondo:** no crear secciones de sitio separadas por tema (KI, BioInformática, Observabilidad, Buenas prácticas como páginas independientes). Son *tags dentro de un único blog*, no arquitectura de sitio nueva. Motivo: escritura irregular por tema haría que secciones separadas se vean vacías la mayoría del tiempo; un blog único con tags se ve activo siempre.

### 6.2 Tags iniciales y temas con sustancia real (para no partir de cero)

- **Observabilidad**, plan de estudio Dynatrace (15h), curso OpenTelemetry (Vinoth Selvaraj), preparación entrevista AXA. Contenido ya vivido, no teórico.
- **Java & Arquitectura**, Canary migration en Mango (AWS EKS), migración monolito↔microservicios (Amadeus, y lo aprendido sobre TIP2 en SBB), Terraform self-service para 25 equipos.
- **KI**, decisiones concretas detrás de Bambera/Fandango (ej. routing contextual vs. RAG puro, debugging de alucinaciones).
- **BioInformática/IA**, opinión personal tras leer el libro *The Code Breaker*. Candidato a primer post de este tag.
- **Exploración**, temas nuevos sin proyecto propio detrás todavía. Tratar como exploración honesta ("esto me interesa y esto estoy leyendo"), no prometer una categoría consolidada que aún no existe.

### 6.3 Posts individuales (`blog/*.html`)

- Voz personal, primera persona, sin ficha obligatoria.
- Pueden documentar: debugging concreto, aprendizaje de un concepto, reflexión sobre una herramienta, proceso detrás de un proyecto del portfolio.
- Mismo layout base (header/footer, tipografía, colores) que el resto del sitio, pero con más libertad de formato en el cuerpo (código, citas, imágenes intercaladas).

## 7. Chatbot del sitio (widget flotante)

### 7.1 Qué es

Un chatbot público en kettenki.com que responde sobre KettenKI y sus servicios. **No es una pieza nueva: es Liviana desplegada en el propio sitio.** Liviana ya se define en `services.html` como chatbot de atención al cliente 24/7, desplegarla aquí la convierte simultáneamente en producto en venta y en demo en vivo. El visitante que pregunta "¿qué hace Bambera?" está usando Liviana y viéndola funcionar al mismo tiempo.

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

- **Rate limiting** vía API Gateway throttling, protección de costes frente a abuso.
- **System prompt estrictamente acotado** al alcance de 7.3, para evitar alucinaciones fuera de tema o que responda como si fuera Javi.
- **Sin RAG ni vector DB.** El contenido fuente (about, services, portfolio) cabe entero en el prompt. Añadir infraestructura de recuperación aquí sería sobreingeniería.
- **Modelo recomendado: Claude Haiku 4.5** en Bedrock (equilibrio calidad/coste para un alcance acotado). Alternativa aún más barata si el coste importa: Amazon Nova Micro.

### 7.5 Desarrollo local y entorno de test

- **Sitio estático**: no necesita entorno de test. `python -m http.server` en la raíz del repo → `localhost:8000`. No hay build system.
- **Chatbot**: no montar un stage de test en AWS (sobreingeniería y coste innecesario para un proyecto de una persona). En su lugar:
  - Implementar un **mock local** (`assets/js/chat-mock.js`) que devuelva respuestas fijas.
  - Activarlo con un flag: detección de `localhost` o query param `?mock=true`.
  - El mock debe simular también el recorte de historial de 7.6, para que el comportamiento en local sea fiel al de producción.
  - Permite maquetar toda la UI del widget (estados, scroll, avatar, errores) sin gastar una sola invocación de Bedrock.
  - Conectar el endpoint real solo cuando la UI esté terminada.
- **Todo el trabajo inicial se hace en local.** Nada se despliega a producción hasta que Javi lo decida explícitamente.

### 7.6 Memoria conversacional

A diferencia de Bambera (stateless: cada mensaje se manda a Bedrock sin historial), el chatbot del sitio **sí mantiene memoria dentro de la conversación**. Motivo: es la demo en vivo de Liviana, un chatbot de atención al cliente que no recuerde lo que se acaba de preguntar sería una mala demostración del propio producto.

- Bedrock no tiene memoria propia entre llamadas. La memoria se simula mandando el array de mensajes anterior completo + el nuevo en cada request.
- **Alcance de la memoria: solo dentro de la sesión del navegador.** Guardar el historial en memoria JS o `sessionStorage`, nunca de forma persistente entre visitas.
- **Límite de historial:** capar a los últimos 6-8 mensajes enviados a Bedrock. Motivo de coste: cada turno de conversación es más caro que el anterior porque arrastra todo el historial previo como input; sin límite, una conversación larga se encarece de forma creciente sin necesidad real.
- Al superar el límite, el historial más antiguo se descarta (FIFO); el bot sigue funcionando pero sin recordar el inicio de conversaciones muy largas.