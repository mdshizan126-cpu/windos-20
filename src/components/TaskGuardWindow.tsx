import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { SystemProcess } from '../types';

interface TaskGuardWindowProps {
  processes: SystemProcess[];
  onKillProcess: (pid: number) => void;
  onAddAlert: (title: string, message: string, severity?: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const TaskGuardWindow: React.FC<TaskGuardWindowProps> = ({
  processes,
  onKillProcess,
  onAddAlert
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPid, setSelectedPid] = useState<number | null>(null);

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.integrity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pid.toString().includes(searchTerm)
  );

  const totalCpu = processes.reduce((acc, p) => acc + p.cpu, 0).toFixed(1);
  const totalMem = processes.reduce((acc, p) => acc + p.memoryMB, 0).toFixed(0);

  const handleAttemptKill = (process: SystemProcess) => {
    if (process.isProtectedKernel) {
      onAddAlert(
        'Access Denied: Protected Kernel Process',
        `Process ${process.name} (PID ${process.pid}) has Mandatory System Integrity. Termination is forbidden by Hypervisor Security.`,
        'critical'
      );
      return;
    }

    onKillProcess(process.pid);
    onAddAlert('Process Terminated', `Terminated ${process.name} (PID ${process.pid}) successfully.`, 'info');
    if (selectedPid === process.pid) setSelectedPid(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Header & Quick Stats */}
      <header className="p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Task Guard • Process Integrity</h2>
            <span className="text-[11px] font-mono text-cyan-400">Zero-Trust Process Isolation</span>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">CPU:</span>
            <span className="text-white font-bold">{totalCpu}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-2">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">RAM:</span>
            <span className="text-white font-bold">{totalMem} MB</span>
          </div>
        </div>
      </header>

      {/* Search & Actions Bar */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter processes, PID, or integrity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredProcesses.length} of {processes.length} Processes
        </span>
      </div>

      {/* Process Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-slate-950/95 border-b border-slate-800 text-slate-400 text-[11px] backdrop-blur-md">
            <tr>
              <th className="py-2.5 px-4 font-sans">Name</th>
              <th className="py-2.5 px-3">PID</th>
              <th className="py-2.5 px-3">User Context</th>
              <th className="py-2.5 px-3">Security Integrity Level</th>
              <th className="py-2.5 px-3">CPU</th>
              <th className="py-2.5 px-3">Memory</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredProcesses.map((proc) => {
              const isSelected = selectedPid === proc.pid;

              return (
                <tr
                  key={proc.pid}
                  onClick={() => setSelectedPid(proc.pid)}
                  className={`cursor-pointer transition ${
                    isSelected ? 'bg-cyan-500/15' : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-2.5 px-4 font-sans font-medium text-white flex items-center space-x-2">
                    {proc.isProtectedKernel ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Activity className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{proc.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{proc.pid}</td>
                  <td className="py-2.5 px-3 text-slate-300 truncate max-w-[120px]">{proc.user}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      proc.integrity === 'Kernel' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      proc.integrity === 'System' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      proc.integrity === 'High (Admin)' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      proc.integrity === 'AppContainer' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {proc.integrity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{proc.cpu}%</td>
                  <td className="py-2.5 px-3 text-slate-300">{proc.memoryMB} MB</td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttemptKill(proc);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                        proc.isProtectedKernel
                          ? 'bg-slate-800 text-slate-500 hover:text-slate-400'
                          : 'bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {proc.isProtectedKernel ? 'Protected' : 'End Task'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
