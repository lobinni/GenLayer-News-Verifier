import { motion } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Brain,
  ExternalLink,
  Link2
} from 'lucide-react';

interface DemoVerification {
  headline: string;
  source_url: string;
  status: 'verified' | 'false' | 'unverifiable';
  confidence: number;
  reasoning: string;
}

export const DemoMode = () => {
  const demoVerifications: DemoVerification[] = [
    {
      headline: "Bitcoin surpasses $100,000 for the first time in history",
      source_url: "https://www.coindesk.com/price/bitcoin",
      status: 'verified',
      confidence: 95,
      reasoning: "Cross-referenced with multiple financial data sources including CoinGecko, CoinMarketCap, and Bloomberg. Price data confirmed across all sources with consistent values."
    },
    {
      headline: "Ethereum moves to Proof of Authority consensus",
      source_url: "https://example.com/fake-news",
      status: 'false',
      confidence: 98,
      reasoning: "This claim contradicts verified information from ethereum.org and official Ethereum Foundation communications. Ethereum uses Proof of Stake (not Proof of Authority) since The Merge in September 2022."
    },
    {
      headline: "New quantum computing breakthrough enables instant blockchain hacking",
      source_url: "https://unknown-source.xyz/article",
      status: 'unverifiable',
      confidence: 45,
      reasoning: "The source website is not recognized as a credible news outlet. No corroborating evidence found from established tech publications or academic sources. Claims require peer-reviewed verification."
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          label: 'Verified True',
          labelBg: 'bg-emerald-100 text-emerald-800'
        };
      case 'false':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Verified False',
          labelBg: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          label: 'Unverifiable',
          labelBg: 'bg-amber-100 text-amber-800'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl">
        <Sparkles className="w-5 h-5 text-amber-600" />
        <span className="text-sm font-medium text-amber-800">
          Demo Mode: Sample verifications showing how the system works
        </span>
      </div>

      <div className="space-y-4">
        {demoVerifications.map((verification, index) => {
          const config = getStatusConfig(verification.status);
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${config.bgColor} ${config.borderColor} border rounded-2xl p-6 shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${config.bgColor}`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.labelBg}`}>
                      {config.label}
                    </span>
                    <span className={`text-xs font-medium ${
                      verification.confidence >= 80 ? 'text-emerald-600' : 
                      verification.confidence >= 50 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {verification.confidence}% confidence
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-2">
                    {verification.headline}
                  </h3>

                  <a
                    href={verification.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors mb-3"
                  >
                    <Link2 className="w-4 h-4" />
                    <span className="truncate max-w-xs">{verification.source_url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>

                  <div className="bg-white/60 rounded-xl p-3 mt-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Brain className="w-4 h-4" />
                      AI Analysis
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {verification.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
