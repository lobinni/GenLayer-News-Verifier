import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react';

const contractCode = `# { "Depends": "py-genlayer:test" }

from genlayer import *
import json
import typing


class NewsVerifier(gl.Contract):
    headlines: TreeMap[str, str]
    sources: TreeMap[str, str]
    verdicts: TreeMap[str, str]
    count: int

    def __init__(self):
        self.count = 0

    @gl.public.write
    def submit_news(self, headline: str, source_url: str) -> typing.Any:
        news_id = str(self.count)
        self.headlines[news_id] = headline
        self.sources[news_id] = source_url
        self.verdicts[news_id] = json.dumps({
            "status": "pending", "confidence": 0, "reasoning": "",
        })
        self.count += 1
        return news_id

    @gl.public.write
    def verify_news(self, news_id: str) -> typing.Any:
        headline = self.headlines[news_id]
        source_url = self.sources[news_id]

        def analyze():
            web_data = gl.get_webpage(source_url, mode="text")
            task = f"""Fact-check: {headline}
Source: {source_url}
Content: {web_data[:3000]}
Return JSON: {{"status":"verified|false|unverifiable","confidence":0-100,"reasoning":"..."}}"""
            result = gl.exec_prompt(task)
            return json.dumps(json.loads(result), sort_keys=True)

        result_str = gl.eq_principle_strict_eq(analyze)
        self.verdicts[news_id] = result_str
        return json.loads(result_str)

    @gl.public.view
    def get_all_news(self) -> typing.Any:
        return [{"id": k, "headline": self.headlines[k],
                 "source_url": self.sources[k],
                 "verdict": json.loads(self.verdicts[k])}
                for k in self.headlines]`;

export const ContractCode = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(contractCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="bg-slate-900 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-white hover:bg-slate-800 transition-colors">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-400" />
          <span className="font-medium">View Intelligent Contract</span>
          <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">Python</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="border-t border-slate-700">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50">
                <span className="text-xs text-gray-400 font-mono">news_verifier.py</span>
                <div className="flex items-center gap-2">
                  <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
                    {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                  </button>
                  <a href="https://docs.genlayer.com/developers/intelligent-contracts" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
                    Docs <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <pre className="p-4 text-sm text-gray-300 overflow-x-auto max-h-96"><code>{contractCode}</code></pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
