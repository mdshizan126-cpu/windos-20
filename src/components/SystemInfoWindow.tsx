import React from 'react';
import { Settings, ShieldCheck, Cpu, HardDrive, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SystemInfoWindowProps {
  onCheckUpdates: () => void;
}

export const SystemInfoWindow: React.FC<SystemInfoWindowProps> = ({ onCheckUpdates }) => {
  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-y-auto p-6 space-y-6 font-sans">
      {/* OS Banner */}
      <div className="flex items-center space-x-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-3 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full grid grid-cols-2 gap-1">
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
            <div className="bg-white rounded-xs" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Windows 20 Enterprise</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Concept Update 26H2
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            OS Build 28400.1004 • Windows Feature Experience Pack 2026.9
          </p>
        </div>
      </div>

      {/* Security Attestation Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <h3 className="text-xs font-semibold text-white">System Security Status</h3>
            <p className="text-[11px] text-emerald-300">
              All 10 Core Security &amp; Administrative Protections are Active and Enforced.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          Optimal
        </span>
      </div>

      {/* Device Specifications */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Hardware &amp; Security Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Security Processor</span>
            <div className="font-semibold text-white">Microsoft Pluton TPM 3.0 Hardware Enclave</div>
            <div className="text-[11px] text-emerald-400 font-mono">Status: Attested &amp; Ready</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Virtualization Security</span>
            <div className="font-semibold text-white">Hypervisor-Protected Code Integrity (HVCI)</div>
            <div className="text-[11px] text-cyan-300 font-mono">VBS Enabled • W^X Memory Active</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Neural Co-Processor (NPU)</span>
            <div className="font-semibold text-white">Windows 20 Neural Engine (65 TOPS)</div>
            <div className="text-[11px] text-slate-400 font-mono">On-device zero-day heuristic classification</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Primary Storage Volume</span>
            <div className="font-semibold text-white">2.0 TB NVMe PCIe Gen 5.0 (C:)</div>
            <div className="text-[11px] text-indigo-400 font-mono">BitLocker XTS-AES 256 Enforced</div>
          </div>
        </div>
      </div>

      {/* Windows Update Check */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-semibold text-white">Windows Update Status</h3>
          <p className="text-[11px] text-slate-400">You're up to date. Last checked: Today at 00:19 AM</p>
        </div>

        <button
          onClick={onCheckUpdates}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Check for Updates</span>
        </button>
      </div>
    </div>
  );
};
