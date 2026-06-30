import { NETWORK } from './genlayer-client';

export const isMetaMaskInstalled = (): boolean =>
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

export const getConnectedAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) return [];
  try { return await window.ethereum!.request({ method: 'eth_accounts' }) as string[]; }
  catch { return []; }
};

export const connectMetaMask = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) throw new Error('MetaMask is not installed');
  try {
    const accs = await window.ethereum!.request({ method: 'eth_requestAccounts' }) as string[];
    return accs.length > 0 ? accs[0] : null;
  } catch (e: any) {
    if (e.code === 4001) throw new Error('Connection rejected');
    throw e;
  }
};

export const isOnGenLayerNetwork = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) return false;
  try {
    const id = await window.ethereum!.request({ method: 'eth_chainId' }) as string;
    return id.toLowerCase() === NETWORK.chainIdHex.toLowerCase();
  } catch { return false; }
};

export const switchToGenLayerNetwork = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) return false;
  try {
    await window.ethereum!.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: NETWORK.chainIdHex }] });
    return true;
  } catch (e: any) {
    if (e.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: NETWORK.chainIdHex,
            chainName: NETWORK.name,
            nativeCurrency: { name: NETWORK.token, symbol: NETWORK.token, decimals: 18 },
            rpcUrls: [NETWORK.rpc],
            blockExplorerUrls: [NETWORK.explorer],
          }],
        });
        return true;
      } catch { return false; }
    }
    return false;
  }
};

export const onAccountsChanged = (cb: (a: string[]) => void): (() => void) => {
  if (!isMetaMaskInstalled()) return () => {};
  const h = (a: unknown) => cb(a as string[]);
  window.ethereum!.on('accountsChanged', h);
  return () => window.ethereum!.removeListener('accountsChanged', h);
};

export const onChainChanged = (cb: (c: string) => void): (() => void) => {
  if (!isMetaMaskInstalled()) return () => {};
  const h = (c: unknown) => cb(c as string);
  window.ethereum!.on('chainChanged', h);
  return () => window.ethereum!.removeListener('chainChanged', h);
};

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (a: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (e: string, h: (d: unknown) => void) => void;
      removeListener: (e: string, h: (d: unknown) => void) => void;
    };
  }
}
