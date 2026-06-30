import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Clock, ExternalLink, Brain, Link2 } from 'lucide-react';

interface Props {
  verification: any;
  index: number;
  onTriggerVerification?: (id: string) => void;
  isLoading?: boolean;
}

export const VerificationCard = ({ verification: v, index, onTriggerVerification, isLoading }: Props) => {
  // Support both flat format (from new contract) and nested verdict format
  const status = v.status || v.verdict?.status || 'pending';
  const confidence = v.confidence || v.verdict?.confidence || '';
  const reasoning = v.reasoning || v.verdict?.reasoning || '';

  const cfg: Record<string, { icon: any; color: string; bg: string; border: string; label: string; labelBg: string }> = {
    verified:     { icon: CheckCircle,   color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Verified ✓',    labelBg: 'bg-emerald-100 text-emerald-800' },
    'false':      { icon: XCircle,       color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-200',     label: 'False ✗',       labelBg: 'bg-red-100 text-red-800' },
    unverifiable: { icon: AlertTriangle, color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: 'Unverifiable',  labelBg: 'bg-amber-100 text-amber-800' },
    pending:      { icon: Clock,         color: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200',    label: 'Pending',       labelBg: 'bg-gray-100 text-gray-800' },
  };
  const c = cfg[status] || cfg.pending;
  const Icon = c.icon;

  const confColor = confidence === 'high' ? 'text-emerald-600' : confidence === 'medium' ? 'text-amber-600' : 'text-red-600';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className={`${c.bg} ${c.border} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-xl ${c.bg}`}><Icon className={`w-6 h-6 ${c.color}`} /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.labelBg}`}>{c.label}</span>
              {confidence && <span className={`text-xs font-semibold ${confColor}`}>{confidence} confidence</span>}
            </div>
            <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-2">{v.headline}</h3>
            {v.source_url && (
              <a href={v.source_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-3">
                <Link2 className="w-4 h-4" />
                <span className="truncate max-w-xs">{v.source_url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            )}
            {reasoning && (
              <div className="bg-white/60 rounded-xl p-3 mt-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Brain className="w-4 h-4" />AI Analysis
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{reasoning}</p>
              </div>
            )}
            <div className="mt-3 text-xs text-gray-500">ID: #{v.id ?? index}</div>
          </div>
        </div>
        {status === 'pending' && onTriggerVerification && (
          <button onClick={() => onTriggerVerification(v.id ?? String(index))} disabled={isLoading}
            className="flex-shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl disabled:opacity-50">
            {isLoading ? 'Verifying…' : 'Verify Now'}
          </button>
        )}
      </div>
    </motion.div>
  );
};
