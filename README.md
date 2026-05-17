# App Kayapat 🚀

A premium React web application for physical therapy guidance, built with clinical excellence and modern aesthetics in mind.

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/) & Material Symbols
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Containerization:** [Docker](https://www.docker.com/)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20+)
- **NPM** (v10+)

### Local Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Docker Setup
- **Development:** `docker-compose up dev`
- **Production:** `docker-compose up app`

---

## 🌿 Git Workflow (Branch Protection)

The `master` branch is protected to ensure code quality. Follow these steps to contribute:

1. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```
3. **Open a Pull Request:**
   Go to GitHub and create a PR from your branch to `master`.

---

## 🔔 CI/CD & Notifications

We use **GitHub Actions** for automated testing and builds.

### Discord Notifications
To receive CI failure alerts in Discord:
1. Create a Webhook in your Discord channel.
2. Add the URL to GitHub Secrets as `DISCORD_WEBHOOK`.

---

## 📁 Project Structure

```text
src/
├── assets/         # Static assets
├── components/     # UI Components
├── lib/            # Utilities (e.g., cn helper)
├── pages/          # Routed pages
├── App.jsx         # App Entry & Routes
└── main.jsx        # React Mounting
```

---

Built with ❤️ by Antigravity AI
