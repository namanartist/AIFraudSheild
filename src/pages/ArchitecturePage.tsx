import React from 'react';
import { ArchitectureDiagram } from '../components/visualizer/ArchitectureDiagram';
import { WorkflowVisualizer } from '../components/visualizer/WorkflowVisualizer';
import { Network, Sparkles, Layers, Cpu, Database, Blocks } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Network className="w-5 h-5 text-cyber-cyan" />
          Interactive System Architecture & Cryptographic Pipeline
        </h2>
        <p className="text-xs font-mono text-slate-400 mt-0.5">
          Comprehensive visualization of data flow across Frontend, Node.js API, AI Risk Engine, IPFS, and Solidity Smart Contracts.
        </p>
      </div>

      <WorkflowVisualizer />

      <ArchitectureDiagram />
    </div>
  );
};
