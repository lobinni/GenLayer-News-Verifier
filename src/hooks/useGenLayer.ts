import { useState, useCallback } from 'react';
import { TransactionStatus } from 'genlayer-js/types';
import { createGLClient, createGLReadClient, CONTRACT_ADDRESS, explorerTx, explorerContract, NETWORK } from '../lib/genlayer-client';
import { useWallet } from './useWallet';

export interface NewsEntry {
  id?: string;
  headline: string;
  source_url: string;
  status: string;
  confidence: string;
  reasoning: string;
  submitter?: string;
}

export interface TxResult {
  hash: string;
  explorerUrl: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export const useGenLayer = () => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsList, setNewsList] = useState<NewsEntry[]>([]);
  const [lastTx, setLastTx] = useState<TxResult | null>(null);
  const isWalletReady = wallet.isConnected && wallet.isCorrectNetwork && wallet.address;

  const readContractState = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const c = createGLReadClient();
      const r = await c.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'get_all_news',
        args: [],
      });
      if (Array.isArray(r)) setNewsList(r as unknown as NewsEntry[]);
    } catch (e: any) {
      console.error('Read:', e);
      setNewsList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitNews = useCallback(async (headline: string, sourceUrl: string): Promise<TxResult | null> => {
    if (!isWalletReady || !wallet.address) {
      setError('Kết nối ví và chuyển sang GenLayer Bradbury Testnet');
      return null;
    }
    setIsLoading(true); setError(null);
    try {
      const c = createGLClient(wallet.address);
      const h = await c.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'submit_news',
        args: [headline, sourceUrl],
        value: BigInt(0),
      });
      const res: TxResult = { hash: h, explorerUrl: explorerTx(h), status: 'pending', message: 'Transaction submitted…' };
      setLastTx(res);
      try {
        await c.waitForTransactionReceipt({ hash: h, status: TransactionStatus.ACCEPTED, retries: 30, interval: 5000 });
        res.status = 'success'; res.message = 'News submitted!';
        setLastTx({ ...res }); await readContractState(); wallet.refreshBalance();
      } catch {
        res.message = 'Processing by validators…'; setLastTx({ ...res });
      }
      return res;
    } catch (e: any) {
      let m = e.message || 'Failed';
      if (m.includes('denied') || m.includes('rejected')) m = 'Rejected in MetaMask';
      else if (m.includes('insufficient')) m = `Không đủ GEN. Faucet: ${NETWORK.faucet}`;
      setError(m); setLastTx({ hash: '', explorerUrl: '', status: 'error', message: m });
      return null;
    } finally { setIsLoading(false); }
  }, [isWalletReady, wallet.address, wallet.refreshBalance, readContractState]);

  const triggerVerification = useCallback(async (newsId: string): Promise<TxResult | null> => {
    if (!isWalletReady || !wallet.address) {
      setError('Kết nối ví trước');
      return null;
    }
    setIsLoading(true); setError(null);
    try {
      const c = createGLClient(wallet.address);
      const h = await c.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'verify_news',
        args: [newsId],
        value: BigInt(0),
      });
      const res: TxResult = { hash: h, explorerUrl: explorerTx(h), status: 'pending', message: 'AI verification (30-90s)…' };
      setLastTx(res);
      try {
        await c.waitForTransactionReceipt({ hash: h, status: TransactionStatus.ACCEPTED, retries: 60, interval: 5000 });
        res.status = 'success'; res.message = 'Verified!';
        setLastTx({ ...res }); await readContractState(); wallet.refreshBalance();
      } catch {
        res.message = 'Still processing…'; setLastTx({ ...res });
      }
      return res;
    } catch (e: any) {
      setError(e.message);
      setLastTx({ hash: '', explorerUrl: '', status: 'error', message: e.message });
      return null;
    } finally { setIsLoading(false); }
  }, [isWalletReady, wallet.address, wallet.refreshBalance, readContractState]);

  return {
    wallet, isWalletReady, isLoading, error,
    newsList, lastTx,
    contractAddress: CONTRACT_ADDRESS,
    contractExplorerUrl: explorerContract(),
    readContractState, submitNews, triggerVerification,
    clearError: () => setError(null),
    clearTx: () => setLastTx(null),
  };
};
