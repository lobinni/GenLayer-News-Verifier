import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle, Clock, XCircle, X, Gift } from 'lucide-react';
import { NETWORK } from '../lib/genlayer-client';

interface TxResult { hash: string; explorerUrl: string; status: 'pending' | 'success' | 'error'; message?: string; }
interface Props { tx: TxResult | null; onClose: () => void; }

const cfg = {
  pending: { icon: Clock, bg: 'bg-amber-50', border: 'border-amber-200', ic: 'text-amber-500', title: 'Transaction Pending' },
  success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', ic: 'text-emerald-500', title: 'Transaction Successful' },
  error:   { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', ic: 'text-red-500', title: 'Transaction Failed' },
};

export const TransactionStatus = ({ tx, onClose }: Props) => {
  if (!tx) return null;
  const c = cfg[tx.status]; const Icon = c.icon;
  const showFaucet = tx.message?.toLowerCase().includes('insufficient') || tx.message?.toLowerCase().includes('gen');

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className={`${c.bg} ${c.border} border rounded-2xl p-4 shadow-lg`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 mt-0.5 ${c.ic}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{c.title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{tx.message}</p>
            {tx.hash && (
              <a href={tx.explorerUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                <span className="font-mono">{tx.hash.slice(0, 10)}…{tx.hash.slice(-8)}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {showFaucet && tx.status === 'error' && (
              <a href={NETWORK.faucet} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 mt-3 p-2 bg-amber-100 rounded-lg text-amber-800 hover:bg-amber-200">
                <Gift className="w-4 h-4" /><span className="text-sm font-medium">Get Free GEN</span><ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
          </div>
        </div>
        {tx.status === 'pending' && (
          <div className="mt-3 h-1 bg-amber-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-amber-500 w-1/2" initial={{ x: '-100%' }} animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
