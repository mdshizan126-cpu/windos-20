import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Terminal, 
  Activity, 
  Settings, 
  Wifi, 
  Volume2, 
  Battery, 
  Sliders, 
  Power, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Bell, 
  X, 
  User, 
  HardDrive, 
  Moon, 
  Sun, 
  WifiOff, 
  VolumeX, 
  Radio,
  FileText
} from 'lucide-react';
import { WindowId, WindowState, SystemAlert } from '../types';

interface TaskbarProps {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  onOpenWindow: (id: WindowId) => void;
  onLockScreen: () => void;
  onRequestUAC: (appName: string) => void;
  alerts: SystemAlert[];
  onDismissAlert: (id: string) => void;
  onClearAllAlerts: () => void;
  adminLockdownActive: boolean;
  onToggleAdminLockdown: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  onOpenWindow,
  onLockScreen,
  onRequestUAC,
  alerts,
  onDismissAlert,
  onClearAllAlerts,
  adminLockdownActive,
  onToggleAdminLockdown
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [showStartMenu, setShowStartMenu] = useState<boolean>(false);
  const [showQuickSettings, setShowQuickSettings] = useState<boolean>(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick settings toggles
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [nightLight, setNightLight] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  const startMenuRef = useRef<HTMLDivElement>(null);
  const quickSettingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        startMenuRef.current && 
        !startMenuRef.current.contains(target) && 
        !target.closest('#btn-start-menu')
      ) {
        setShowStartMenu(false);
      }
      if (
        quickSettingsRef.current && 
        !quickSettingsRef.current.contains(target) && 
        !target.closest('#btn-quick-settings')
      ) {
        setShowQuickSettings(false);
      }
      if (
        notificationsRef.current && 
        !notificationsRef.current.contains(target) && 
        !target.closest('#btn-notifications')
      ) {
        setShowNotificationCenter(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  const appIcons: { id: WindowId; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      id: 'security-center', 
      label: 'Windows 20 Security Center', 
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/20'
    },
    { 
      id: 'admin-console', 
      label: 'Administrative Access Controls', 
      icon: <Sliders className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/20'
    },
    { 
      id: 'task-guard', 
      label: 'Task Guard & Process Integrity', 
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-500/20'
    },
    { 
      id: 'terminal', 
      label: 'PowerShell 7.5 (Administrator)', 
      icon: <Terminal className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/20 to-violet-500/20'
    },
    { 
      id: 'system-info', 
      label: 'Windows 20 System Specifications', 
      icon: <Settings className="w-5 h-5 text-slate-300" />,
      color: 'from-slate-500/20 to-zinc-500/20'
    }
  ];

  return (
    <>
      {/* ===================== START MENU ===================== */}
      <AnimatePresence>
        {showStartMenu && (
          <motion.div
            ref={startMenuRef}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[8000] w-[92vw] max-w-xl rounded-3xl bg-[#0f172a]/95 border border-white/15 p-6 backdrop-blur-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] text-slate-100 flex flex-col space-y-5"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search security policies, admin tools, settings..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                autoFocus
              />
            </div>

            {/* Pinned Administrative & Security Utilities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Administrative Utilities &amp; Security Tools
                </span>
                <span className="text-[11px] font-mono text-cyan-400">All Modules Active</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {appIcons.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onOpenWindow(app.id);
                      setShowStartMenu(false);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition group cursor-pointer text-center"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 group-hover:scale-110 transition-transform mb-2">
                      {app.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight">
                      {app.label}
                    </span>
                  </button>
                ))}

                {/* Additional quick actions */}
                <button
                  onClick={() => {
                    onRequestUAC('Kernel Policy Modification Tool');
                    setShowStartMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 transition group cursor-pointer text-center"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 group-hover:scale-110 transition-transform mb-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight">
                    Test UAC Elevation
                  </span>
                </button>

                <button
                  onClick={() => {
                    onOpenWindow('security-center');
                    setShowStartMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition group cursor-pointer text-center"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 group-hover:scale-110 transition-transform mb-2">
                    <HardDrive className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight">
                    BitLocker Vault
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Status / Recent Security Policy */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Security Baseline Compliant</div>
                  <div className="text-[11px] text-slate-400">TPM 3.0 Cryptographic Attestation • Hypervisor HVCI Active</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Enforced
              </span>
            </div>

            {/* User Profile & Lock / Power Controls Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow">
                  AV
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Alex Vance</div>
                  <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Administrator (Elevated)
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-lock-start-menu"
                  onClick={() => {
                    setShowStartMenu(false);
                    onLockScreen();
                  }}
                  title="Lock Workstation (Win+L)"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Lock</span>
                </button>

                <button
                  onClick={() => {
                    setShowStartMenu(false);
                    onLockScreen();
                  }}
                  title="Restart Workstation"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  onClick={() => {
                    setShowStartMenu(false);
                    onLockScreen();
                  }}
                  title="Shut Down"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-200 border border-slate-700 transition cursor-pointer"
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== QUICK SETTINGS FLYOUT ===================== */}
      <AnimatePresence>
        {showQuickSettings && (
          <motion.div
            ref={quickSettingsRef}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed bottom-16 right-4 sm:right-10 z-[8000] w-[90vw] max-w-sm rounded-3xl bg-[#0f172a]/95 border border-white/15 p-5 backdrop-blur-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Quick Action Center
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">Windows 20 Hub</span>
            </div>

            {/* Quick Toggle Tiles */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Wi-Fi */}
              <button
                onClick={() => setWifiOn(!wifiOn)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition cursor-pointer ${
                  wifiOn 
                    ? 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {wifiOn ? <Wifi className="w-5 h-5 mb-1" /> : <WifiOff className="w-5 h-5 mb-1" />}
                <span className="text-[11px] font-medium">Wi-Fi 7</span>
                <span className="text-[9px] opacity-75">{wifiOn ? 'Secured' : 'Off'}</span>
              </button>

              {/* Bluetooth */}
              <button
                onClick={() => setBluetoothOn(!bluetoothOn)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition cursor-pointer ${
                  bluetoothOn 
                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <Radio className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">Bluetooth</span>
                <span className="text-[9px] opacity-75">{bluetoothOn ? 'Paired' : 'Off'}</span>
              </button>

              {/* Security Shield Active */}
              <button
                onClick={() => onOpenWindow('security-center')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-emerald-600/30 border-emerald-500/50 text-emerald-300 transition cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 mb-1 text-emerald-400" />
                <span className="text-[11px] font-medium">Defender</span>
                <span className="text-[9px] opacity-75">Guarded</span>
              </button>

              {/* Night Light */}
              <button
                onClick={() => setNightLight(!nightLight)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition cursor-pointer ${
                  nightLight 
                    ? 'bg-amber-600/30 border-amber-500/50 text-amber-300' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {nightLight ? <Moon className="w-5 h-5 mb-1" /> : <Sun className="w-5 h-5 mb-1" />}
                <span className="text-[11px] font-medium">Eye Shield</span>
                <span className="text-[9px] opacity-75">{nightLight ? 'Active' : 'Off'}</span>
              </button>

              {/* Admin Lockdown Mode Switch */}
              <button
                onClick={onToggleAdminLockdown}
                className={`col-span-2 flex flex-col items-center justify-center p-3 rounded-2xl border transition cursor-pointer ${
                  adminLockdownActive
                    ? 'bg-red-600/30 border-red-500/50 text-red-300 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Lock className={`w-4 h-4 ${adminLockdownActive ? 'text-red-400' : 'text-amber-400'}`} />
                  <span className="text-[11px] font-semibold">Admin Lockdown Mode</span>
                </div>
                <span className="text-[9px] opacity-80">
                  {adminLockdownActive ? 'ZERO-TRUST BOUNDARY LOCKED' : 'Click to enforce strict isolate'}
                </span>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                  </button>
                  Audio Volume
                </span>
                <span className="font-mono">{isMuted ? 'Muted' : `${volume}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== NOTIFICATION CENTER FLYOUT ===================== */}
      <AnimatePresence>
        {showNotificationCenter && (
          <motion.div
            ref={notificationsRef}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed bottom-16 right-4 sm:right-6 z-[8000] w-[92vw] max-w-sm rounded-3xl bg-[#0f172a]/95 border border-white/15 p-5 backdrop-blur-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Security Notifications ({alerts.length})
                </span>
              </div>
              {alerts.length > 0 && (
                <button
                  onClick={onClearAllAlerts}
                  className="text-[11px] text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                  No security alerts. System is fully protected.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {alert.severity === 'critical' ? (
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                        ) : alert.severity === 'warning' ? (
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                        <h4 className="text-xs font-semibold text-slate-200">{alert.title}</h4>
                      </div>
                      <button
                        onClick={() => onDismissAlert(alert.id)}
                        className="text-slate-500 hover:text-slate-300 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                      <span>Source: {alert.source}</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== FLOATING NEXT-GEN DOCK / TASKBAR ===================== */}
      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[7000] w-auto max-w-[96vw] select-none">
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#0b1322]/90 border border-white/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] text-slate-200">
          {/* Start Menu Button (Windows 20 Glyph) */}
          <button
            id="btn-start-menu"
            onClick={() => {
              setShowStartMenu(!showStartMenu);
              setShowQuickSettings(false);
              setShowNotificationCenter(false);
            }}
            title="Start (Windows 20)"
            className={`p-2 rounded-xl transition cursor-pointer group relative ${
              showStartMenu ? 'bg-cyan-500/25 border border-cyan-400/50' : 'hover:bg-white/10'
            }`}
          >
            {/* Windows 20 Futuristic 4-Quadrant Glyph */}
            <div className="w-5 h-5 grid grid-cols-2 gap-1 group-hover:scale-105 transition-transform">
              <div className="rounded-sm bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm" />
              <div className="rounded-sm bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm" />
              <div className="rounded-sm bg-gradient-to-br from-teal-400 to-cyan-500 shadow-sm" />
              <div className="rounded-sm bg-gradient-to-br from-sky-400 to-cyan-600 shadow-sm" />
            </div>
          </button>

          {/* Quick Search */}
          <button
            onClick={() => {
              setShowStartMenu(true);
            }}
            title="Search System"
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-white/10 mx-1" />

          {/* Running & Pinned Application Icons */}
          <div className="flex items-center space-x-1">
            {appIcons.map((app) => {
              const win = windows[app.id];
              const isOpen = win?.isOpen;
              const isActive = activeWindowId === app.id && isOpen && !win.isMinimized;

              return (
                <button
                  key={app.id}
                  onClick={() => onOpenWindow(app.id)}
                  title={app.label}
                  className={`relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                    isActive 
                      ? 'bg-white/15 border border-white/20 shadow-inner' 
                      : isOpen 
                        ? 'bg-white/5 hover:bg-white/10' 
                        : 'hover:bg-white/10'
                  }`}
                >
                  <div className="transition-transform hover:scale-110">
                    {app.icon}
                  </div>

                  {/* Active running indicator pill */}
                  {isOpen && (
                    <span 
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all ${
                        isActive ? 'w-4 h-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'w-1.5 h-1 bg-slate-400'
                      }`} 
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-5 w-px bg-white/10 mx-1" />

          {/* System Tray (Right Side) */}
          <div className="flex items-center space-x-1">
            {/* Quick Lockdown Alert Badge */}
            {adminLockdownActive && (
              <div className="px-2 py-1 rounded-lg bg-red-600/30 border border-red-500/50 text-[10px] font-mono text-red-300 font-bold flex items-center gap-1 animate-pulse">
                <Lock className="w-3 h-3" />
                <span>LOCKDOWN</span>
              </div>
            )}

            {/* Quick Settings Bar Button */}
            <button
              id="btn-quick-settings"
              onClick={() => {
                setShowQuickSettings(!showQuickSettings);
                setShowStartMenu(false);
                setShowNotificationCenter(false);
              }}
              title="Quick Settings"
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer text-slate-300"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <Wifi className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
              <Volume2 className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* Clock & Notification Bell */}
            <button
              id="btn-notifications"
              onClick={() => {
                setShowNotificationCenter(!showNotificationCenter);
                setShowStartMenu(false);
                setShowQuickSettings(false);
              }}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer text-right"
            >
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold text-white tracking-wider font-mono">
                  {time || '00:00'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  {date || 'Today'}
                </span>
              </div>

              <div className="relative ml-1">
                <Bell className="w-3.5 h-3.5 text-slate-300" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
                )}
              </div>
            </button>

            {/* Lock Button Shortcut */}
            <button
              onClick={onLockScreen}
              title="Lock System (Win+L)"
              className="p-1.5 rounded-lg hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
