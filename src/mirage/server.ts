// src/mirage/server.ts
import { createServer, Response } from "miragejs";
import { db } from '../lib/indexedDB';
import type { Job, Candidate, Assessment, AssessmentResponse, TimelineEvent } from '../lib/database.types';

export function makeServer({ environment = "development" } = {}) {
  const server = createServer({
    environment,
    // No Mirage models; handlers use IndexedDB for persistence

    routes() {
      this.namespace = "api";
      this.timing = 0; // we'll handle latency manually per handler

      // Helpers
      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
      const maybeFail = () => {
        if (Math.random() < 0.08) return true;
        return false;
      };
      const uuid = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);

      // Jobs
      this.get("/jobs", async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        const search = request.queryParams?.search?.toLowerCase?.() ?? '';
        const status = request.queryParams?.status as string | undefined;
        const sort = (request.queryParams?.sort as string) ?? 'order';
        const page = parseInt((request.queryParams?.page as string) ?? '1', 10);
        const pageSize = parseInt((request.queryParams?.pageSize as string) ?? '10', 10);

        const allJobs = await db.getJobs();
        let filtered = allJobs.filter(j => j.title.toLowerCase().includes(search));
        if (status) filtered = filtered.filter(j => j.status === status);

        if (sort === 'order') filtered.sort((a,b)=>a.order-b.order);
        else if (sort === 'title') filtered.sort((a,b)=>a.title.localeCompare(b.title));
        else if (sort === 'created_at') filtered.sort((a,b)=>b.created_at.localeCompare(a.created_at));

        const from = (page - 1) * pageSize;
        const data = filtered.slice(from, from + pageSize);
        return new Response(200, {}, { data, total: filtered.length });
      });

      this.get('/jobs/:id', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        const job = await db.getJob(request.params.id as string);
        if (!job) return new Response(404, {}, { error: 'Job not found' });
        return new Response(200, {}, job);
      });

      this.post("/jobs", async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });

        const body = JSON.parse(request.requestBody) as Omit<Job, 'id'|'created_at'|'updated_at'>;
        if (!body.title) return new Response(400, {}, { error: 'Title required' });
        // Duplicate slug check
        const existingJobs = await db.getJobs();
        if (existingJobs.some(j => j.slug === body.slug)) {
          return new Response(400, {}, { error: 'Slug already exists' });
        }
        const now = new Date().toISOString();
        const job: Job = { id: uuid(), created_at: now, updated_at: now, ...body };
        await db.putJob(job);
        return new Response(200, {}, job);
      });

      this.patch("/jobs/:id", async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });
        const id = request.params.id as string;
        const existing = await db.getJob(id);
        if (!existing) return new Response(404, {}, { error: 'Job not found' });
        const updates = JSON.parse(request.requestBody) as Partial<Job>;
        const updated: Job = { ...existing, ...updates, updated_at: new Date().toISOString() };
        await db.putJob(updated);
        return new Response(200, {}, updated);
      });

      this.patch('/jobs/:id/reorder', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });
        const { fromOrder, toOrder } = JSON.parse(request.requestBody) as { fromOrder: number; toOrder: number };
        const jobs = (await db.getJobs()).sort((a,b)=>a.order-b.order);
        const [moved] = jobs.splice(fromOrder, 1);
        jobs.splice(toOrder, 0, moved);
        const updated = jobs.map((j, idx) => ({ ...j, order: idx, updated_at: new Date().toISOString() }));
        await db.putJobs(updated);
        return new Response(204);
      });

      // Candidates
      this.get("/candidates", async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        const search = request.queryParams?.search?.toLowerCase?.() ?? '';
        const stage = request.queryParams?.stage as string | undefined;
        const page = parseInt((request.queryParams?.page as string) ?? '1', 10);
        const pageSize = parseInt((request.queryParams?.pageSize as string) ?? '50', 10);
        const all = await db.getCandidates();
        let filtered = all.filter(c => (c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)));
        if (stage) {
          const normalized = stage === 'screen' ? ['screen', 'screening'] : [stage];
          filtered = filtered.filter(c => normalized.includes(c.stage as any));
        }
        filtered.sort((a,b)=>b.created_at.localeCompare(a.created_at));
        const from = (page-1)*pageSize;
        const data = filtered.slice(from, from+pageSize);
        return new Response(200, {}, { data, total: filtered.length });
      });

      this.get('/candidates/:id', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        const cand = await db.getCandidate(request.params.id as string);
        if (!cand) return new Response(404, {}, { error: 'Not found' });
        return new Response(200, {}, cand);
      });

      this.post('/candidates', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });
        const body = JSON.parse(request.requestBody) as Omit<Candidate,'id'|'created_at'|'updated_at'>;
        const now = new Date().toISOString();
        const cand: Candidate = { id: uuid(), created_at: now, updated_at: now, ...body };
        await db.putCandidate(cand);
        // timeline entry for stage
        const evt: TimelineEvent = { id: uuid(), candidate_id: cand.id, event_type: 'stage_change', from_stage: null, to_stage: cand.stage, note: null, created_at: now };
        await db.putTimelineEvent(evt);
        return new Response(200, {}, cand);
      });

      this.patch("/candidates/:id", async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });
        const id = request.params.id as string;
        const existing = await db.getCandidate(id);
        if (!existing) return new Response(404, {}, { error: 'Candidate not found' });
        const updates = JSON.parse(request.requestBody) as Partial<Candidate>;
        if (updates.stage && updates.stage !== existing.stage) {
          const evt: TimelineEvent = { id: uuid(), candidate_id: id, event_type: 'stage_change', from_stage: existing.stage, to_stage: updates.stage as any, note: null, created_at: new Date().toISOString() };
          await db.putTimelineEvent(evt);
        }
        const updated: Candidate = { ...existing, ...updates, updated_at: new Date().toISOString() };
        await db.putCandidate(updated);
        return new Response(200, {}, updated);
      });

      this.get('/candidates/:id/timeline', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        const all = await db.getTimeline();
        const list = all.filter(e => e.candidate_id === request.params.id).sort((a,b)=>b.created_at.localeCompare(a.created_at));
        return new Response(200, {}, list);
      });

      this.post('/candidates/:id/notes', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });
        const { note } = JSON.parse(request.requestBody) as { note: string };
        const evt: TimelineEvent = { id: uuid(), candidate_id: request.params.id as string, event_type: 'note_added', from_stage: null, to_stage: null, note, created_at: new Date().toISOString() };
        await db.putTimelineEvent(evt);
        return new Response(204);
      });

      // Assessments
      this.get('/assessments', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        const jobId = request.queryParams?.job_id as string;
        const all = await db.getAssessments();
        const found = all.find(a => a.job_id === jobId);
        return new Response(200, {}, found ?? null);
      });

      this.post('/assessments', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });
        const body = JSON.parse(request.requestBody) as { job_id: string; sections: Assessment['sections'] };
        const now = new Date().toISOString();
        const existing = (await db.getAssessments()).find(a => a.job_id === body.job_id);
        if (existing) {
          const updated: Assessment = { ...existing, sections: body.sections, updated_at: now };
          await db.putAssessment(updated);
          return new Response(200, {}, updated);
        } else {
          const assessment: Assessment = { id: uuid(), job_id: body.job_id, sections: body.sections, created_at: now, updated_at: now };
          await db.putAssessment(assessment);
          return new Response(200, {}, assessment);
        }
      });

      this.post('/assessment_responses', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        if (maybeFail()) return new Response(500, {}, { error: 'Simulated network error' });
        const body = JSON.parse(request.requestBody) as Omit<AssessmentResponse,'id'|'submitted_at'>;
        const now = new Date().toISOString();
        const resp: AssessmentResponse = { id: uuid(), submitted_at: now, ...body } as AssessmentResponse;
        await db.putAssessmentResponse(resp);
        const evt: TimelineEvent = { id: uuid(), candidate_id: body.candidate_id, event_type: 'assessment_completed', from_stage: null, to_stage: null, note: 'Completed assessment', created_at: now };
        await db.putTimelineEvent(evt);
        return new Response(200, {}, resp);
      });

      this.get('/assessment_responses', async (_schema, request) => {
        await sleep(200 + Math.random() * 1000);
        const { assessment_id, candidate_id } = request.queryParams as any;
        const all = await db.getAssessmentResponses();
        const found = all.find(r => r.assessment_id === assessment_id && r.candidate_id === candidate_id) ?? null;
        return new Response(200, {}, found);
      });

      // no passthrough
    },
  });

  return server;
}
