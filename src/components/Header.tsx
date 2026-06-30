import { motion } from 'framer-motion';
import { Shield, ExternalLink, Wallet, RefreshCw, LogOut, AlertTriangle, Gift } from 'lucide-react';
import { NETWORK } from '../lib/genlayer-client';

interface Props {
  isInstalled: boolean; isConnected: boolean; isCorrectNetwork: boolean;
  address: string | null; balance: string; isConnecting: boolean; walletError: string | null;
  onConnect: () => Promise<void>; onDisconnect: () => void;
  onSwitchNetwork: () => Promise<void>; onRefreshBalance: () => Promise<void>;
  contractAddress: string; contractExplorerUrl: string;
}

export const Header = (p: Props) => {
  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
  const fmtBal = (b: string) => { const n = parseFloat(b); return n === 0 ? '0' : n < 0.0001 ? '<0.0001' : n.toFixed(4); };
  const hasBalance = parseFloat(p.balance) > 0;

  return (
    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', duration: 0.8 }}
              className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-3 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">GenLayer News Verifier</h1>
              <p className="text-sm text-indigo-200">AI Fact Checking · Bradbury Testnet</p>
            </div>
          </div>
          <a href={p.contractExplorerUrl} target="_blank" rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
            <span className="text-indigo-200">Contract:</span>
            <span className="font-mono text-white">{short(p.contractAddress)}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-4 flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-800/50 rounded-full text-sm">
            <div className={`w-2 h-2 rounded-full ${p.isConnected && p.isCorrectNetwork ? 'bg-green-400' : 'bg-yellow-400'}`} />
            <span className="text-indigo-200">{NETWORK.name}</span>
            <span className="text-indigo-400 font-mono text-xs">#{NETWORK.chainId}</span>
          </div>
          {!p.isInstalled ? (
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-lg text-orange-200">
              <Wallet className="w-4 h-4" />Install MetaMask</a>
          ) : !p.isConnected ? (
            <button onClick={p.onConnect} disabled={p.isConnecting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-medium shadow-lg disabled:opacity-50">
              {p.isConnecting ? <><RefreshCw className="w-4 h-4 animate-spin" />Connecting…</> : <><Wallet className="w-4 h-4" />Connect Wallet</>}</button>
          ) : !p.isCorrectNetwork ? (
            <button onClick={p.onSwitchNetwork}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-lg text-amber-200">
              <AlertTriangle className="w-4 h-4" />Switch to Bradbury</button>
          ) : (<>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-sm">
              <Wallet className="w-4 h-4 text-emerald-400" /><span className="font-mono text-white">{short(p.address!)}</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /></div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm">
              <span className={`font-mono font-semibold ${hasBalance ? 'text-emerald-400' : 'text-red-400'}`}>{fmtBal(p.balance)} GEN</span>
              <button onClick={p.onRefreshBalance} className="p-0.5 hover:bg-white/10 rounded"><RefreshCw className="w-3.5 h-3.5 text-indigo-300" /></button></div>
            {!hasBalance && <a href={NETWORK.faucet} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/30 border border-amber-400/40 rounded-lg text-sm text-amber-200">
              <Gift className="w-4 h-4" />Get GEN<ExternalLink className="w-3 h-3" /></a>}
            <button onClick={p.onDisconnect} className="p-2 hover:bg-white/10 rounded-lg"><LogOut className="w-4 h-4 text-gray-400" /></button>
          </>)}
        </div>
        {p.walletError && <div className="mt-2 text-sm text-red-300 bg-red-500/20 px-3 py-1.5 rounded-lg inline-block">{p.walletError}</div>}
      </div>
    </motion.header>
  );
};
