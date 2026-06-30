import { useState, useEffect, useCallback } from 'react';
import { isMetaMaskInstalled, getConnectedAccounts, connectMetaMask, isOnGenLayerNetwork, switchToGenLayerNetwork, onAccountsChanged, onChainChanged } from '../lib/wallet';
import { getBalanceRPC, NETWORK } from '../lib/genlayer-client';

export const useWallet = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const inst = isMetaMaskInstalled(); setIsInstalled(inst);
      if (inst) {
        const accs = await getConnectedAccounts();
        if (accs.length > 0) {
          setAddress(accs[0]); setIsConnected(true);
          setIsCorrectNetwork(await isOnGenLayerNetwork());
          setBalance(await getBalanceRPC(accs[0]));
        }
      }
    })();
  }, []);

  useEffect(() => onAccountsChanged(async accs => {
    if (accs.length === 0) { setIsConnected(false); setAddress(null); setBalance('0'); }
    else { setAddress(accs[0]); setIsConnected(true); setBalance(await getBalanceRPC(accs[0])); }
  }), []);

  useEffect(() => onChainChanged(id =>
    setIsCorrectNetwork(id.toLowerCase() === NETWORK.chainIdHex.toLowerCase())
  ), []);

  const connect = useCallback(async () => {
    setIsConnecting(true); setError(null);
    try {
      const addr = await connectMetaMask();
      if (addr) {
        setAddress(addr); setIsConnected(true);
        const ok = await switchToGenLayerNetwork();
        setIsCorrectNetwork(ok || await isOnGenLayerNetwork());
        setBalance(await getBalanceRPC(addr));
      }
    } catch (e: any) { setError(e.message); }
    finally { setIsConnecting(false); }
  }, []);

  const disconnect = useCallback(() => { setIsConnected(false); setAddress(null); setBalance('0'); }, []);

  const switchNetwork = useCallback(async () => {
    setError(null);
    const ok = await switchToGenLayerNetwork();
    if (ok) { setIsCorrectNetwork(true); if (address) setBalance(await getBalanceRPC(address)); }
    else setError('Failed to switch network');
  }, [address]);

  const refreshBalance = useCallback(async () => {
    if (address) setBalance(await getBalanceRPC(address));
  }, [address]);

  return { isInstalled, isConnected, isCorrectNetwork, address, balance, isConnecting, error, connect, disconnect, switchNetwork, refreshBalance, clearError: () => setError(null) };
};
