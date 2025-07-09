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
## 08/07/2025
- Bara de navigare(momentan este doar un protoip functional, la care vom reveni ulterior pentru a o stiliza):
  TODO:revenire navbar
- Componente reutilizabile (`Button.tsx`, `Input.tsx`) constuite cu :
  - **`clsx`** - pentru gestionarea inteligentă a claselor CSS condiționale
  - **`twMerge`** - pentru combinarea sigură a claselor Tailwind CSS
- Pafina de shop(in lucru):
  - am structurat fisierul products.ts cu datele produselor
  - componente: ProductCard.tsx si ProductGrid.tsx
  TODO: conectare baza de date, paginare, filtre si sortari

## 09/07/2025
# Setare Redux Toolkit:
  Am creat un cartSlice cu:
  - addToCart( adauga prod in cos sau creste cantiatea daca exista)
  - removeFromCart
  - clearCart
  TODO:de reveint pentru eventuali validari suplimentare si finctionalitati
  Am definit unn CartItem care extinde Product cu un camp suplimentar quantity
# Store configurat + Redux Persist:
  Am folosit redux-persist pentru a salva coșul în localStorage, astfel încât datele să rămână după refresh. Am configurat:
  - persistReducer cu storage și whitelist: ['items']
  - persistStore în store.ts 
# Pagina CartPage
  - Listeaza produsele din `state.cart.items`
  - Calculeaza totalul cu `item.price * item.quantity`
  - Afișează mesaj dacă coșul e gol
# Componenta CartButton
  - Afișează numărul total de produse (suma cantităților)
  - Deschide un dropdown cu lista produselor
  - Are un buton "Vezi coșul" care duce către /cart

# Fixuri si debug
  - Am descoperit că fără persist, coșul se golea la refresh

# Wishlist
-La început, wishlist-ul a fost gestionat cu **Redux Toolkit**, unde produsele favorite erau salvate local în aplicație. Am folosit `redux-persist` pentru a păstra datele chiar și după refresh, salvând totul în `localStorage`.

#Am trecut apoi la o implementare mai robustă:
- La autentificare, wishlist-ul utilizatorului este preluat din **Firestore**.
- Când se adaugă sau se șterge un produs:
  - se actualizează instant în **Redux** (pentru UX rapid),
  - iar apoi se sincronizează și în **Firestore** (pentru salvare permanentă).



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
