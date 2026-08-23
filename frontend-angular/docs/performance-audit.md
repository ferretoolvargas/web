# Auditoría de rendimiento y accesibilidad

Fecha: 23 de agosto de 2026  
URL: `https://ferretoolvargas.github.io/web/`  
Herramienta: Lighthouse 13.4.1 con Google Chrome 151

## Resultado

| Perfil     | Rendimiento | Accesibilidad | Buenas prácticas | SEO | Peso transferido | TBT    |
| ---------- | ----------- | ------------- | ---------------- | --- | ---------------- | ------ |
| Móvil      | 94          | 100           | 100              | 100 | 164 KiB          | 300 ms |
| Escritorio | 100         | 100           | 100              | 100 | 164 KiB          | 10 ms  |

Antes de las correcciones, móvil obtenía 87 en rendimiento y 95 en accesibilidad; escritorio obtenía 100 y 95 respectivamente. El peso era 206 KiB y el TBT móvil, 490 ms.

## Correcciones aplicadas

- Se incorporó `--primary-text` para conservar el naranja oficial en superficies y usar una variante con contraste WCAG AA en textos pequeños.
- La cabecera pública carga una sola variante light/dark del logotipo y una del isotipo. Antes descargaba las cuatro imágenes aunque dos estuvieran ocultas.
- Se declararon las dimensiones intrínsecas de las imágenes para mantener estable el layout.

La transferencia de recursos de marca bajó de 86 KiB a 44 KiB. La auditoría de contraste pasó de fallida a aprobada y no se registró desplazamiento acumulado de layout.

## Limitaciones externas y deuda

- GitHub Pages fija una caché aproximada de diez minutos; Angular no puede modificar sus encabezados HTTP.
- Lighthouse estima 21 KiB de JavaScript no usado en el runtime compartido, sin ahorro proyectado para FCP o LCP. No justifica fragmentar el arranque a costa de complejidad adicional.
- El TBT es una medición de laboratorio sensible a la capacidad de CPU. Debe vigilarse como tendencia y complementarse con datos reales cuando exista tráfico suficiente.
- Los logos conservan los PNG oficiales. Una futura variante WebP/AVIF debe generarse desde los originales aprobados y revisarse visualmente antes de sustituirlos.

## Reproducción

```bash
npx --yes lighthouse@13.4.1 https://ferretoolvargas.github.io/web/ \
  --output=json --chrome-flags="--headless --no-sandbox" --quiet

npx --yes lighthouse@13.4.1 https://ferretoolvargas.github.io/web/ \
  --preset=desktop --output=json --chrome-flags="--headless --no-sandbox" --quiet
```

Lighthouse se ejecutó temporalmente y no se añadió a las dependencias del proyecto.
