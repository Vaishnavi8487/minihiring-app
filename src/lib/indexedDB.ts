import { openDB, type IDBPDatabase } from 'idb';
import type {
  Job,
  Candidate,
  Assessment,
  AssessmentResponse,
  TimelineEvent,
} from './database.types';

const DB_NAME = 'KanbanDB';
const DB_VERSION = 2;

type DBSchema = {
  jobs: Job;
  candidates: Candidate;
  assessments: Assessment;
  assessment_responses: AssessmentResponse;
  candidate_timeline: TimelineEvent;
};

export async function initDB(): Promise<IDBPDatabase<any>> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains('jobs')) {
        db.createObjectStore('jobs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('candidates')) {
        db.createObjectStore('candidates', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('assessments')) {
        db.createObjectStore('assessments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('assessment_responses')) {
        db.createObjectStore('assessment_responses', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('candidate_timeline')) {
        db.createObjectStore('candidate_timeline', { keyPath: 'id' });
      }
    },
  });
}

// Generic helpers
async function putMany<T>(storeName: keyof DBSchema, items: T[]) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  for (const item of items) await store.put(item);
  await tx.done;
}

async function getAll<T>(storeName: keyof DBSchema): Promise<T[]> {
  const db = await initDB();
  return db.getAll(storeName);
}

async function getById<T>(storeName: keyof DBSchema, id: string): Promise<T | undefined> {
  const db = await initDB();
  return db.get(storeName, id);
}

async function putOne<T>(storeName: keyof DBSchema, item: T) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  await tx.store.put(item);
  await tx.done;
}

async function clearStore(storeName: keyof DBSchema) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

// Domain-specific helpers
export const db = {
  putJobs: (jobs: Job[]) => putMany('jobs', jobs),
  putJob: (job: Job) => putOne('jobs', job),
  getJobs: () => getAll<Job>('jobs'),
  getJob: (id: string) => getById<Job>('jobs', id),
  clearJobs: () => clearStore('jobs'),

  putCandidates: (candidates: Candidate[]) => putMany('candidates', candidates),
  putCandidate: (candidate: Candidate) => putOne('candidates', candidate),
  getCandidates: () => getAll<Candidate>('candidates'),
  getCandidate: (id: string) => getById<Candidate>('candidates', id),
  clearCandidates: () => clearStore('candidates'),

  putAssessments: (assessments: Assessment[]) => putMany('assessments', assessments),
  putAssessment: (assessment: Assessment) => putOne('assessments', assessment),
  getAssessments: () => getAll<Assessment>('assessments'),
  getAssessment: (id: string) => getById<Assessment>('assessments', id),
  clearAssessments: () => clearStore('assessments'),

  putAssessmentResponses: (responses: AssessmentResponse[]) => putMany('assessment_responses', responses),
  putAssessmentResponse: (response: AssessmentResponse) => putOne('assessment_responses', response),
  getAssessmentResponses: () => getAll<AssessmentResponse>('assessment_responses'),
  clearAssessmentResponses: () => clearStore('assessment_responses'),

  putTimelineEvents: (events: TimelineEvent[]) => putMany('candidate_timeline', events),
  putTimelineEvent: (event: TimelineEvent) => putOne('candidate_timeline', event),
  getTimeline: () => getAll<TimelineEvent>('candidate_timeline'),
  clearTimeline: () => clearStore('candidate_timeline'),
};

