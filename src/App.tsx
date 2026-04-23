/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { performReasoning } from './services/geminiService';
import { ReasoningResult } from './types';
import { ResultDisplay } from './components/ResultDisplay';
import { Send, Zap, ChevronRight, Hash } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ReasoningResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setHasStarted(true);
    setResult(null);

    try {
      const output = await performReasoning(input);
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An obscure error occurred during reasoning.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-accent/30 selection:text-brand-accent">
      {/* Header Rail */}
      <header className="border-b border-brand-line px-8 py-6 flex justify-between items-center sticky top-0 bg-brand-bg/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-brand-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
          <h1 className="text-xl font-bold tracking-tight text-brand-ink uppercase">Cognito <span className="text-brand-accent">v4.0</span></h1>
          <span className="text-[10px] font-mono bg-brand-line text-brand-muted px-2 py-1 rounded border border-brand-line/50">SYSTEM: ACTIVE</span>
        </div>
        <div className="text-right hidden md:block">
          <div className="font-mono text-[10px] text-brand-muted uppercase tracking-[0.2em]">
            Deep Reasoning Mode | Thread ID: {isLoading ? '8821-X' : '8821-V'}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {!hasStarted ? (
          <div className="w-full max-w-2xl px-6 pt-32 space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.85] text-brand-ink uppercase">
                Neuro <br /> Synthesis.
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed max-w-sm mx-auto font-mono uppercase tracking-widest opacity-60">
                AI Powered Deep Reasoning protocol for complex synthesis.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-brand-card border border-brand-line rounded-2xl p-4 shadow-2xl"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter complex inquiry for synthesis..."
                className="w-full min-h-[120px] bg-transparent p-4 font-mono text-sm leading-relaxed focus:outline-none transition-colors resize-none placeholder:text-brand-line"
              />
              <div className="flex justify-between items-center px-4 pb-2">
                 <span className="text-[9px] font-mono text-brand-line uppercase tracking-widest">Type query and press CMD+Enter</span>
                 <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim()}
                  className="bg-brand-accent text-brand-bg px-6 py-2 rounded-full flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-20 font-bold uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  Synthesize
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="w-full flex flex-col h-full overflow-hidden">
             {/* Secondary input */}
             <div className="border-b border-brand-line px-8 py-4 bg-brand-bg/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                  <div className="text-brand-accent font-mono text-xs opacity-50">#</div>
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none focus:outline-none font-mono text-sm text-brand-muted"
                  />
                  <button 
                    onClick={() => handleSubmit()}
                    disabled={isLoading}
                    className="text-brand-accent hover:scale-110 transition-transform disabled:opacity-30"
                  >
                    <Zap className={cn("w-5 h-5", isLoading && "animate-pulse")} fill="currentColor" />
                  </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto pt-12 custom-scrollbar">
                <ResultDisplay result={result} isLoading={isLoading} />
                
                {error && (
                  <div className="max-w-4xl mx-auto mb-12 p-6 border border-red-500/30 bg-red-500/5 rounded-xl text-red-400 font-mono text-[10px] uppercase tracking-widest">
                     System Violation Error: {error}
                  </div>
                )}
             </div>
          </div>
        )}
      </main>

      <footer className="border-t border-brand-line px-8 py-4 flex justify-between items-center text-[10px] font-mono text-brand-muted uppercase tracking-widest bg-brand-bg">
        <div className="flex gap-6">
          <span>Mem: 12.8GB</span>
          <span className="hidden sm:block">Epoch: 1042</span>
          <span>Latency: 42ms</span>
        </div>
        <div>Structured Reasoner | High Fidelity</div>
      </footer>
    </div>
  );
}
