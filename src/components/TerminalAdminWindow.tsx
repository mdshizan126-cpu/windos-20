import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ShieldCheck, CornerDownLeft, Sparkles } from 'lucide-react';

interface TerminalAdminWindowProps {
  onLockScreen: () => void;
  onRequestUAC: (appName: string) => void;
  onAddAlert: (title: string, message: string, severity?: 'info' | 'success' | 'warning' | 'critical') => void;
}

interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
}

export const TerminalAdminWindow: React.FC<TerminalAdminWindowProps> = ({
  onLockScreen,
  onRequestUAC,
  onAddAlert
}) => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'init-1',
      command: '',
      output: (
        <div className="space-y-1 text-slate-400">
          <div className="text-cyan-400 font-bold">
            Windows PowerShell 7.5 (Administrator) • Core Security Console
          </div>
          <div>Copyright (C) Microsoft Corporation 2026. All rights reserved.</div>
          <div className="text-xs text-amber-400">
            [ADMIN PRIVILEGE TOKEN ATTACHED: SeDebugPrivilege, SeSecurityPrivilege, SeTcbPrivilege]
          </div>
          <div className="text-xs text-slate-400 pt-1">
            Type <span className="text-cyan-300 font-semibold">help</span> to view available security &amp; admin commands.
          </div>
        </div>
      )
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let outputContent: React.ReactNode = null;

    switch (command) {
      case 'help':
        outputContent = (
          <div className="space-y-1 text-xs text-slate-300">
            <div className="text-cyan-300 font-semibold mb-1">Available Windows 20 Security Commands:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono">
              <div><strong className="text-white">whoami</strong> : Current logon context</div>
              <div><strong className="text-white">whoami /priv</strong> : Dump administrative token privileges</div>
              <div><strong className="text-white">Get-SecurityStatus</strong> : Probe VBS, HVCI &amp; TPM 3.0</div>
              <div><strong className="text-white">lock-workstation</strong> : Trigger immediate lock screen</div>
              <div><strong className="text-white">elevate</strong> : Trigger UAC administrative prompt</div>
              <div><strong className="text-white">net user</strong> : List configured system accounts</div>
              <div><strong className="text-white">scan-system</strong> : Trigger Neural Defender scan</div>
              <div><strong className="text-white">clear</strong> : Clear terminal buffer</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        if (arg === '/priv') {
          outputContent = (
            <div className="space-y-1 text-[11px] font-mono text-slate-300">
              <div className="text-amber-400 font-bold">PRIVILEGES INFORMATION</div>
              <div className="text-slate-500">----------------------</div>
              <div className="grid grid-cols-3 text-slate-400 font-semibold">
                <span>Privilege Name</span>
                <span>Description</span>
                <span className="text-right">State</span>
              </div>
              <div className="text-slate-500">------------------------------------------------------------</div>
              <div className="grid grid-cols-3">
                <span className="text-cyan-300">SeDebugPrivilege</span>
                <span>Debug programs</span>
                <span className="text-emerald-400 text-right">Enabled</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-cyan-300">SeSecurityPrivilege</span>
                <span>Manage security log</span>
                <span className="text-emerald-400 text-right">Enabled</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-cyan-300">SeTakeOwnershipPrivilege</span>
                <span>Take ownership</span>
                <span className="text-emerald-400 text-right">Enabled</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-cyan-300">SeLoadDriverPrivilege</span>
                <span>Load kernel drivers</span>
                <span className="text-emerald-400 text-right">Enabled</span>
              </div>
            </div>
          );
        } else {
          outputContent = (
            <div className="text-xs font-mono text-emerald-400">
              WINDOWS20-SEC\alex.vance (High Mandatory Level: Administrator)
            </div>
          );
        }
        break;

      case 'get-securitystatus':
      case 'status':
        outputContent = (
          <div className="space-y-1 text-xs font-mono text-slate-300">
            <div className="text-cyan-400 font-bold">Windows 20 Security Subsystem Audit</div>
            <div className="text-[11px] text-emerald-400">✓ Memory Integrity (HVCI): RUNNING (Hyper-V Isolated)</div>
            <div className="text-[11px] text-emerald-400">✓ Kernel DMA Protection: ACTIVE (IOMMU Locked)</div>
            <div className="text-[11px] text-emerald-400">✓ Hardware TPM 3.0: ATTESTED (PCR Registers 0-23 Valid)</div>
            <div className="text-[11px] text-emerald-400">✓ BitLocker 2.0: ENCRYPTED (NVMe C: XTS-AES 256)</div>
            <div className="text-[11px] text-emerald-400">✓ User Account Control: LEVEL 4 (Admin Approval Mode)</div>
          </div>
        );
        break;

      case 'lock-workstation':
      case 'lock':
        outputContent = <div className="text-xs text-amber-400">Locking workstation session...</div>;
        setTimeout(onLockScreen, 500);
        break;

      case 'elevate':
        outputContent = <div className="text-xs text-amber-400">Requesting administrative elevation prompt...</div>;
        setTimeout(() => onRequestUAC('PowerShell Elevated Process Dispatcher'), 300);
        break;

      case 'net':
        if (arg === 'user' || arg.includes('user')) {
          outputContent = (
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <div>User accounts for \\WINDOWS20-SEC</div>
              <div className="text-slate-500">----------------------------------------------------</div>
              <div className="grid grid-cols-3 text-cyan-300">
                <span>alex.vance (Admin)</span>
                <span>Administrator</span>
                <span>Guest</span>
              </div>
              <div className="grid grid-cols-3 text-cyan-300">
                <span>s.connor (SecOfficer)</span>
                <span>DefaultAccount</span>
                <span>WDAGUtilityAccount</span>
              </div>
              <div className="text-[11px] text-emerald-400 pt-1">The command completed successfully.</div>
            </div>
          );
        } else {
          outputContent = <div className="text-xs text-slate-400">Syntax: net user</div>;
        }
        break;

      case 'scan-system':
      case 'scan':
        outputContent = (
          <div className="text-xs font-mono text-cyan-300 space-y-1">
            <div>[!] Initializing Windows 20 Neural Defender heuristic scan...</div>
            <div className="text-emerald-400">✓ 428,910 objects checked in 0.42s. 0 active threats detected.</div>
          </div>
        );
        onAddAlert('Neural Defender Scan Complete', 'Executed on-demand terminal kernel scan. System clean.', 'success');
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      default:
        outputContent = (
          <div className="text-xs text-red-400 font-mono">
            '{trimmed}' is not recognized as an internal or external command. Type 'help' for available commands.
          </div>
        );
        break;
    }

    setHistory(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output: outputContent
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div 
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full w-full bg-[#0c1017] text-slate-100 p-4 font-mono text-xs overflow-y-auto select-text cursor-text"
    >
      {/* History */}
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="space-y-1.5">
            {item.command && (
              <div className="flex items-center space-x-2 text-cyan-300">
                <span className="text-slate-400">PS C:\WINDOWS\System32&gt;</span>
                <span className="text-white font-semibold">{item.command}</span>
              </div>
            )}
            <div>{item.output}</div>
          </div>
        ))}
      </div>

      {/* Active Prompt Line */}
      <div className="flex items-center space-x-2 text-cyan-300 mt-2">
        <span className="text-slate-400 flex-shrink-0">PS C:\WINDOWS\System32&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs caret-cyan-400"
          autoFocus
        />
      </div>

      <div ref={terminalEndRef} />
    </div>
  );
};
