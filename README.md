# Inspiria - Premium Random Quote Generator

A professional, modern, and production-ready Random Quote Generator built with **React**, **Tailwind CSS**, and **Framer Motion**.  
Designed with best practices, component modularity, and accessibility in mind.

## 🚀 Features

- **Random Quote Generation**: Fetches inspiring quotes with a fallback mechanism.
- **Image Gallery**: Integrated Unsplash gallery with search and download functionality.
- **Light/Dark Mode**: Persistent theme toggle respecting user preference.
- **Animations**: Smooth transitions powered by Framer Motion.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Accessibility**: Semantic HTML, proper contrast, and keyboard navigation.

## 🛠️ Tech Stack

- **React 18**: Functional Components & Hooks
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations
- **Axios**: Data fetching
- **Lucide React**: Icons
- **Vite**: Ultra-fast build tool

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── QuoteCard.jsx
│   ├── ImageGallery.jsx
│   └── ThemeToggle.jsx
├── hooks/            # Custom logic hooks
│   ├── useQuote.js
│   └── useUnsplash.js
├── services/         # API services
│   └── quoteApi.js
├── App.jsx           # Main Application Layout
└── index.css         # Tailwind directives
```

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlishbaIqbal123/quote-generator-web-project-.git
   cd quote-generator-web-project-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌍 Deployment

This project is optimized for deployment on Vercel or Netlify.

**Vercel:**
1. Import the repository.
2. The framework preset (Vite) should be detected automatically.
3. Deploy!

## 🔐 API Keys
The project uses limited public APIs. For high production usage, replace the Unsplash Client ID in `src/hooks/useUnsplash.js` with your own from the [Unsplash Developer Portal](https://unsplash.com/developers).

---
**Developed with best practices by a Senior React Engineer.**
