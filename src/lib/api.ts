import type { Job, Candidate, Assessment, TimelineEvent, JobStatus, CandidateStage } from './database.types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';
const withBase = (path: string) => `${API_BASE}${path}`;

const json = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  // Some endpoints return 204
  return res.status === 204 ? null : res.json();
};

export const jobsApi = {
  async getJobs(params: {
    search?: string;
    status?: JobStatus;
    page?: number;
    pageSize?: number;
    sort?: string;
  }) {
    const { search = '', status, page = 1, pageSize = 10, sort = 'order' } = params;
    const qs = new URLSearchParams({ search, page: String(page), pageSize: String(pageSize), sort });
    if (status) qs.set('status', status);
    const res = await fetch(withBase(`/api/jobs?${qs.toString()}`));
    return json(res);
  },

  async createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    const res = await fetch(withBase('/api/jobs'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) });
    return json(res);
  },

  async updateJob(id: string, updates: Partial<Job>) {
    const res = await fetch(withBase(`/api/jobs/${id}`), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    return json(res);
  },

  async reorderJob(fromOrder: number, toOrder: number) {
    const res = await fetch(withBase('/api/jobs/dummy-id/reorder'), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fromOrder, toOrder }) });
    await json(res);
  },

  async getJob(id: string) {
    const res = await fetch(withBase(`/api/jobs/${id}`));
    return json(res);
  }
};

export const candidatesApi = {
  async getCandidates(params: {
    search?: string;
    stage?: CandidateStage;
    page?: number;
    pageSize?: number;
  }) {
    const { search = '', stage, page = 1, pageSize = 50 } = params;
    const qs = new URLSearchParams({ search, page: String(page), pageSize: String(pageSize) });
    if (stage) qs.set('stage', stage);
    const res = await fetch(withBase(`/api/candidates?${qs.toString()}`));
    return json(res);
  },

  async getCandidate(id: string) {
    const res = await fetch(withBase(`/api/candidates/${id}`));
    return json(res);
  },

  async createCandidate(candidate: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>) {
    const res = await fetch(withBase('/api/candidates'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(candidate) });
    return json(res);
  },

  async updateCandidate(id: string, updates: Partial<Candidate>) {
    const res = await fetch(withBase(`/api/candidates/${id}`), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    return json(res);
  },

  async getTimeline(candidateId: string) {
    const res = await fetch(withBase(`/api/candidates/${candidateId}/timeline`));
    return json(res) as Promise<TimelineEvent[]>;
  },

  async addNote(candidateId: string, note: string) {
    const res = await fetch(withBase(`/api/candidates/${candidateId}/notes`), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) });
    await json(res);
  }
};

export const assessmentsApi = {
  async getAssessment(jobId: string) {
    const qs = new URLSearchParams({ job_id: jobId });
    const res = await fetch(withBase(`/api/assessments?${qs.toString()}`));
    return json(res);
  },

  async saveAssessment(jobId: string, sections: any[]) {
    const res = await fetch(withBase('/api/assessments'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job_id: jobId, sections }) });
    return json(res);
  },

  async submitResponse(assessmentId: string, candidateId: string, responses: Record<string, any>) {
    const res = await fetch(withBase('/api/assessment_responses'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assessment_id: assessmentId, candidate_id: candidateId, responses }) });
    return json(res);
  },

  async getResponse(assessmentId: string, candidateId: string) {
    const qs = new URLSearchParams({ assessment_id: assessmentId, candidate_id: candidateId });
    const res = await fetch(withBase(`/api/assessment_responses?${qs.toString()}`));
    return json(res);
  }
};
