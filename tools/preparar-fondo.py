"""Separa el fondo de graduación en capas para que se adapte a cualquier pantalla.

Uso: python tools/preparar-fondo.py   (requiere Pillow y NumPy)
Lee dist/assets/fondo-graduacion.png y escribe en dist/assets/fondo/:
  papel.jpg          textura de papel sin adornos, repetible sin costuras
  esquina-*.png      cada esquina del fondo, con bordes interiores difuminados
  birrete.png        el birrete recortado para animarlo por separado
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter
import numpy as np

raiz = Path(__file__).resolve().parent.parent / 'dist' / 'assets'
salida = raiz / 'fondo'
salida.mkdir(exist_ok=True)
fondo = Image.open(raiz / 'fondo-graduacion.png').convert('RGB')
W, H = fondo.size

# Papel: zona central limpia, reflejada para que se repita sin costuras.
centro = fondo.crop((150, 560, 790, 1100))
w, h = centro.size
mosaico = Image.new('RGB', (w * 2, h * 2))
mosaico.paste(centro, (0, 0))
mosaico.paste(ImageOps.mirror(centro), (w, 0))
mosaico.paste(ImageOps.flip(centro), (0, h))
mosaico.paste(ImageOps.flip(ImageOps.mirror(centro)), (w, h))
mosaico.save(salida / 'papel.jpg', quality=84, optimize=True)
papel = np.array(centro, dtype=np.float32).reshape(-1, 3).mean(0)
textura = np.array(mosaico, dtype=np.float32)

# Birrete: solo lo más oscuro que el papel se vuelve visible (sin halos claros).
caja_birrete = (700, 72, 914, 234)
reg = np.array(fondo.crop(caja_birrete), dtype=np.float32)
crudo = np.max(np.clip(papel - reg, 0, None) / papel, axis=2)
alfa = np.clip((crudo - 0.06) / 0.94, 0, 1)
seguro = np.maximum(alfa, 1e-3)[..., None]
rgb = np.clip(papel - (papel - reg) / seguro, 0, 255)
Image.fromarray(np.dstack([rgb, alfa * 255]).astype(np.uint8), 'RGBA').save(salida / 'birrete.png', optimize=True)
# Hueco donde estaba el birrete, rellenado con papel.
hueco = Image.fromarray(((crudo > 0.035) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(5))
hueco = np.array(hueco, dtype=np.float32)[..., None] / 255
x0, y0, x1, y1 = caja_birrete
limpio = np.array(fondo, dtype=np.float32)
parche = textura[:y1 - y0, :x1 - x0]
limpio[y0:y1, x0:x1] = limpio[y0:y1, x0:x1] * (1 - hueco) + parche * hueco
limpio = Image.fromarray(limpio.astype(np.uint8))


def suave(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


esquinas = {  # caja y qué bordes tocan el borde de la pantalla
    'superior-izquierda': ((0, 0, 330, 520), 'arriba izquierda'),
    'superior-derecha': ((620, 0, W, 610), 'arriba derecha'),
    'inferior-izquierda': ((0, 1085, 290, H), 'abajo izquierda'),
    'inferior-derecha': ((610, 1220, W, H), 'abajo derecha'),
}
fundido = 44
for nombre, (caja, pegado) in esquinas.items():
    reg = np.array(limpio.crop(caja), dtype=np.float32)
    h, w = reg.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.ones((h, w), np.float32)
    if 'arriba' in pegado: a *= suave((h - 1 - yy) / fundido)
    else: a *= suave(yy / fundido)
    if 'izquierda' in pegado: a *= suave((w - 1 - xx) / fundido)
    else: a *= suave(xx / fundido)
    Image.fromarray(np.dstack([reg, a * 255]).astype(np.uint8), 'RGBA').save(salida / f'esquina-{nombre}.png', optimize=True)
    print(nombre, w, 'x', h)
print('papel promedio #%02X%02X%02X' % tuple(int(v) for v in papel))
