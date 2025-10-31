import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Card, CardContent } from "../components/ui/card";
import { User, Briefcase, CalendarCheck, TrendingUp } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: string;
  date_applied: string;
}

interface Job {
  id: string;
  status: string;
}

export function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeCandidates: 0,
    interviewsScheduled: 0,
    hiredCandidates: 0,
  });

  const [candidatesPerStage, setCandidatesPerStage] = useState<{ stage: string; count: number }[]>([]);
  const [jobStatus, setJobStatus] = useState<{ name: string; value: number }[]>([]);
  const [applicationsTrend, setApplicationsTrend] = useState<{ month: string; applications: number }[]>([]);
  const [recentActivities, setRecentActivities] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

  useEffect(() => {
    setTimeout(fetchMockData, 500);
  }, []);

  function fetchMockData() {
    const mockJobs: Job[] = [
      { id: "1", status: "active" },
      { id: "2", status: "active" },
      { id: "3", status: "closed" },
      { id: "4", status: "archived" },
    ];

    const mockCandidates: Candidate[] = [
      { id: "1", name: "Alice Johnson", role: "Frontend Developer", stage: "Shortlisted", date_applied: "2025-09-12" },
      { id: "2", name: "Bob Smith", role: "Backend Engineer", stage: "Interviewed", date_applied: "2025-09-10" },
      { id: "3", name: "Clara Lee", role: "UI/UX Designer", stage: "Hired", date_applied: "2025-08-25" },
      { id: "4", name: "David Kim", role: "Data Analyst", stage: "Applied", date_applied: "2025-09-20" },
      { id: "5", name: "Emma Davis", role: "QA Tester", stage: "Rejected", date_applied: "2025-09-15" },
      { id: "6", name: "Frank Miller", role: "Backend Engineer", stage: "Interviewed", date_applied: "2025-09-22" },
    ];

    const mockActivities = [
      "Alice Johnson shortlisted for Frontend Developer",
      "Bob Smith interviewed for Backend Engineer",
      "Clara Lee hired as UI/UX Designer",
      "David Kim applied for Data Analyst",
      "Emma Davis rejected for QA Tester",
    ];

    const totalJobs = mockJobs.length;
    const totalCandidates = mockCandidates.length;
    const stageCounts = [
      { stage: "Applied", count: mockCandidates.filter((c) => c.stage === "Applied").length },
      { stage: "Shortlisted", count: mockCandidates.filter((c) => c.stage === "Shortlisted").length },
      { stage: "Interviewed", count: mockCandidates.filter((c) => c.stage === "Interviewed").length },
      { stage: "Hired", count: mockCandidates.filter((c) => c.stage === "Hired").length },
      { stage: "Rejected", count: mockCandidates.filter((c) => c.stage === "Rejected").length },
    ];

    const jobStatusCount = [
      { name: "Active", value: mockJobs.filter((j) => j.status === "active").length },
      { name: "Closed", value: mockJobs.filter((j) => j.status === "closed").length },
      { name: "Archived", value: mockJobs.filter((j) => j.status === "archived").length },
    ];

    const monthlyCounts: Record<string, number> = {};
    mockCandidates.forEach((c) => {
      const month = new Date(c.date_applied).toLocaleString("default", { month: "short" });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    const trendArray = Object.entries(monthlyCounts).map(([month, applications]) => ({ month, applications }));

    setStats({
      totalJobs,
      activeCandidates: totalCandidates,
      interviewsScheduled: stageCounts.find((s) => s.stage === "Interviewed")?.count || 0,
      hiredCandidates: stageCounts.find((s) => s.stage === "Hired")?.count || 0,
    });
    setCandidatesPerStage(stageCounts);
    setJobStatus(jobStatusCount);
    setApplicationsTrend(trendArray);
    setRecentActivities(mockActivities);
    setCandidates(mockCandidates);
  }

  const stageColors: Record<string, string> = {
    Applied: "#34d399",
    Shortlisted: "#a78bfa",
    Interviewed: "#fbbf24",
    Hired: "#3b82f6",
    Rejected: "#ef4444",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Title */}
      <h1 className="text-3xl font-bold">
        Welcome back, <span className="text-green-600 dark:text-green-400">HR Manager 👋</span>
      </h1>

      {/* HR Profile Card */}
      <Card className="p-6 flex items-center justify-between bg-white/80 dark:bg-slate-800/70 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-emerald-700 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-green-600 dark:text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Avery Patel</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">HR Manager, TalentFlow</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm text-slate-500 dark:text-slate-400 block">Active since</span>
          <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            March 2023
          </span>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Total Jobs</p>
              <h2 className="text-2xl font-semibold">{stats.totalJobs}</h2>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Active Candidates</p>
              <h2 className="text-2xl font-semibold">{stats.activeCandidates}</h2>
            </div>
            <User className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Interviews Scheduled</p>
              <h2 className="text-2xl font-semibold">{stats.interviewsScheduled}</h2>
            </div>
            <CalendarCheck className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-300">Hired Candidates</p>
              <h2 className="text-2xl font-semibold">{stats.hiredCandidates}</h2>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4">Candidates per Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidatesPerStage}>
              <XAxis dataKey="stage" stroke="#94a3b8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {candidatesPerStage.map((entry, index) => (
                  <Cell key={index} fill={stageColors[entry.stage] || "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4">Job Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={jobStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                {jobStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Applications Trend */}
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-4">Applications Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={applicationsTrend}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Activities & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            {recentActivities.length ? (
              recentActivities.map((a, i) => (
                <li key={i} className="border-b border-slate-200 dark:border-slate-700 pb-2">
                  • {a}
                </li>
              ))
            ) : (
              <li>No recent activity</li>
            )}
          </ul>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Candidate Overview</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <th className="py-2">Name</th>
                <th>Role</th>
                <th>Stage</th>
                <th>Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length ? (
                candidates.map((c, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-2 font-medium">{c.name}</td>
                    <td>{c.role}</td>
                    <td>{c.stage}</td>
                    <td>{new Date(c.date_applied).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-slate-500 dark:text-slate-400">
                    No candidate data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
