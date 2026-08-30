# 斗獸棋 (Dou Shou Qi / Jungle Board Game)

An authentic, modern web implementation of the traditional Chinese board game **Jungle (斗獸棋 / Animal Chess)** built with **Vue 3**, **Vite**, **TypeScript**, and **Tailwind CSS**.

Playable against AI with multiple difficulty levels (Alpha-Beta Minimax), local 2-player pass & play, and demonstration mode.

---

## 🌟 Features

- **Full Jungle Rules Engine**:
  - 7×9 Board layout with authentic red-line line-art terrain matching the classic Wikipedia Dou Shou Qi board diagram.
  - Complete 8-tier animal hierarchy: Elephant (8) down to Rat (1).
  - Special mechanics: Rat swimming & Elephant capture, Lion & Tiger river leaping (with Rat blocking detection), opponent Trap rank debuff (Rank 0), and Den capture win conditions.
- **Game Modes**:
  - 🤖 **vs AI (PvE)**: Play against Computer AI with 3 difficulty levels (Easy, Medium, Hard with Alpha-Beta pruning).
  - 👥 **2-Player (PvP)**: Pass-and-play on a single device with 180° auto-rotated pieces and river labels for the opponent.
  - 🎬 **Demo (EvE)**: AI vs AI automated battle demonstration.
- **Bilingual (i18n)**:
  - English & Traditional Chinese (繁體中文).
- **Audio & Visual Effects**:
  - Procedural sound synthesizer via Web Audio API (movement, river jumps, captures, victory fanfare).
  - Responsive layout optimized from desktop down to 320px mobile screens.
  - Move history notation & interactive rulebook modal.
  - Undo, Redo, and Move Hint assistance.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/<your-username>/jungle-app.git
cd jungle-app

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 🧪 Testing & Building

```bash
# Run unit tests (Vitest)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

This repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** ➔ **Pages**.
   - Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
3. Every push to `main` will automatically test, build, and deploy your game to `https://<your-username>.github.io/<repo-name>/`.

---

## 📜 License

MIT License.
