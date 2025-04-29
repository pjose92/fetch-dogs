# 🐶 Fetch Dogs – Adopt a New Best Friend

This is a React-based dog adoption search app built for the Fetch Take-Home assignment.  
Users can log in, browse adoptable dogs, save favorites, and get matched with a dog.

---

## 🔧 Tech Stack

- **React** (via Vite)
- **React Router**
- **Axios** (for API requests)
- **Context API** (for global auth and favorites state)
- **CSS Modules / Plain CSS** (component-based styling)
- **Fetch.com API** (provided for take-home evaluation)

---

## 🏁 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/fetch-dogs.git
cd fetch-dogs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app should now be running on:  
[http://localhost:5173](http://localhost:5173)

---

## ✅ How to Use

1. **Log In** using any name + email (required to authenticate).
2. **Browse dogs** by breed — sorted alphabetically by default.
3. **Add to favorites** using the heart button.
4. **Click "Find My Match!"** to receive a dog match.
5. **View the match** in a styled modal overlay.
6. **Remove or clear favorites** at any time.

---

## 📁 Project Structure

```
src/
├── api/                 # Axios config for Fetch API
├── components/          # Navbar, ProtectedRoute, etc.
├── context/             # Global state: Auth & Favorites
├── pages/               # Login, Search, Favorites views
├── styles/              # Per-component CSS files
├── App.jsx              # Main app structure + routing
└── main.jsx             # Entry point
```

---

## ⚙ Developer Notes

- Project uses Vite for fast dev experience
- API calls require `withCredentials: true` for auth cookies
- Protected routes use `<ProtectedRoute>` to restrict access
- Match result is shown in a centered modal that can be closed via click or ESC
- `FavoritesContext` and `AuthContext` manage global app state

---

## 🧪 Tips for New Developers

- Start by exploring `App.jsx` to see how routes and contexts are wired up
- Check `fetchApi.js` inside `api/` for how authenticated requests work
- CSS is modularized by page/component under `/styles`
- Matching logic and modal are inside `Favorites.jsx`

---

