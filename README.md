# Ragnarok DPS Calculator

Aplicación Next.js para calcular DPS de skills de Ragnarok Online usando presets y parámetros manuales.

Los íconos en `public/skill-icons` se obtuvieron de [bRO Wiki](https://browiki.org/) e [iRO Wiki](https://irowiki.org/) y se sirven localmente para evitar que cambios en sus rutas afecten a la calculadora.

## Scripts

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

## Docker

```bash
docker build -t ragnarok-dps-calculator .
docker run --rm -p 3000:3000 ragnarok-dps-calculator
```

La imagen usa `output: "standalone"` de Next.js y expone la app en el puerto `3000`.
