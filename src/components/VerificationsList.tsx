import { motion } from 'framer-motion';
import { RefreshCw, FileSearch, Inbox } from 'lucide-react';
import { VerificationCard } from './VerificationCard';

interface VerificationResult {
  id?: string;
  headline: string;
  source_url: string;
  verdict: { status: string; confidence: number; reasoning: string };
}

interface Props {
  verifications: VerificationResult[];
  isLoading: boolean;
  onRefresh: () => void;
  onTriggerVerification: (id: string) => void;
}

export const VerificationsList = ({ verifications, isLoading, onRefresh, onTriggerVerification }: Props) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FileSearch className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-900">Verification History</h2>
        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">{verifications.length}</span>
      </div>
      <button onClick={onRefresh} disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl disabled:opacity-50">
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>
    {verifications.length === 0 ? (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Verifications Yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto">Submit a news headline above to have it verified by GenLayer's AI validators.</p>
      </motion.div>
    ) : (
      <div className="space-y-4">
        {verifications.map((v, i) => (
          <VerificationCard key={v.id ?? i} verification={v} index={i}
            onTriggerVerification={onTriggerVerification} isLoading={isLoading} />
        ))}
      </div>
    )}
  </motion.div>
);
