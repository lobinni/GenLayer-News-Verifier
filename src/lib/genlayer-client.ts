import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

// ══════════════════════════════════════════════════════════════
// ⚠️  THAY ĐỊA CHỈ CONTRACT MỚI VÀO ĐÂY SAU KHI DEPLOY
// ══════════════════════════════════════════════════════════════
export const CONTRACT_ADDRESS = '0xDcC18491F0ac7C09419249B9674CE8a756Ff7F91';

export const NETWORK = {
  name: 'GenLayer Bradbury Testnet',
  chainId: 4221,
  chainIdHex: '0x107d',
  token: 'GEN',
  rpc: 'https://rpc-bradbury.genlayer.com',
  explorer: 'https://explorer-bradbury.genlayer.com',
  faucet: 'https://testnet-faucet.genlayer.foundation',
};

export const explorerTx = (h: string) => `${NETWORK.explorer}/tx/${h}`;
export const explorerAddr = (a: string) => `${NETWORK.explorer}/address/${a}`;
export const explorerContract = () => explorerAddr(CONTRACT_ADDRESS);

// ── Direct RPC to Bradbury node ──
const rpc = async (method: string, params: unknown[] = []): Promise<any> => {
  const r = await fetch(NETWORK.rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
  });
  const j = await r.json();
  if (j.error) throw j.error;
  return j.result;
};

// ── Provider: MetaMask signs, Bradbury RPC provides data ──
const createProvider = () => {
  const mm = window.ethereum;
  if (!mm) throw new Error('MetaMask not installed');

  return {
    request: async ({ method, params = [] }: { method: string; params?: any[] }) => {
      if (method === 'eth_sendTransaction') {
        const tx = { ...(params as any[])[0] };
        if (!tx.gasPrice) {
          try { tx.gasPrice = await rpc('eth_gasPrice'); }
          catch { tx.gasPrice = '0x3B9ACA00'; }
        }
        if (!tx.gas) {
          try {
            tx.gas = await rpc('eth_estimateGas', [
              { from: tx.from, to: tx.to, data: tx.data, value: tx.value || '0x0' },
            ]);
          } catch { tx.gas = '0x30D40'; }
        }
        if (!tx.chainId) tx.chainId = NETWORK.chainIdHex;
        return mm.request({ method: 'eth_sendTransaction', params: [tx] });
      }

      if ([
        'eth_accounts', 'eth_requestAccounts', 'eth_chainId',
        'wallet_switchEthereumChain', 'wallet_addEthereumChain',
        'eth_signTypedData_v4', 'personal_sign',
      ].includes(method)) {
        return mm.request({ method, params });
      }

      return rpc(method, params as unknown[]);
    },
    on: (e: string, h: any) => mm.on?.(e, h),
    removeListener: (e: string, h: any) => mm.removeListener?.(e, h),
  };
};

// ── Client: MetaMask signs on Bradbury ──
export const createGLClient = (walletAddress: string) =>
  createClient({
    chain: testnetBradbury,
    account: walletAddress as `0x${string}`,
    provider: createProvider(),
  } as any);

// ── Read-only client ──
export const createGLReadClient = () =>
  createClient({ chain: testnetBradbury } as any);

// ── Balance ──
export const getBalanceRPC = async (addr: string): Promise<string> => {
  try {
    const hex = await rpc('eth_getBalance', [addr, 'latest']);
    return (Number(BigInt(hex)) / 1e18).toFixed(6);
  } catch { return '0'; }
};
