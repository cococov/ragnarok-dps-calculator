# Ragnarok DPS Calculator

Aplicación Next.js para calcular DPS de skills de Ragnarok Online usando presets y parámetros manuales.

Los íconos en `public/skill-icons` se obtuvieron de [bRO Wiki](https://browiki.org/) e [iRO Wiki](https://irowiki.org/) y se sirven localmente para evitar que cambios en sus rutas afecten a la calculadora.

## Entorno de desarrollo

Este proyecto usa Node.js **24.21.0 LTS** y pnpm **12.9.1**.
`.node-version` y `.nvmrc` seleccionan la versión local; `packageManager` fija pnpm.

```bash
# Con nodenv
nodenv install -s 24.21.0

# O con nvm
nvm install
nvm use

corepack enable
corepack prepare pnpm@12.9.1 --activate
pnpm install --frozen-lockfile
```

Docker usa las mismas versiones de Node y pnpm.

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
