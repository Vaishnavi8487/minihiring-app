import { useState, useEffect } from 'react';
import { Mail, User, X } from 'lucide-react';
import { candidatesApi } from '../lib/api';
import type { Candidate, CandidateStage } from '../lib/database.types';
import { db } from '../lib/indexedDB'; 

const STAGES: { id: CandidateStage; title: string; color: string }[] = [
  { id: 'applied', title: 'Applied', color: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/40' },
  { id: 'screen', title: 'Screening', color: 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/40' },
  { id: 'tech', title: 'Technical', color: 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/40' },
  { id: 'offer', title: 'Offer', color: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/40' },
  { id: 'hired', title: 'Hired', color: 'border-green-400 bg-green-100 dark:border-green-700 dark:bg-green-950/50' },
  { id: 'rejected', title: 'Rejected', color: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/40' }
];

// 🆕 Candidate Details Modal
function CandidateModal({ candidate, onClose }: { candidate: Candidate | null; onClose: () => void }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 relative text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{candidate.name}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4" />
              <span>{candidate.email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p>
            <span className="font-medium">Stage:</span>{' '}
            <span className="capitalize">{candidate.stage}</span>
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            This candidate is currently in the <strong>{candidate.stage}</strong> stage.  
            You can drag them to another column to update their progress.
          </p>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 🧩 Candidate Card
function CandidateCard({ candidate, onClick }: { candidate: Candidate; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">
            {candidate.name}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <Mail className="w-3 h-3" />
            <span className="truncate">{candidate.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧱 Kanban Column
function Column({
  stage,
  candidates,
  onDrop,
  onCardClick
}: {
  stage: typeof STAGES[0];
  candidates: Candidate[];
  onDrop: (id: string, newStage: CandidateStage) => void;
  onCardClick: (candidate: Candidate) => void;
}) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className={`rounded-lg border-2 ${stage.color} h-full flex flex-col`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-white">{stage.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{candidates.length} candidates</p>
        </div>

        <div
          className="flex-1 p-4 space-y-3 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const candidateId = e.dataTransfer.getData('candidateId');
            if (candidateId) onDrop(candidateId, stage.id);
          }}
        >
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('candidateId', candidate.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
            >
              <CandidateCard candidate={candidate} onClick={() => onCardClick(candidate)} />
            </div>
          ))}

          {candidates.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              No candidates in this stage
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🏗️ Main Kanban Page
export function KanbanPage() {
  const [candidatesByStage, setCandidatesByStage] = useState<Record<CandidateStage, Candidate[]>>({
    applied: [],
    screen: [],
    tech: [],
    offer: [],
    hired: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      setLoading(true);
      setError(null);

      // Load from IndexedDB
      const cached = await db.getCandidates();
      if (cached.length > 0) {
        const byStage: Record<CandidateStage, Candidate[]> = {
          applied: [],
          screen: [],
          tech: [],
          offer: [],
          hired: [],
          rejected: []
        };
        cached.forEach((c) => byStage[c.stage].push(c));
        setCandidatesByStage(byStage);
      }

      // Fetch from API
      const results = await Promise.all(
        STAGES.map((stage) =>
          candidatesApi.getCandidates({ stage: stage.id, page: 1, pageSize: 100 })
        )
      );

      const byStage: Record<CandidateStage, Candidate[]> = {
        applied: [],
        screen: [],
        tech: [],
        offer: [],
        hired: [],
        rejected: []
      };

      STAGES.forEach((stage, index) => {
        byStage[stage.id] = results[index].data;
      });

      setCandidatesByStage(byStage);

      await db.clearCandidates();
      await db.putCandidates(Object.values(byStage).flat());
    } catch (err) {
      setError('Failed to load candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDrop(candidateId: string, newStage: CandidateStage) {
    const currentStage = STAGES.find((s) =>
      candidatesByStage[s.id].some((c) => c.id === candidateId)
    );

    if (!currentStage || currentStage.id === newStage) return;

    const candidate = candidatesByStage[currentStage.id].find((c) => c.id === candidateId);
    if (!candidate) return;

    const newByStage = { ...candidatesByStage };
    newByStage[currentStage.id] = newByStage[currentStage.id].filter((c) => c.id !== candidateId);
    newByStage[newStage] = [...newByStage[newStage], { ...candidate, stage: newStage }];

    setCandidatesByStage(newByStage);

    try {
      await candidatesApi.updateCandidate(candidateId, { stage: newStage });
      await db.clearCandidates();
      await db.putCandidates(Object.values(newByStage).flat());
    } catch (err) {
      setError('Failed to update candidate. Reverting changes.');
      setCandidatesByStage(candidatesByStage);
      setTimeout(() => setError(null), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900 dark:text-white transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">
          Drag candidates between stages to update their status
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            stage={stage}
            candidates={candidatesByStage[stage.id]}
            onDrop={handleDrop}
            onCardClick={setSelectedCandidate}
          />
        ))}
      </div>

      <CandidateModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
}
