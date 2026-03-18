# FitMate AI - Premium Web Application

A state-of-the-art, AI-driven platform for fitness and beauty management, built with the latest **Next.js 16**, **React 19**, and **Tailwind CSS 4**. Designed with a premium aesthetic and high-performance architecture to provide a seamless experience for both administrators and users.

---

## ✨ Features

### 🛠️ Admin Dashboard
- **Policy Workshop**: A high-end Privacy Policy management system with full **Markdown** and **HTML** support, live preview, and per-section save functionality.
- **Payment & Withdrawal Management**: Robust system for approving and managing withdrawal requests with real-time feedback and status tracking.
- **Inventory & Menu Management**: Integrated solution for managing ingredients, categories, and menus with export/import capabilities (Excel/PDF).
- **Advanced UI/UX**: Built with `framer-motion` for smooth transitions and `lucide-react` for a modern look.

### 🛡️ Core Capabilities
- **Rich Text Editing**: Integrated Markdown editor for dynamic content management.
- **Real-time Notifications**: Instant feedback using `sonner` toast system.
- **Safe State Management**: Global state handling via **Redux Toolkit** and **RTK Query**.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **Dark/Light Mode**: Seamless theme switching with persistent user preferences.

---

## 🛠️ Tech Stack

### Frontend & Core
- **Framework**: [Next.js 16 (Webpack)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with `@tailwindcss/typography`
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/), [Hugeicons](https://hugeicons.com/), [Tabler Icons](https://tabler-icons.io/)

### State & Data
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **API Fetching**: RTK Query
- **Charts**: [Recharts](https://recharts.org/)
- **Content Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown) with `remark-gfm`

---

## 🔧 Getting Started

### Prerequisites
- **Node.js**: 20.x or higher
- **npm**: 10.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nrbnayon/fitmate-ai.git
   cd fitmate-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   # Add other required environment variables
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the result.

---

## 📦 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Webpack. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

---

## 📁 Project Structure

```bash
fitmate-ai/
├── app/                  # Next.js App Router (Protected/Public routes)
├── components/           # Reusable UI components
│   ├── Common/           # Shared logic components (e.g., PrivacyPolicy)
│   ├── Shared/           # Global Modals and Layout elements
│   └── ui/               # Primary UI elements (Radix wrappers)
├── hooks/                # Custom React hooks (useUser, useAuth, etc.)
├── redux/                # Redux store and API service definitions
├── types/                # TypeScript interfaces and types
├── lib/                  # Utility functions and helper scripts
├── public/               # Static assets (Images, Icons)
└── tailwind.config.ts    # Tailwind CSS specialized configuration
```

---

## 🚀 Deployment & Versioning

- **GitHub Origin**: [nrbnayon/fitmate-ai](https://github.com/nrbnayon/fitmate-ai)
- **GitLab Mirror**: [join-venture-ai/yourself-beauty-web-app](git@gitlab.betopialimited.com:join-venture-ai/yourself-beauty-web-app/frontend.git)

For production deployment:
```bash
npm run build
npm start
```

---

## 📄 License

This project is proprietary. All rights reserved.

**Maintainer**: [Nayon xD](https://github.com/nrbnayon)  
**Version**: 1.0.0  
**Status**: API Implementation Phase  
