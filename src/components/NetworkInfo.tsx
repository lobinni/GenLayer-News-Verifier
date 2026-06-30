import { motion } from 'framer-motion';
import { Network, Cpu, Database, Globe, ExternalLink, Info, Zap, Gift } from 'lucide-react';
import { CONTRACT_ADDRESS, NETWORK, explorerAddr } from '../lib/genlayer-client';

interface Props { walletAddress: string | null; }

export const NetworkInfo = ({ walletAddress }: Props) => {
  const details = [
    { label: 'Network', value: NETWORK.name, icon: Network },
    { label: 'Chain ID', value: `${NETWORK.chainId} (${NETWORK.chainIdHex})`, icon: Cpu },
    { label: 'Token', value: NETWORK.token, icon: Database },
    { label: 'RPC', value: NETWORK.rpc, icon: Globe },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-indigo-400" /><h2 className="text-lg font-bold">Bradbury Testnet</h2></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {details.map((d, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5"><d.icon className="w-3.5 h-3.5" />{d.label}</div>
            <div className="font-mono text-sm truncate">{d.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-indigo-500/20 rounded-xl p-4 mb-3">
        <div className="flex items-center gap-1.5 text-indigo-300 text-xs mb-1"><Zap className="w-3.5 h-3.5" />Contract</div>
        <a href={explorerAddr(CONTRACT_ADDRESS)} target="_blank" rel="noopener noreferrer"
          className="font-mono text-sm break-all hover:text-indigo-300 flex items-center gap-1">
          {CONTRACT_ADDRESS}<ExternalLink className="w-3 h-3 flex-shrink-0" /></a>
      </div>
      {walletAddress && (
        <div className="bg-emerald-500/20 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-1.5 text-emerald-300 text-xs mb-1"><Globe className="w-3.5 h-3.5" />Your Wallet</div>
          <a href={explorerAddr(walletAddress)} target="_blank" rel="noopener noreferrer"
            className="font-mono text-sm break-all hover:text-emerald-300 flex items-center gap-1">
            {walletAddress}<ExternalLink className="w-3 h-3 flex-shrink-0" /></a>
        </div>
      )}
      <a href={NETWORK.faucet} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-4 hover:bg-amber-500/30">
        <Gift className="w-5 h-5 text-amber-400" />
        <div><div className="font-medium text-amber-200 text-sm">Get Free GEN</div><div className="text-xs text-amber-300/70">Fund your wallet via faucet</div></div>
        <ExternalLink className="w-4 h-4 text-amber-400 ml-auto" /></a>
      <div className="flex flex-wrap gap-2 text-sm">
        {[{ l: 'Explorer', h: NETWORK.explorer }, { l: 'Faucet', h: NETWORK.faucet }, { l: 'Docs', h: 'https://docs.genlayer.com' }].map((x, i) => (
          <span key={i}>{i > 0 && <span className="text-slate-600 mr-1">•</span>}
            <a href={x.h} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-100">{x.l}<ExternalLink className="w-3 h-3 inline ml-0.5" /></a>
          </span>
        ))}
      </div>
    </motion.div>
  );
};
