import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Newspaper, Link, AlertCircle, Wallet } from 'lucide-react';

interface SubmitNewsFormProps {
  onSubmit: (headline: string, sourceUrl: string) => Promise<unknown>;
  isLoading: boolean;
  error: string | null;
  isWalletConnected?: boolean;
}

export const SubmitNewsForm = ({ onSubmit, isLoading, error, isWalletConnected = true }: SubmitNewsFormProps) => {
  const [headline, setHeadline] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !sourceUrl.trim()) return;
    
    await onSubmit(headline.trim(), sourceUrl.trim());
    setHeadline('');
    setSourceUrl('');
  };

  // Sample news for demo
  const sampleNews = [
    {
      headline: "Bitcoin reaches new all-time high above $100,000",
      url: "https://www.coindesk.com/price/bitcoin"
    },
    {
      headline: "GenLayer launches AI-powered smart contracts on testnet",
      url: "https://www.genlayer.com/news"
    },
    {
      headline: "Ethereum completes major network upgrade",
      url: "https://ethereum.org"
    }
  ];

  const fillSample = (sample: typeof sampleNews[0]) => {
    setHeadline(sample.headline);
    setSourceUrl(sample.url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Submit News for Verification
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          Let GenLayer's AI validators check the authenticity of news
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Wallet Warning */}
        {!isWalletConnected && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
            <Wallet className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Connect your wallet and switch to GenLayer Testnet to submit news.</span>
          </div>
        )}

        {/* Sample News Buttons */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Try with sample news:</p>
          <div className="flex flex-wrap gap-2">
            {sampleNews.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => fillSample(sample)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full transition-colors"
              >
                {sample.headline.slice(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        {/* Headline Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            News Headline
          </label>
          <div className="relative">
            <Newspaper className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter the news headline to verify..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              disabled={isLoading || !isWalletConnected}
            />
          </div>
        </div>

        {/* Source URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/news-article"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              disabled={isLoading || !isWalletConnected}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !headline.trim() || !sourceUrl.trim() || !isWalletConnected}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Transaction...
            </>
          ) : !isWalletConnected ? (
            <>
              <Wallet className="w-5 h-5" />
              Connect Wallet to Submit
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit for AI Verification
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
