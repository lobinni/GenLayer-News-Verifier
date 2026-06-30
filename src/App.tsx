import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { SubmitNewsForm } from './components/SubmitNewsForm';
import { TransactionStatus } from './components/TransactionStatus';
import { VerificationsList } from './components/VerificationsList';
import { NetworkInfo } from './components/NetworkInfo';
import { HowItWorks } from './components/HowItWorks';
import { DemoMode } from './components/DemoMode';
import { ContractCode } from './components/ContractCode';
import { useGenLayer } from './hooks/useGenLayer';
import { Sparkles, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';

export default function App() {
  const [showDemo, setShowDemo] = useState(true);
  const gl = useGenLayer();
  const w = gl.wallet;

  useEffect(() => { if (!showDemo) gl.readContractState(); }, [showDemo, gl.readContractState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header
        isInstalled={w.isInstalled}
        isConnected={w.isConnected}
        isCorrectNetwork={w.isCorrectNetwork}
        address={w.address}
        balance={w.balance}
        isConnecting={w.isConnecting}
        walletError={w.error}
        onConnect={w.connect}
        onDisconnect={w.disconnect}
        onSwitchNetwork={w.switchNetwork}
        onRefreshBalance={w.refreshBalance}
        contractAddress={gl.contractAddress}
        contractExplorerUrl={gl.contractExplorerUrl}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!w.isConnected && !showDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Wallet not connected</p>
              <p className="text-sm">Connect MetaMask to interact with the contract on GenLayer.</p>
            </div>
          </motion.div>
        )}

        {w.isConnected && !w.isCorrectNetwork && !showDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div><p className="font-medium">Wrong Network</p><p className="text-sm">Switch to GenLayer Testnet (4221)</p></div>
            <button onClick={w.switchNetwork} className="ml-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">Switch</button>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-4 mb-8">
          <button onClick={() => setShowDemo(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${showDemo ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Sparkles className="w-4 h-4" /> Demo
          </button>
          <button onClick={() => setShowDemo(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${!showDemo ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            {!showDemo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />} Live
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {gl.lastTx && !showDemo && <TransactionStatus tx={gl.lastTx} onClose={gl.clearTx} />}
            <SubmitNewsForm onSubmit={gl.submitNews} isLoading={gl.isLoading} error={showDemo ? null : gl.error}
              isWalletConnected={!!gl.isWalletReady} />
            {showDemo ? <DemoMode /> : (
              <VerificationsList verifications={gl.newsList as any} isLoading={gl.isLoading}
                onRefresh={gl.readContractState} onTriggerVerification={gl.triggerVerification} />
            )}
          </div>
          <div className="space-y-6">
            <HowItWorks />
            <ContractCode />
            <NetworkInfo walletAddress={w.address} />
          </div>
        </div>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-2">Built with ❤️ using <a href="https://genlayer.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">GenLayer</a> Intelligent Contracts</p>
          <p>Contract: <a href={gl.contractExplorerUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-indigo-600 hover:text-indigo-800">{gl.contractAddress}</a></p>
        </motion.footer>
      </main>
    </div>
  );
}
