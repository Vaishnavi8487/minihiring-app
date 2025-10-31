import { Link } from "react-router-dom";
import { Briefcase, Users, Layout, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { jobsApi, candidatesApi } from "../lib/api";
import { seedDatabase } from "../lib/seed";

export function HomePage() {
  const [stats, setStats] = useState({ jobs: 0, candidates: 0, kanban: 0, dashboard: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  async function initializeData() {
    try {
      await seedDatabase();
      const [jobsRes, candidatesRes] = await Promise.all([
        jobsApi.getJobs({ page: 1, pageSize: 1 }),
        candidatesApi.getCandidates({ page: 1, pageSize: 1 }),
      ]);
      setStats({
        jobs: jobsRes.total || 0,
        candidates: candidatesRes.total || 0,
        kanban: 1,
        dashboard: 1,
      });
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 via-green-100 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-500">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 md:py-24 min-h-screen transition-colors duration-500">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to Your Hiring Platform
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          Streamline your hiring process — manage jobs, candidates, and workflows effortlessly.
        </p>
      </section>

      {/* Cards Section */}
      <section className="grid md:grid-cols-4 gap-8 w-full max-w-7xl">
        {/* Jobs */}
        <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-green-300 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hvr-border-fade">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-green-600 text-white rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7" />
            </div>
            <span className="text-4xl font-bold">{stats.jobs}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 hvr-underline-from-center">
            Job Openings
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-5 text-sm">
            Manage and organize your job postings easily.
          </p>
          <Link
            to="/jobs"
            className="inline-block w-full text-center bg-green-600 text-white py-2.5 rounded-lg font-medium hvr-bounce-to-right transition-colors"
          >
            View Jobs
          </Link>
        </div>

        {/* Candidates */}
        <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-emerald-300 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hvr-border-fade">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <span className="text-4xl font-bold">{stats.candidates}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 hvr-overline-from-left">
            Candidates
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-5 text-sm">
            Track applicants through hiring stages seamlessly.
          </p>
          <Link
            to="/candidates"
            className="inline-block w-full text-center bg-emerald-600 text-white py-2.5 rounded-lg font-medium hvr-bounce-to-right transition-colors"
          >
            View Candidates
          </Link>
        </div>

        {/* Kanban */}
        <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-lime-300 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hvr-border-fade">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-lime-600 text-white rounded-xl flex items-center justify-center">
              <Layout className="w-7 h-7" />
            </div>
            <span className="text-4xl font-bold">{stats.kanban}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 hvr-underline-from-left">
            Kanban Board
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-5 text-sm">
            Visualize and manage your workflow with drag-and-drop boards.
          </p>
          <Link
            to="/kanban"
            className="inline-block w-full text-center bg-lime-600 text-white py-2.5 rounded-lg font-medium hvr-bounce-to-right transition-colors"
          >
            Go to Kanban
          </Link>
        </div>

        {/* Dashboard */}
        <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-blue-300 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hvr-border-fade">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center">
              <BarChart className="w-7 h-7" />
            </div>
            <span className="text-4xl font-bold">{stats.dashboard}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 hvr-overline-from-center">
            Dashboard
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-5 text-sm">
            Get insights on hiring performance and activity trends.
          </p>
          <Link
            to="/dashboard"
            className="inline-block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hvr-bounce-to-right transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
