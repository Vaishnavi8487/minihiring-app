import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {Layout} from "./components/Layout"; // ensure default export from Layout.tsx
import { HomePage } from "./pages/HomePage";
import { JobsPage } from "./pages/JobsPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import { CandidatesPage } from "./pages/CandidatesPage";
import { CandidateDetailPage } from "./pages/CandidateDetailPage";
import { KanbanPage } from "./pages/KanbanPage";
import { AssessmentBuilderPage } from "./pages/AssessmentBuilderPage";
import { Dashboard } from "./pages/Dashboard";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import "hover.css/css/hover-min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all pages except possible external auth routes */}
        <Route path="/" element={<Layout />}>
          {/* Home Page */}
          <Route index element={<HomePage />} />

          {/* Core App Pages */}
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:jobId" element={<JobDetailPage />} />
          <Route
            path="jobs/:jobId/assessment"
            element={<AssessmentBuilderPage />}
          />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route
            path="candidates/:candidateId"
            element={<CandidateDetailPage />}
          />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Authentication */}
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
