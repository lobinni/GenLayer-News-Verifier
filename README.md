# 🔍 GenLayer News Verifier

> AI-Powered Fact Checking dApp built on GenLayer Intelligent Contracts

![GenLayer](https://img.shields.io/badge/GenLayer-Bradbury_Testnet-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)

## 📖 Overview

GenLayer News Verifier is a decentralized fact-checking application that uses **GenLayer Intelligent Contracts** to verify news headlines. AI validators fetch source webpages, analyze content, and reach consensus on whether a headline is true, false, or unverifiable — all on-chain.

### Key GenLayer Features Used

- **`gl.nondet.web.render()`** — Fetch real-time web content on-chain
- **`gl.nondet.exec_prompt()`** — AI/LLM-powered analysis
- **`gl.vm.run_nondet_unsafe()`** — Leader-validator consensus pattern
- **`gl.vm.Return`** — Structured validation of non-deterministic results

## 🔗 Live Contract

| Property | Value |
|----------|-------|
| **Contract** | [`0xDcC18491F0ac7C09419249B9674CE8a756Ff7F91`](https://explorer-bradbury.genlayer.com/address/0xDcC18491F0ac7C09419249B9674CE8a756Ff7F91) |
| **Network** | GenLayer Bradbury Testnet |
| **Chain ID** | 4221 |
| **Explorer** | [explorer-bradbury.genlayer.com](https://explorer-bradbury.genlayer.com) |

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Blockchain**: GenLayer Bradbury Testnet
- **SDK**: genlayer-js + MetaMask
- **Contract**: Python (GenLayer Intelligent Contract)

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MetaMask browser extension
- GEN tokens ([get free from faucet](https://testnet-faucet.genlayer.foundation))

### Install & Run

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/genlayer-news-verifier.git
cd genlayer-news-verifier

# Install
npm install

# Dev
npm run dev

# Build
npm run build
```

## 📁 Project Structure

```
├── contracts/
│   └── news_verifier.py        # Intelligent Contract (deploy on Studio)
├── src/
│   ├── lib/
│   │   ├── genlayer-client.ts   # GenLayer SDK + MetaMask provider
│   │   └── wallet.ts            # MetaMask connection
│   ├── hooks/
│   │   ├── useGenLayer.ts       # Contract interaction hook
│   │   └── useWallet.ts         # Wallet state hook
│   ├── components/              # React UI components
│   └── App.tsx
├── index.html
└── package.json
```

## 📝 Intelligent Contract

The contract uses GenLayer's unique AI capabilities:

```python
# Leader function: fetch web + AI analysis
def leader_fn() -> str:
    page = gl.nondet.web.render(source_url, mode="text")
    result = gl.nondet.exec_prompt(prompt, response_format="json")
    return json.dumps(result)

# Validator function: verify leader's output
def validator_fn(leader_result) -> bool:
    data = json.loads(leader_result.calldata)
    return data["status"] in ("verified", "false", "unverifiable")

# Consensus
return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
```

## 🔧 Deploy Your Own Contract

1. Open [studio.genlayer.com/contracts](https://studio.genlayer.com/contracts)
2. Create `news_verifier.py` → paste code from `contracts/news_verifier.py`
3. Select **Testnet Bradbury** → **Deploy**
4. Copy contract address → update `src/lib/genlayer-client.ts`
5. `npm run build`

## 📚 Links

- [GenLayer Docs](https://docs.genlayer.com)
- [GenLayer Studio](https://studio.genlayer.com)
- [Bradbury Explorer](https://explorer-bradbury.genlayer.com)
- [Faucet](https://testnet-faucet.genlayer.foundation)

## 📄 License

MIT
