# App Kayapat 🚀

A modern React web application built with **Vite**, **Tailwind CSS v4**, and essential tools for a premium development experience.

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Containerization:** [Docker](https://www.docker.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Docker](https://www.docker.com/) (Optional, for containerized development)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Docker Development (Recommended for Teams)

If you don't want to install Node.js locally or want to ensure environment consistency:

- **Start development server (with Hot Reload):**
  ```bash
  docker-compose up dev
  ```
  Access via [http://localhost:3000](http://localhost:3000).

- **Build and Run Production version (Nginx):**
  ```bash
  docker-compose up app
  ```
  Access via [http://localhost:8080](http://localhost:8080).

## 📁 Project Structure

```text
src/
├── assets/         # Images, fonts, and static assets
├── components/     # Reusable UI components
├── lib/            # Utilities and helper functions (e.g., cn utility)
├── pages/          # Page components (routed via React Router)
├── App.jsx         # Main application component & routes
├── index.css       # Global styles and Tailwind imports
└── main.jsx        # Entry point
```

## 📝 Utility Functions

We've included a `cn` utility in `src/lib/utils.js` for merging Tailwind classes easily:

```javascript
import { cn } from './lib/utils';

<div className={cn("base-class", condition && "active-class", customClass)}>...</div>
```

---

Built with ❤️ by Antigravity AI
