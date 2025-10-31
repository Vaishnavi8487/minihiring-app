import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Mail, User, Upload, X } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { candidatesApi } from '../lib/api';
import type { Candidate, CandidateStage } from '../lib/database.types';

const STAGES: { value: CandidateStage | ''; label: string }[] = [
  { value: '', label: 'All Stages' },
  { value: 'applied', label: 'Applied' },
  { value: 'screen', label: 'Screen' },
  { value: 'tech', label: 'Technical' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const STAGE_COLORS: Record<CandidateStage, string> = {
  applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  screen: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
  tech: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  offer: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  hired: 'bg-green-200 text-green-800 dark:bg-green-950 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<CandidateStage | ''>('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  useEffect(() => {
    setCandidates([]);
    setPage(1);
    setHasMore(true);
    loadCandidates(1, true);
  }, [search, stageFilter]);

  useEffect(() => {
    if (page > 1) {
      loadCandidates(page, false);
    }
  }, [page]);

  async function loadCandidates(pageNum: number, reset: boolean) {
    try {
      setLoading(true);
      const result = await candidatesApi.getCandidates({
        search,
        stage: stageFilter || undefined,
        page: pageNum,
        pageSize: 50,
      });

      if (reset) {
        setCandidates(result.data);
      } else {
        setCandidates(prev => [...prev, ...result.data]);
      }

      setHasMore(result.data.length === 50);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

    if (bottom && !loading && hasMore) {
      setPage(p => p + 1);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Browse and manage candidate applications
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
        >
          <Upload className="w-4 h-4" /> Upload Resume
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-slate-400 dark:text-slate-300 w-5 h-5" />
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value as CandidateStage | '')}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {STAGES.map(stage => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidate list */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-4">
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Showing {candidates.length} candidates
          {search || stageFilter ? ' (filtered)' : ''}
        </div>

        <div
          ref={parentRef}
          onScroll={handleScroll}
          className="h-[600px] overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map(virtualRow => {
              const candidate = candidates[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Link
                    to={`/candidates/${candidate.id}`}
                    className="block h-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {candidate.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          STAGE_COLORS[candidate.stage]
                        }`}
                      >
                        {candidate.stage}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && <ResumeUploadModal onClose={() => setShowUploadModal(false)} />}
    </div>
  );
}

/* -------------------------------------------------
   📄 Mock Resume Upload Modal
--------------------------------------------------*/
function ResumeUploadModal({ onClose }: { onClose: () => void }) {
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      alert('Only .pdf or .docx files allowed');
      return;
    }
    setFileName(file.name);
    setParsing(true);

    setTimeout(() => {
      setForm({
        name: 'vaishnavi',
        email: '22bcs134@iiitdwd.ac.in',
      });
      setParsing(false);
    }, 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md p-6 relative text-slate-900 dark:text-white">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">AI Resume Parser</h2>

        <label className="block mb-4">
          <span className="font-medium">Upload Resume (.pdf / .docx)</span>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileUpload}
            className="mt-2 w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </label>

        {fileName && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Selected File: <span className="font-medium">{fileName}</span>
          </p>
        )}

        {parsing ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3">Parsing resume...</p>
          </div>
        ) : (
          form.name && (
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => alert('Candidate data saved (mock)!')}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Save Candidate
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
