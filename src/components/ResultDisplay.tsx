/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { ReasoningResult } from '../types';
import { ShieldCheck, Info, Target, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface ResultSectionProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ResultSection = ({ label, icon, children, className, delay = 0 }: ResultSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn("border-t border-brand-line pt-6", className)}
  >
    <div className="flex items-center gap-2 mb-4">
       <span className="text-brand-ink/40">{icon}</span>
       <span className="font-mono text-[10px] uppercase tracking-widest text-brand-ink/50">{label}</span>
    </div>
    <div className="pl-6 border-l border-brand-line/50 ml-2">
      {children}
    </div>
  </motion.div>
);

export const ResultDisplay: React.FC<{ result: ReasoningResult | null; isLoading: boolean }> = ({ result, isLoading }) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 h-full flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-48 space-y-6"
          >
            <div className="relative">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-16 h-16 border-2 border-brand-line rounded-full border-t-brand-accent"
               />
               <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-accent" />
            </div>
            <div className="space-y-2 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse text-brand-accent">Initializing Reasoning Engines</p>
              <p className="text-[10px] text-brand-muted font-mono italic">Decomposing problem space...</p>
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 pb-20"
          >
            {/* Final Answer - Main Grid */}
            <div className="md:col-span-8 md:row-span-4 bg-brand-card border border-brand-line rounded-2xl p-8 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Final Answer</span>
                <div className="h-[1px] flex-grow mx-4 bg-brand-line"></div>
                <Target className="w-4 h-4 text-brand-muted" />
              </div>
              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="markdown-body">
                  <ReactMarkdown>{result.finalAnswer}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Reasoning Summary */}
            <div className="md:col-span-4 md:row-span-2 bg-brand-card border border-brand-line rounded-2xl p-6 overflow-hidden">
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wider block mb-4">Reasoning Summary</span>
                <p className="text-sm text-brand-muted leading-relaxed font-serif italic">
                  {result.reasoningSummary}
                </p>
            </div>

            {/* Confidence Score */}
            <div className="md:col-span-4 md:row-span-2 bg-brand-card border border-brand-line rounded-2xl p-6 flex flex-col justify-center items-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-brand-line" stroke-dasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2.5" />
                  <motion.path 
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${result.confidenceScore}, 100` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="text-brand-accent" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2.5" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-3xl font-bold text-brand-ink">{result.confidenceScore}<span className="text-xs font-normal opacity-50">%</span></div>
              </div>
              <span className="text-[10px] text-brand-muted uppercase tracking-[0.2em]">Confidence Index</span>
            </div>

            {/* Internal Logic Trace */}
            <div className="md:col-span-4 md:row-span-2 bg-brand-card border border-brand-line rounded-2xl p-6">
              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider block mb-4">Internal Logic Trace</span>
              <ul className="space-y-2">
                {[
                  { id: 'P1', msg: 'Initial Reasoning', status: 'done' },
                  { id: 'P2', msg: 'Self-Evaluation', status: 'done' },
                  { id: 'P3', msg: 'Refinement Pass', status: 'done' },
                  { id: 'P4', msg: 'Failure Analysis', status: 'done' },
                  { id: 'P5', msg: 'Confidence Calc', status: 'active' },
                ].map((step) => (
                  <li key={step.id} className="flex items-center gap-3 text-[10px]">
                    <span className={cn("w-1.5 h-1.5 rounded-full", step.status === 'done' ? "bg-brand-accent" : "bg-brand-accent animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]")} />
                    <span className="font-mono text-brand-muted"><span className="text-brand-ink/40 mr-1">{step.id}</span> {step.msg}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trade-offs & Constraints */}
            <div className="md:col-span-8 md:row-span-2 bg-brand-card border border-brand-line rounded-2xl p-6">
              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider block mb-4">Trade-offs & Constraints</span>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-bold text-brand-muted uppercase mb-2">Synthesis Context</h4>
                  <p className="text-sm text-brand-muted leading-relaxed">{result.tradeoffs}</p>
                </div>
                <div className="border-l border-brand-line pl-6 hidden md:block">
                  <h4 className="text-[10px] font-bold text-brand-muted uppercase mb-2">System Specs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-wide">
                      <span className="text-brand-muted">Latency Index</span>
                      <span className="text-brand-accent">Optimized</span>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-wide">
                      <span className="text-brand-muted">Depth Factor</span>
                      <span className="text-brand-accent">High Fidelity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
