# E-commerce React App

## Descriere

Acesta este un proiect de aplicație e-commerce construit cu React, TypeScript, Vite și Tailwind CSS, care include integrarea autentificării utilizatorilor prin Firebase Authentication.

---

## Funcționalități implementate
## 06/07/2025

- Autentificare cu email și parolă (login și înregistrare) folosind Firebase  
- Login cu Google (OAuth) integrat prin Firebase  
- Funcționalitate resetare parolă prin email  
- Gestionarea autentificării printr-un serviciu dedicat (`authService.ts`)  
- Componente React pentru login, înregistrare și resetare parolă  
- Utilizare async/await corectă pentru apelurile Firebase  
- Stilizare cu Tailwind CSS  

## 07/07/2025
- Pagina de profil utilizator care afișează informațiile utilizatorului autentificat 
- Editarea informațiilor de profil (name, adresa si phone)




## Tehnologii folosite

- React + TypeScript  
- Vite (dev server rapid)  
- Tailwind CSS  
- Firebase Authentication  

---

## Cum să rulezi local

1. Clonează proiectul și instalează dependențele:

```bash
npm install




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
