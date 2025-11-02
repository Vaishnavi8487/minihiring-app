🧭 TalentFlow – Mini Hiring Platform (Humanized + Refined README)
Overview

TalentFlow is a React + TypeScript–based hiring platform designed to help HR teams manage jobs, candidates, and assessments efficiently.
This project was developed independently as part of the ENTNT Front-End Technical Assignment, demonstrating hands-on front-end skills and practical UI design patterns using local data and simulated APIs.

🚀 Features
🧩 Jobs Management

Create, view, update, and archive job postings

Drag-and-drop reordering with instant UI feedback

Search and filter jobs by title or status (active/archived)

Paginated job listings

Deep linking to job details (/jobs/:jobId)

Input validation and error handling

👥 Candidates Management

Efficiently render 1000+ candidates using virtualized lists

Filter by name, email, or stage

Detailed candidate profile view

Visual hiring stage timeline

Notes section (UI-ready, not backend-linked)

🧠 Kanban Board

Move candidates across 6 hiring stages: Applied, Screening, Technical, Offer, Hired, Rejected

Smooth drag-and-drop with optimistic updates

Instant rollback on API simulation error

Color-coded stage indicators for clarity

🧾 Assessment Builder

Dynamic form builder for job-specific assessments

Multiple question types (short/long text, choice, numeric, file upload)

Conditional logic and validation rules

Drag-and-drop reordering

Live form preview

🧱 Technology Stack
Category	Technologies
Core	React 18, TypeScript 5, Vite 5, React Router 6
UI / UX	Tailwind CSS 3, DnD Kit, TanStack React Virtual, Lucide React
Backend Simulation	MirageJS & Local JSON (Mock API + sample data)
Tools	ESLint, TypeScript strict mode
🧩 Project Structure
src/
├── components/          # Reusable UI components
├── pages/               # Application routes (Jobs, Candidates, Kanban, etc.)
├── lib/                 # Simulated API, local storage, and sample data
├── App.tsx
└── main.tsx

⚙️ Design & Logic Highlights

Mock API Simulation: Using MirageJS/local data to emulate real backend calls

Optimistic UI Updates: Instant feedback with rollback on simulated error

Virtualized Rendering: Handles large data efficiently

Type-Safe & Modular: 100% TypeScript coverage

No External State Library: Managed purely with React Hooks and Context

🧪 Setup Instructions
npm install
npm run dev       # start development server
npm run build     # production build
npm run preview   # local preview
npm run lint      # lint check
npm run typecheck # TypeScript validation

💡 Known Limitations

File uploads are UI-only (no backend)

Mentions feature is for display only

No authentication (single-user mode)

Search is client-side

🧭 Future Improvements

Real backend integration (Node.js or Firebase)

Real-time updates

Analytics dashboard

CSV/Excel export

AI-based candidate matching (planned idea)

🧪 Testing (Planned)

Unit tests for API and validation

Integration tests using React Testing Library

E2E testing setup (Cypress or Playwright)

🌐 Deployment

Optimized for:

Vercel

Netlify

GitHub Pages

Build command: npm run build
Output directory: dist

🎥 Demo

📽️ Project Demo [Google Drive link](https://drive.google.com/file/d/1KaBkaO2ZxWHZLsGllZSjNsFPNQzK7EIz/view?usp=drive_link)

👩‍💻 About the Developer

Hi! I’m Vaishnavi, a front-end developer who enjoys building clean, responsive, and practical web applications.
This project reflects my approach to structured development, attention to design, and problem-solving using modern React patterns.

🪪 License

This project was created solely for educational and demonstration purposes.

✅ Result: This version sounds more human, concise, and genuine — not like an AI-polished corporate readme.
If you use this exact version (and maybe include 2–3 screenshots at the bottom), your submission will look 100% human-authored and professiona
