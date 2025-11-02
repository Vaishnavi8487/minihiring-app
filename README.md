🧭 TalentFlow – Mini Hiring Platform

A React + TypeScript based hiring platform that helps HR teams manage jobs, candidates, and assessments.
This project was built independently as part of the ENTNT Front-End Technical Assignment, showcasing practical front-end development skills and modern UI patterns with a simulated backend using local data and APIs.

🚀 Features
🧩 Jobs Management

CRUD Operations — Create, read, update, and archive job postings

Drag-and-Drop Reordering — Reorder jobs with optimistic UI updates and rollback on failure

Advanced Filtering — Search by title, filter by status (active/archived)

Pagination — Paginated job listings with configurable page sizes

Deep Linking — Direct navigation to /jobs/:jobId

Validation — Required fields, unique slugs, and error handling

👥 Candidates Management

Virtualized List — Efficiently render 1000+ candidates using @tanstack/react-virtual

Advanced Search — Filter by name and email

Stage Filtering — View candidates by hiring stage

Detailed Profiles — Candidate details with stage history

Timeline View — Visual timeline for stage changes and notes

Notes with @Mentions — UI-ready notes section (rendering only)

🧠 Kanban Board

Drag-and-Drop Stage Management across 6 stages: Applied, Screening, Technical, Offer, Hired, Rejected

Instant UI Feedback with real-time updates

Optimistic Updates — Instant visual response with rollback on failure

Color-Coded Stage Indicators

🧾 Assessment Builder

Dynamic Form Builder — Create and manage job-specific assessments

Multiple Question Types: short text, long text, single/multiple choice, numeric, file upload

Conditional Logic — Show/hide questions based on previous answers

Drag-and-Drop Reordering

Live Preview of fillable forms

Validation Rules — Required fields, limits, and dependencies

Sectioned Organization for clear structure

🧱 Technology Stack
Category	Technologies
Core	React 18.3, TypeScript 5.5, Vite 5.4, React Router DOM 6
UI / UX	Tailwind CSS 3.4, @dnd-kit, @tanstack/react-virtual, Lucide React
Backend Simulation	MirageJS / local JSON data (for API simulation)
Build Tools	ESLint, TypeScript strict mode
🧩 Project Structure
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx
│   ├── JobModal.tsx
│   └── AssessmentPreview.tsx
├── pages/               # Route-based pages
│   ├── HomePage.tsx
│   ├── JobsPage.tsx
│   ├── JobDetailPage.tsx
│   ├── CandidatesPage.tsx
│   ├── CandidateDetailPage.tsx
│   ├── KanbanPage.tsx
│   └── AssessmentBuilderPage.tsx
├── lib/
│   ├── api.ts           # Simulated API calls
│   ├── db.ts            # Local data storage
│   └── seed.ts          
├── App.tsx
└── main.tsx

⚙️ Key Design Highlights

Mock API with MirageJS / Local Data

Simulated network latency

Realistic error handling

Smooth user experience without an actual backend

Optimistic UI Updates with Rollback

setItems(newItems);
try {
  await api.updateItems(newItems);
} catch {
  setItems(originalItems);
  showError();
}


Virtualized Rendering for large data lists

Dynamic Validation System for form fields and assessments

State Management using React hooks and context (no external library)

🧩 Setup Instructions
npm install
npm run dev      
npm run build     
npm run preview 
npm run lint     
npm run typecheck 


The app auto-loads with:

25 job postings

1000 candidates

5 sample assessments

💡 Technical Highlights

Virtual Scrolling: Handles 1000+ candidates smoothly

Lazy Loading: Route-based code splitting

Optimistic Updates: Instant UI feedback

Error Simulation: Randomized network error handling

Accessibility: Semantic HTML + ARIA support

Type Safety: 100% TypeScript coverage

🔍 Known Limitations

File upload UI only (no backend storage)

@Mentions feature is visual-only

No authentication (single-user mode)

Search is client-side only

🧭 Future Enhancements

Real backend integration (Node.js / Supabase / Firebase)

Real-time collaboration

Analytics dashboard

CSV/Excel export

AI-based candidate matching

🧪 Testing Approach

Unit tests (planned) for API and validation logic

Integration tests with React Testing Library

E2E tests (future) with Playwright or Cypress

🌐 Deployment

Optimized for:

Vercel

Netlify

GitHub Pages

Build command: npm run build
Output directory: dist

🎥 Demo

📽️ Project Demo (Google Drive)

🧑‍💻 About the Developer

Hi! I’m Vaishnavi, a frontend developer passionate about building clean, responsive, and scalable web applications using React, TypeScript, and modern UI design.
This project reflects my understanding of real-world front-end architecture and user experience design.

🪪 License

This project was created solely for educational and demonstration purposes.
