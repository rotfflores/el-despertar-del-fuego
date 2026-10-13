# El archivo de lo que viene

Invitación personal de graduación, en HTML, CSS y JavaScript sin dependencias de compilación. Incluye portada, recuerdos, el pase a la celebración y una galería fotográfica.

## Personalizar

Edita el objeto `invitation` en `dist/invitation.js` para cambiar el nombre, carrera, generación, año, fotografía y destino del botón. La fotografía de Alex es una imagen provisional de una persona ficticia creada con la herramienta integrada de generación de imágenes.

Para reemplazarla, coloca tu fotografía en `dist/assets/` y actualiza `photo` y `photoAlt`. Los textos también están presentes en `dist/index.html` para que el hero siga completo sin JavaScript; actualízalos si cambias los datos. La fecha de portada usa únicamente el año ficticio de graduación: no presupone una fecha real del evento.

El botón y la indicación inferior del hero enlazan con `#siguiente-seccion`, que es la segunda sección.

Las animaciones respetan `prefers-reduced-motion`; sin JavaScript todos los textos, enlaces y la fotografía siguen disponibles. Las fuentes de Google tienen alternativas serif y sans serif del sistema.

## Segunda sección: Lo que no sale en el diploma

Tres fichas que se abren y cierran con un botón (pueden estar varias abiertas). Sus textos y fotografías se editan en el objeto `memories` de `dist/invitation.js`; los textos también están en `dist/index.html` para que la sección se lea completa sin JavaScript (sin JavaScript las fichas aparecen abiertas). Mientras `photo` esté vacío, la ficha muestra un recuadro de «Fotografía pendiente» con la descripción de la foto que va ahí. Para usar una foto, colócala en `dist/assets/` y escribe su ruta en `photo` y su descripción en `photoAlt`.

Fotografías provisionales de las fichas (Unsplash, licencia libre), en `dist/assets/recuerdos/`: 01, un estudiante cortando espuma para una maqueta en el taller; 02 de Vitaly Gariev (https://unsplash.com/photos/TB5HpfJf7mA) y 03 de Josiah Holdcroft (https://unsplash.com/photos/KiwbzBuiIX0). Sustitúyelas por fotos reales del graduado cambiando `photo` y `photoAlt`.

El enlace «Vamos a celebrar →» lleva al capítulo 03, `#detalles-del-evento`.

## Tercera sección: El siguiente capítulo empieza con una fiesta

Edita los datos ficticios del evento en `dist/event-config.mjs`: nombre, graduado, fecha, recepción, cena, fin provisional, lugar, ciudad, dirección, vestimenta y `locationUrl`. El recinto de ejemplo es el jardín de eventos del Centro de Convenciones Holiday Inn Durango; la [dirección está publicada por el propio recinto](https://www.centrodeconvencioneshinndgo.com/index.html), pero esta invitación **no implica una reserva**. La URL apunta al mapa de esa ubicación. Sustituye el lugar y el enlace antes de compartir una invitación real. Mientras `locationUrl` esté vacío, «Ubicación próximamente» queda desactivado; al configurar una URL HTTP o HTTPS aparece «Cómo llegar».

El contador calcula el tiempo hasta el 19 de diciembre de 2026 a las 19:00 en `America/Mexico_City`, independientemente de la zona del visitante. Al llegar a la fecha muestra «Llegó el día. ¡Vamos a celebrar!». El archivo de calendario incluye el inicio a las 19:00 y el fin provisional a las 23:00, equivalentes a 01:00 y 05:00 UTC del 20 de diciembre. Las fechas UTC del .ics son inequívocas y `X-WR-TIMEZONE` declara la zona de México.

«Guardar la fecha» genera el .ics a partir de la configuración. También existe `dist/assets/graduacion-alex-morgan.ics` como descarga sin JavaScript. Si personalizas la configuración, actualiza los textos de respaldo en `dist/index.html` y regenera esa descarga con `node tools/generar-calendario.mjs`.

La entrada muestra todos los datos directamente. El talón está a la derecha en escritorio y debajo en celular. La aparición usa IntersectionObserver y respeta movimiento reducido; la información es visible aun sin animaciones o JavaScript.

## Cuarta sección: Antes de esta foto, hubo muchas otras

Las seis etapas, pies de foto, rutas, proporciones y descripciones alternativas están en `dist/gallery-config.mjs`. Sustituye las fotografías provisionales de `dist/assets/archivo/` o cambia sus rutas en esa configuración. El texto inicial también está en `dist/index.html` como respaldo para que la sección conserve su contenido sin JavaScript. Si editas las etapas y los pies, actualiza ese respaldo.

La tira de negativos se desliza con el dedo o con el desplazamiento horizontal, se detiene en cada foto y ofrece botones para avanzar. El indicador y la anotación final se actualizan según la posición. Al tocar una imagen se abre un visor con controles de teclado, Escape para cerrar y retorno de foco a la foto elegida. Se respeta `prefers-reduced-motion` y no hay reproducción automática.

Al llegar a la sección, el titular sube línea por línea, la línea naranja de la introducción se dibuja y la tira de negativos entra desde la derecha mientras sus perforaciones avanzan como película. Cada foto se «revela»: pasa de un tono lavado y desenfocado a su color real, una tras otra. Cada fotograma tiene su código de borde (▸ 01A, 02A…) y las fotos llenan el cuadro sin franjas negras. En escritorio la tira también se puede arrastrar con el mouse. La barra naranja junto a «01 / 06» muestra el avance, la anotación final aparece con un trazo cuando llegas a la última foto, y el visor se abre y cambia de foto con transiciones suaves.

Las seis fotografías se generaron con la herramienta integrada `image_gen`, tomando como referencia el retrato provisional de Alex. Indicaciones visuales: **01**, Alex con planos frente a la facultad el primer día; **02**, Alex con su equipo sobre planos y maquetas; **03**, Alex con amistades fuera del aula entre semestres; **04**, construcción de una gran maqueta sobre una mesa de taller; **05**, abrazo después de la última entrega; **06**, Alex con toga y birrete al graduarse. En todos los casos se pidió fotografía editorial natural, luz y grano suaves, sin texto ni marcas, manteniendo coherencia visual con el retrato de referencia. Son imágenes ficticias y reemplazables.

## Quinta sección: Para mi siguiente versión

La carta se configura en `dist/letter-config.mjs`: nombre del graduado, textos, tres tipos de mensaje, sugerencias y `whatsappNumber`. El número está vacío de forma deliberada y el botón muestra «Envío disponible próximamente». Para habilitarlo, coloca **un número real** con código de país en `whatsappNumber`; se aceptan dígitos y separadores habituales, y se construye una URL `https://wa.me/` solo con los dígitos. No hay número ficticio ni almacenamiento de mensajes en el sitio.

El nombre y el mensaje son obligatorios, con límites de 60 y 600 caracteres. La sugerencia aparece fuera del campo y nunca se añade automáticamente. El envío valida los dos campos y abre WhatsApp con el texto codificado; el invitado completa allí el envío. La carta conserva lo escrito y no muestra una confirmación de recepción. Los textos base están también en `dist/index.html` como respaldo sin JavaScript; actualiza ese respaldo si cambias la configuración.

## Sexta sección: Tu lugar en esta historia

Configura `dist/rsvp-config.mjs` antes de compartir la invitación: `graduateName`, `whatsappNumber`, `maxGuests` (lugares asignados a este invitado), `deadlineDate` en formato `AAAA-MM-DD`, `timeZone` y los textos de la sección. El número está vacío y «Confirmaciones disponibles próximamente» permanece desactivado hasta que se añada un destino real de WhatsApp. La cantidad inicial es una persona y el selector solo aparece cuando la respuesta es afirmativa.

El nombre y la respuesta son obligatorios; la nota es opcional. El formulario limita nombre y nota a 60 y 300 caracteres, respectivamente, y muestra errores junto a los controles. Tras validar, prepara el texto correspondiente en una URL de WhatsApp codificada. Abrir WhatsApp no confirma ni registra la asistencia: el invitado debe enviar el mensaje allí. La nota de plazo cambia después del último día configurado, según `America/Mexico_City`. Los textos base también están en `dist/index.html` como respaldo sin JavaScript.

Al llegar a la sección, el título sube línea por línea, el sobre verde se abre y deja asomar la carta, y después caen la estampilla y el matasellos; la hoja entra con sus campos en cascada y el sello de goma se marca al final. Al elegir un tipo de mensaje, la marca naranja se desliza a la opción y la sugerencia se escribe; al poner el nombre, el «De:» se subraya como una firma. El sobre es decorativo (`aria-hidden`) y con movimiento reducido todo aparece ya en su estado final.

## Fondo y animaciones

El fondo es `dist/assets/fondo-graduacion.png` (papel gis con esquinas verde profundo y naranja tostado, birrete y diploma). Para que funcione en cualquier tamaño de pantalla sin recortar los adornos, se separa en capas dentro de `dist/assets/fondo/`: la textura de papel se repite como fondo, cada esquina se coloca en su rincón y el birrete va aparte para poder animarlo. Si cambias la imagen, vuelve a generar las capas con `python tools/preparar-fondo.py` (requiere Pillow y NumPy).

La paleta de `styles.css` sale del mismo fondo (`--green`, `--orange`, `--paper`). La variable `--s` controla el tamaño de los adornos en cada pantalla.

Secuencia de entrada: las esquinas se despliegan desde los bordes, el titular sube línea por línea, la fotografía se descubre de abajo hacia arriba con su marco y bloques de color, cae el birrete (que luego se mece y sigue al cursor) y el sello «Sí, lo logré.» se estampa. El botón principal lanza confeti con los colores del fondo antes de desplazarse a la siguiente sección.

## Vista local

Ejecuta `node preview.mjs` y visita http://127.0.0.1:4174. Puedes elegir otro puerto con `node preview.mjs 4180`. Los archivos publicables están en `dist/`.

## Imagen provisional

Modo: herramienta integrada `image_gen` (habilidad `imagegen`). Archivo: `dist/assets/alex-morgan-provisional.png`.

Prompt usado:

> Use case: photorealistic-natural. Asset type: replaceable portrait photograph for a personal graduation invitation editorial website. Create a natural fine-art editorial photograph, vertical 4:5 composition, one fictional young adult male architecture graduate age 24, warm medium skin, curly dark hair, subtle happy proud smile looking into camera, black graduation robe worn over white open-collar shirt and holding a single black mortarboard casually at his side. Waist-up to hips portrait, subject centered, no head cropping and generous margin above head. Background: softly blurred modern university concrete architecture with warm cream pillars, trees. Late afternoon soft sunlight, sophisticated muted cream and olive colors, realistic skin and fabric texture, candid analog film feeling and gentle photographic grain. Graduation must be immediately understandable. No text, no badges, no watermark, no frame, no other people. This is only the photograph, not a website mockup.
