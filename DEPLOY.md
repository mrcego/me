# GitHub Pages Deployment Guide

## 🚀 Pasos para hacer deploy en GitHub Pages

### 1. Configurar el repositorio

```bash
# Asegúrate que tu repositorio está en GitHub
git remote -v
# Deberías ver: origin https://github.com/mrcego/me.git (o tu repo)
```

### 2. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**

### 3. El workflow ya está configurado

El archivo `.github/workflows/deploy.yml` ya contiene:

- Build automático con Node.js y pnpm
- Generación estática con `pnpm run generate`
- Deploy automático a GitHub Pages

### 4. Hacer commit y push

```bash
# Agregar todos los cambios
git add .

# Commit
git commit -m "Add GitHub Pages deployment workflow and favicon updates"

# Push a GitHub
git push origin main
```

### 5. Verificar el deploy

1. Ve a **Actions** tab en tu repositorio
2. Verás el workflow "Deploy to GitHub Pages" corriendo
3. Cuando termine, tu sitio estará disponible en:
   - `https://mrcego.github.io/me`

## 📝 Notas importantes

### Base URL

El sitio está configurado para funcionar en `/me` (el nombre del repositorio). Si cambias el nombre del repo, actualiza esta línea en `nuxt.config.ts`:

```typescript
baseURL: '/me';
```

### Generación estática

El comando `pnpm run generate` crea una versión estática del sitio perfecta para GitHub Pages.

### Automatización

Cada vez que hagas push a la rama `main`, el sitio se reconstruirá y desplegará automáticamente.

## 🔧 Troubleshooting

### Si el deploy falla:

1. Revisa la pestaña **Actions** para ver los errores
2. Asegúrate que todos los archivos están commiteados
3. Verifica que el workflow tiene los permisos correctos

### Si los assets no cargan:

1. Verifica que la baseURL sea correcta
2. Limpia el cache del navegador
3. Revisa las rutas en `nuxt.config.ts`

## 🎯 Resultado final

Tu portfolio estará disponible en: `https://mrcego.github.io/me`

Con favicon personalizado, OG images optimizados y todo funcionando perfectamente.
