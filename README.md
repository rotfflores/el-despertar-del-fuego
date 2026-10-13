# El archivo de lo que viene

Únicamente el hero de una invitación personal de graduación, en HTML, CSS y JavaScript sin dependencias de compilación.

## Personalizar

Edita el objeto `invitation` en `dist/invitation.js` para cambiar el nombre, carrera, generación, año, fotografía y destino del botón. La fotografía de Alex es una imagen provisional de una persona ficticia creada con la herramienta integrada de generación de imágenes.

Para reemplazarla, coloca tu fotografía en `dist/assets/` y actualiza `photo` y `photoAlt`. Los textos también están presentes en `dist/index.html` para que el hero siga completo sin JavaScript; actualízalos si cambias los datos. La fecha de portada usa únicamente el año ficticio de graduación: no presupone una fecha real del evento.

El botón y la indicación inferior enlazan con `#siguiente-seccion`. Sustituye el marcador al final del documento por tu siguiente sección conservando ese identificador. Por ahora, se desplaza hasta el final del hero y no se incluye ninguna sección adicional.

Las animaciones respetan `prefers-reduced-motion`; sin JavaScript todos los textos, enlaces y la fotografía siguen disponibles. Las fuentes de Google tienen alternativas serif y sans serif del sistema.

## Vista local

Ejecuta `node preview.mjs` y visita http://127.0.0.1:4174. Puedes elegir otro puerto con `node preview.mjs 4180`. Los archivos publicables están en `dist/`.

## Imagen provisional

Modo: herramienta integrada `image_gen` (habilidad `imagegen`). Archivo: `dist/assets/alex-morgan-provisional.png`.

Prompt usado:

> Use case: photorealistic-natural. Asset type: replaceable portrait photograph for a personal graduation invitation editorial website. Create a natural fine-art editorial photograph, vertical 4:5 composition, one fictional young adult male architecture graduate age 24, warm medium skin, curly dark hair, subtle happy proud smile looking into camera, black graduation robe worn over white open-collar shirt and holding a single black mortarboard casually at his side. Waist-up to hips portrait, subject centered, no head cropping and generous margin above head. Background: softly blurred modern university concrete architecture with warm cream pillars, trees. Late afternoon soft sunlight, sophisticated muted cream and olive colors, realistic skin and fabric texture, candid analog film feeling and gentle photographic grain. Graduation must be immediately understandable. No text, no badges, no watermark, no frame, no other people. This is only the photograph, not a website mockup.
