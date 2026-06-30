import { motion } from 'framer-motion';
import { 
  Upload, 
  Brain, 
  Users, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Submit News',
      description: 'Enter a news headline and its source URL for verification',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'GenLayer validators use LLMs to analyze and cross-reference the news',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Consensus',
      description: 'Multiple validators reach consensus using Optimistic Democracy',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: CheckCircle2,
      title: 'Verdict',
      description: 'The final verification result is stored on-chain immutably',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-lg`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              
              <span className="text-xs font-medium text-gray-400 mb-1">
                Step {index + 1}
              </span>
              
              <h3 className="font-semibold text-gray-900 mb-1">
                {step.title}
              </h3>
              
              <p className="text-sm text-gray-500">
                {step.description}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-7 -right-2 transform translate-x-1/2">
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
          <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Powered by GenLayer Intelligent Contracts
          </h3>
          <p className="text-sm text-indigo-700">
            Unlike traditional smart contracts, GenLayer's Intelligent Contracts can access real-time web data, 
            process natural language, and use AI/LLMs for reasoning — all secured by decentralized consensus. 
            This enables trustless fact-checking without centralized authorities.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
