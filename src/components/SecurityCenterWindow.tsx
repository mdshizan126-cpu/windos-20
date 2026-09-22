import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Cpu, 
  HardDrive, 
  Globe, 
  FileText, 
  ScanFace, 
  Activity, 
  Play, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  RefreshCw, 
  Key, 
  Filter, 
  Download,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { 
  SecurityFeature, 
  SecurityEventLog, 
  NetworkConnection, 
  ScanState 
} from '../types';

interface SecurityCenterWindowProps {
  features: SecurityFeature[];
  onToggleFeature: (id: string) => void;
  eventLogs: SecurityEventLog[];
  networkConnections: NetworkConnection[];
  onToggleNetworkRule: (id: string) => void;
  onRequestUAC: (appName: string) => void;
  onAddAlert: (title: string, message: string, severity?: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const SecurityCenterWindow: React.FC<SecurityCenterWindowProps> = ({
  features,
  onToggleFeature,
  eventLogs,
  networkConnections,
  onToggleNetworkRule,
  onRequestUAC,
  onAddAlert
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'antivirus' | 'admin' | 'firewall' | 'hardware' | 'logs'>('overview');
  
  // UAC Slider (1-4)
  const [uacLevel, setUacLevel] = useState<number>(4);

  // Scan state
  const [scanState, setScanState] = useState<ScanState>({
    isScanning: false,
    scanType: 'quick',
    progress: 0,
    filesScanned: 0,
    threatsFound: 0,
    currentPath: 'C:\\Windows\\System32\\ntoskrnl.exe',
    completed: false,
    durationSeconds: 0
  });

  // Recovery Key Modal State
  const [showRecoveryKey, setShowRecoveryKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const recoveryKey = '48192-30912-74812-99014-55120-19238-66231-88401';

  // Log filter
  const [logFilter, setLogFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState<string>('');

  // Scanning simulation effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scanState.isScanning) {
      timer = setInterval(() => {
        setScanState(prev => {
          if (prev.progress >= 100) {
            clearInterval(timer);
            onAddAlert('Neural Defender Scan Complete', 'Scanned 14,820 kernel items. 0 threats found. System is fully clean.', 'success');
            return {
              ...prev,
              isScanning: false,
              progress: 100,
              completed: true,
              currentPath: 'Scanning finished. Status: Optimal.'
            };
          }

          const mockFiles = [
            'C:\\Windows\\System32\\drivers\\secnvme.sys',
            'C:\\Windows\\System32\\ci.dll',
            'C:\\Windows\\System32\\ntdll.dll',
            'C:\\Windows\\System32\\hvloader.efi',
            'C:\\Windows\\System32\\lsass.exe',
            'C:\\Windows\\System32\\winload.efi',
            'C:\\Windows\\System32\\hal.dll'
          ];
          const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];

          return {
            ...prev,
            progress: Math.min(100, prev.progress + (prev.scanType === 'quick' ? 6 : 2)),
            filesScanned: prev.filesScanned + (prev.scanType === 'quick' ? 240 : 80),
            durationSeconds: prev.durationSeconds + 1,
            currentPath: randomFile
          };
        });
      }, 250);
    }
    return () => clearInterval(timer);
  }, [scanState.isScanning, scanState.scanType, onAddAlert]);

  const startScan = (type: 'quick' | 'kernel_deep' | 'memory') => {
    setScanState({
      isScanning: true,
      scanType: type,
      progress: 0,
      filesScanned: 0,
      threatsFound: 0,
      currentPath: 'Initializing Neural Threat Analysis...',
      completed: false,
      durationSeconds: 0
    });
  };

  const stopScan = () => {
    setScanState(prev => ({
      ...prev,
      isScanning: false,
      currentPath: 'Scan canceled by user.'
    }));
  };

  const handleCopyRecoveryKey = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    onAddAlert('BitLocker Recovery Key Copied', 'Key safely backed up to cryptographically locked clipboard.', 'info');
  };

  const filteredLogs = eventLogs.filter(log => {
    const matchesFilter = 
      logFilter === 'all' || 
      (logFilter === 'success' && log.severity === 'audit_success') ||
      (logFilter === 'warning' && log.severity === 'warning') ||
      (logFilter === 'info' && log.severity === 'info');
    
    const matchesSearch = 
      logSearch === '' || 
      log.eventName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.process.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.description.toLowerCase().includes(logSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-56 sm:w-64 border-r border-slate-800/80 bg-slate-900/60 p-4 flex flex-col justify-between flex-shrink-0 backdrop-blur-xl">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">Security Center</h2>
              <span className="text-[11px] font-mono text-emerald-400">Windows 20 Active</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('antivirus')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'antivirus'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Virus &amp; Threat Guard</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Admin Access &amp; UAC</span>
            </button>

            <button
              onClick={() => setActiveTab('firewall')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'firewall'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Quantum Firewall</span>
            </button>

            <button
              onClick={() => setActiveTab('hardware')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'hardware'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span>TPM 3.0 &amp; BitLocker</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 text-violet-400" />
              <span>Event Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Admin Elevation Badge */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-amber-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Admin Session
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <p className="text-slate-400 text-[10px]">
            Logged in as <strong className="text-slate-200">Alex Vance</strong> (Elevated Token).
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ===================== TAB 1: OVERVIEW DASHBOARD ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-5xl">
            {/* Status Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-900/90 border border-emerald-500/30 p-6 shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Security Baseline: Level 4 Active
                    </span>
                    <span className="text-xs font-mono text-slate-400">All Protections Enforced</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Your Windows 20 System is Fully Protected
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Zero threats detected. Hypervisor-enforced Memory Integrity (HVCI), Kernel DMA Protection, BitLocker 2.0 hardware drive vault, and User Account Control (UAC) are fully synchronized and active.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => startScan('quick')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Quick Scan</span>
                  </button>

                  <button
                    onClick={() => onRequestUAC('Kernel Configuration Manager')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Test UAC Prompt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 6 Security Pillars Grid */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Core Security &amp; Administrative Pillars
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                        {feature.category === 'core' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                        {feature.category === 'admin' && <Lock className="w-5 h-5 text-amber-400" />}
                        {feature.category === 'hardware' && <HardDrive className="w-5 h-5 text-indigo-400" />}
                        {feature.category === 'network' && <Globe className="w-5 h-5 text-sky-400" />}
                        {feature.category === 'identity' && <ScanFace className="w-5 h-5 text-teal-400" />}
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {feature.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-white">{feature.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono text-cyan-300">{feature.badge}</span>
                      {feature.toggleable && (
                        <button
                          onClick={() => onToggleFeature(feature.id)}
                          className="text-xs text-slate-400 hover:text-white transition"
                        >
                          Configure
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ANTIVIRUS & SCANNER ===================== */}
        {activeTab === 'antivirus' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl font-bold text-white">Virus &amp; Threat Neural Defense</h1>
              <p className="text-xs text-slate-400">
                Windows 20 on-device neural security heuristics and continuous real-time telemetry.
              </p>
            </div>

            {/* Interactive Scanner Card */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Neural Scan Status: {scanState.isScanning ? 'Scanning in progress...' : scanState.completed ? 'Scan Completed' : 'Ready'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Latest Security Intelligence: v2026.09.2204 • Cloud Connected
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!scanState.isScanning ? (
                    <>
                      <button
                        onClick={() => startScan('quick')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Quick Scan</span>
                      </button>
                      <button
                        onClick={() => startScan('kernel_deep')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                      >
                        Deep Kernel Scan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={stopScan}
                      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/40 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Scan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Scan Telemetry Bar */}
              {scanState.isScanning && (
                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-cyan-500/30">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Progress: {scanState.progress}%</span>
                    <span>Objects Inspected: {scanState.filesScanned.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-200"
                      style={{ width: `${scanState.progress}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    Currently inspecting: <span className="text-slate-300">{scanState.currentPath}</span>
                  </div>
                </div>
              )}

              {/* Scan Stats Counter */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Total Scanned</span>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {scanState.filesScanned > 0 ? scanState.filesScanned.toLocaleString() : '428,910'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Threats Found</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">0</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Zero-Day Defense</span>
                  <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">Active</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Tamper Protection</span>
                  <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">Locked</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: ADMIN ACCESS & UAC ===================== */}
        {activeTab === 'admin' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl font-bold text-white">Administrative Access Controls &amp; UAC</h1>
              <p className="text-xs text-slate-400">
                Control privilege elevation boundaries, Admin Approval Mode, and biometric verification.
              </p>
            </div>

            {/* UAC Slider Control Card */}
            <div className="rounded-3xl bg-slate-900/80 border border-amber-500/30 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">User Account Control (UAC) Policy Level</h3>
                    <p className="text-xs text-slate-400">Select when to be notified of system-wide changes</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Level {uacLevel}: {uacLevel === 4 ? 'Always Notify (Secure Desktop)' : uacLevel === 3 ? 'Standard Notify' : uacLevel === 2 ? 'No Dimming' : 'Disabled (Unsafe)'}
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-3 pt-2">
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={uacLevel}
                  onChange={(e) => {
                    const newLevel = Number(e.target.value);
                    setUacLevel(newLevel);
                    onAddAlert('UAC Policy Modified', `User Account Control level set to ${newLevel}. Admin Approval Mode synchronized.`, 'info');
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                <div className="grid grid-cols-4 text-center text-[10px] font-mono text-slate-400">
                  <span>1: Never Notify</span>
                  <span>2: Low Notify</span>
                  <span>3: Apps Only</span>
                  <span className="text-amber-400 font-bold">4: Always Notify (Default)</span>
                </div>
              </div>

              {/* Description of Current Level */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {uacLevel === 4 && (
                  <span>
                    <strong>Always notify:</strong> Notifies you whenever programs try to install software or make changes to your computer, and dims the entire screen to an isolated Secure Desktop. Windows Hello biometric or PIN confirmation is mandatory.
                  </span>
                )}
                {uacLevel === 3 && (
                  <span>
                    <strong>Notify me only when apps try to make changes:</strong> Does not notify when you make Windows settings changes. Dims the desktop.
                  </span>
                )}
                {uacLevel === 2 && (
                  <span>
                    <strong>Notify me only without dimming:</strong> Does not use the isolated secure desktop. Not recommended for enterprise workstations.
                  </span>
                )}
                {uacLevel === 1 && (
                  <span className="text-red-300">
                    <strong>Never notify:</strong> All administrative elevation requests succeed silently. Highly discouraged as it bypasses zero-trust containment.
                  </span>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onRequestUAC('Group Policy Security Orchestrator')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Simulate Administrative Elevation Request</span>
                </button>
              </div>
            </div>

            {/* Active Administrative Policies */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Administrative Enforcement Policies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Biometric Elevation Lock</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">Enforced</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Requires Windows Hello facial scan or FIDO2 key confirmation for every administrative elevation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Kernel Driver Signature Lock</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">Mandatory</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Unsigned or revoked kernel drivers are strictly denied execution at boot time.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">LSA Protection &amp; Credential Guard</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">Isolated</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    lsass.exe runs in an isolated Hypervisor container to prevent credential extraction (e.g. Mimikatz).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">SAM Anonymous Access Filter</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">Blocked</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Anonymous network enumeration of local administrative accounts and security groups is forbidden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: FIREWALL & NETWORK ===================== */}
        {activeTab === 'firewall' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-xl font-bold text-white">Quantum-Resistant Firewall &amp; Network Guard</h1>
              <p className="text-xs text-slate-400">
                In-flight deep packet filtering, encrypted DNS-over-HTTPS, and real-time socket inspection.
              </p>
            </div>

            {/* Network Profile Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Domain Network</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-300">Firewall is ON</div>
                <div className="text-[10px] font-mono text-emerald-400">Inbound: Block | Outbound: Allow</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Private Network (Home/Office)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-300">Firewall is ON</div>
                <div className="text-[10px] font-mono text-emerald-400">Inbound: Block | Outbound: Allow</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Public Network</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-300">Firewall is ON</div>
                <div className="text-[10px] font-mono text-emerald-400">Stealth Mode: All Ports Filtered</div>
              </div>
            </div>

            {/* Live Socket Inspection Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Live Network Sockets &amp; Process Telemetry
                </h2>
                <span className="text-xs font-mono text-cyan-400">{networkConnections.length} Active Endpoints</span>
              </div>

              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Process Name</th>
                        <th className="py-2.5 px-3">PID</th>
                        <th className="py-2.5 px-3">Protocol</th>
                        <th className="py-2.5 px-3">Local Address</th>
                        <th className="py-2.5 px-3">Remote Address</th>
                        <th className="py-2.5 px-3">State</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {networkConnections.map((conn) => (
                        <tr key={conn.id} className="hover:bg-white/5 transition">
                          <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                            {conn.status === 'blocked' ? (
                              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            )}
                            <span>{conn.process}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-400">{conn.pid || '—'}</td>
                          <td className="py-3 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300">
                              {conn.protocol}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-300">{conn.localAddress}</td>
                          <td className="py-3 px-3 text-slate-400 truncate max-w-[140px]">{conn.remoteAddress}</td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded ${
                              conn.state === 'ESTABLISHED' ? 'bg-emerald-500/20 text-emerald-300' :
                              conn.state === 'LISTENING' ? 'bg-sky-500/20 text-sky-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {conn.state}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                onToggleNetworkRule(conn.id);
                                onAddAlert(
                                  conn.status === 'blocked' ? 'Port Unblocked' : 'Port Blocked',
                                  `${conn.process} network access ${conn.status === 'blocked' ? 'restored' : 'isolated'}.`,
                                  conn.status === 'blocked' ? 'info' : 'warning'
                                );
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                                conn.status === 'blocked'
                                  ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40'
                              }`}
                            >
                              {conn.status === 'blocked' ? 'Unblock' : 'Block Socket'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: HARDWARE & BITLOCKER ===================== */}
        {activeTab === 'hardware' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl font-bold text-white">Hardware Security &amp; BitLocker 2.0 Vault</h1>
              <p className="text-xs text-slate-400">
                Cryptographic hardware isolation, TPM 3.0 coprocessor health, and disk volume encryption.
              </p>
            </div>

            {/* BitLocker Vault Card */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">BitLocker Volume C: (NVMe Solid State)</h3>
                    <p className="text-xs text-slate-400">Status: 100% Encrypted • XTS-AES 256-bit Cipher</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRecoveryKey(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Key className="w-4 h-4" />
                  <span>View Recovery Key</span>
                </button>
              </div>

              {/* Volume Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Encryption Method</div>
                  <div className="font-semibold text-white mt-1">Hardware XTS-AES 256</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Key Protector</div>
                  <div className="font-semibold text-emerald-400 mt-1">TPM 3.0 + PIN Binding</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Auto-Unlock on Lock</div>
                  <div className="font-semibold text-cyan-300 mt-1">Chassis Tamper Armed</div>
                </div>
              </div>
            </div>

            {/* TPM 3.0 & VBS Attestation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2.5">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-semibold text-white">TPM 3.0 Cryptoprocessor</h3>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Manufacturer:</span>
                    <span>MSFT-TPM-3.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Spec Version:</span>
                    <span>3.0 (Rev 1.84)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PCR Integrity:</span>
                    <span className="text-emerald-400">All 24 Registers Valid</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xs font-semibold text-white">Virtual Secure Mode (VSM)</h3>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hyper-V Enclave:</span>
                    <span className="text-emerald-400">Running</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DMA Protection:</span>
                    <span className="text-emerald-400">Bus-Master Locked</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Secure Boot:</span>
                    <span className="text-emerald-400">Enabled (UEFI 2.10)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recovery Key Modal */}
            {showRecoveryKey && (
              <div className="p-5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    BitLocker 48-Digit Emergency Recovery Key
                  </span>
                  <button
                    onClick={() => setShowRecoveryKey(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-indigo-500/30 font-mono text-xs text-white text-center tracking-wider">
                  {recoveryKey}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCopyRecoveryKey}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied to Clipboard' : 'Copy Key'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 6: EVENT AUDIT LOGS ===================== */}
        {activeTab === 'logs' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">Windows Security Audit &amp; Event Logs</h1>
                <p className="text-xs text-slate-400">
                  Tamper-protected Event Viewer security channel (Real-time telemetry).
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="text"
                  placeholder="Filter by event or process..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />

                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Events</option>
                  <option value="success">Audit Success</option>
                  <option value="info">Information</option>
                  <option value="warning">Warnings</option>
                </select>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-2 font-mono text-xs">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.severity === 'audit_success' ? 'bg-emerald-500/20 text-emerald-300' :
                        log.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-sky-500/20 text-sky-300'
                      }`}>
                        Event ID {log.eventId}
                      </span>
                      <span className="font-sans font-semibold text-white">{log.eventName}</span>
                    </div>

                    <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {log.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="truncate max-w-sm">Process: {log.process}</span>
                    <span>User: <strong className="text-slate-300 font-sans">{log.user}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
