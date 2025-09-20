# Step3D Course Site — Vite + React + Tailwind

Готовый шаблон под твой лендинг курса.

## Установка
```bash
npm i
npm run dev
```

Открой http://localhost:5173

## Сборка
```bash
npm run build
npm run preview
```

## Деплой на GitHub Pages (ветка `gh-pages`)
1. В `Settings → Pages` выбери **Deploy from a branch**.
2. Ветка: `gh-pages`, папка: `/ (root)`.
3. Из локали:
   ```bash
   npm run build
   git add dist -f
   git commit -m "build"
   git subtree push --prefix dist origin gh-pages
   ```
   или настроить CI (например, `peaceiris/actions-gh-pages`).

## Где править контент
- Текст/программа/ссылки: `src/data.js`
- Компоненты: `src/components/*`
- Стили: `src/index.css`
