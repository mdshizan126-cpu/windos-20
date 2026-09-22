import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  Activity, 
  Terminal, 
  Settings, 
  HardDrive, 
  Lock, 
  RefreshCw, 
  Image, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import { WindowId, WallpaperOption } from '../types';

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
  onLockScreen: () => void;
  onRequestUAC: (appName: string) => void;
  currentWallpaper: WallpaperOption;
  wallpapers: WallpaperOption[];
  onSelectWallpaper: (wp: WallpaperOption) => void;
}

export const Desktop: React.FC<DesktopProps> = ({
  onOpenWindow,
  onLockScreen,
  onRequestUAC,
  currentWallpaper,
  wallpapers,
  onSelectWallpaper
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({
    x: 0,
    y: 0,
    isOpen: false
  });

  const desktopIcons: { id: WindowId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'security-center',
      label: 'Security Center',
      icon: (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25">
          <ShieldCheck className="w-7 h-7" />
        </div>
      )
    },
    {
      id: 'admin-console',
      label: 'Admin Console',
      icon: (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25">
          <Sliders className="w-7 h-7" />
        </div>
      )
    },
    {
      id: 'task-guard',
      label: 'Task Guard',
      icon: (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25">
          <Activity className="w-7 h-7" />
        </div>
      )
    },
    {
      id: 'terminal',
      label: 'PowerShell Admin',
      icon: (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
          <Terminal className="w-7 h-7" />
        </div>
      )
    },
    {
      id: 'system-info',
      label: 'System Info',
      icon: (
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-slate-600 to-zinc-500 text-white shadow-lg shadow-slate-600/25">
          <Settings className="w-7 h-7" />
        </div>
      )
    }
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isOpen: true
    });
  };

  const handleCloseContextMenu = () => {
    if (contextMenu.isOpen) {
      setContextMenu(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* Dynamic Background Themes */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-700">
        {currentWallpaper.theme === 'bloom' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1322] via-[#091a30] to-[#040e1e]">
            <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-cyan-600/20 blur-[130px]" />
            <div className="absolute bottom-10 right-10 w-[40rem] h-[40rem] rounded-full bg-blue-600/20 blur-[160px]" />
            <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] rounded-full bg-teal-500/10 blur-[140px]" />
            {/* Geometric Ambient Prism Shapes */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-3xl bg-gradient-to-tr from-cyan-400/10 to-indigo-500/10 rotate-12 blur-2xl transform" />
          </div>
        )}

        {currentWallpaper.theme === 'dark-obsidian' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0b0f19] to-[#030712]">
            <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-slate-700/15 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/3 w-[32rem] h-[32rem] rounded-full bg-indigo-950/30 blur-[150px]" />
          </div>
        )}

        {currentWallpaper.theme === 'cyber-aurora' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-[#041d1a] to-[#021312]">
            <div className="absolute top-10 left-10 w-[36rem] h-[36rem] rounded-full bg-emerald-500/15 blur-[140px]" />
            <div className="absolute bottom-10 right-10 w-[36rem] h-[36rem] rounded-full bg-teal-600/15 blur-[140px]" />
          </div>
        )}

        {currentWallpaper.theme === 'emerald-matrix' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#01140e]">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-emerald-400/15 blur-[160px]" />
          </div>
        )}

        {/* Ambient Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
      </div>

      {/* Security Brand Watermark */}
      <div className="absolute top-6 right-8 text-right pointer-events-none select-none z-0">
        <div className="flex items-center justify-end space-x-2 text-white/70">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold tracking-wider font-mono">WINDOWS 20 ENTERPRISE</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          All Security Features Active • Administrative Access Enforced
        </div>
      </div>

      {/* Desktop Icons Grid */}
      <div className="relative z-10 p-6 grid grid-cols-1 gap-5 w-28">
        {desktopIcons.map((icon) => (
          <button
            key={icon.id}
            onDoubleClick={() => onOpenWindow(icon.id)}
            onClick={() => onOpenWindow(icon.id)}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-white/10 active:bg-white/20 transition group cursor-pointer text-center"
          >
            <div className="group-hover:scale-105 transition-transform">
              {icon.icon}
            </div>
            <span className="text-xs font-medium text-slate-100 mt-2 px-2 py-0.5 rounded-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
              {icon.label}
            </span>
          </button>
        ))}

        {/* Additional Desktop Action: Test UAC */}
        <button
          onClick={() => onRequestUAC('Administrative Token Elevation Test')}
          className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-white/10 active:bg-white/20 transition group cursor-pointer text-center"
        >
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="text-xs font-medium text-slate-100 mt-2 px-2 py-0.5 rounded-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            Test UAC
          </span>
        </button>
      </div>

      {/* Desktop Context Menu */}
      {contextMenu.isOpen && (
        <div
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          className="fixed z-[8500] w-56 rounded-2xl bg-slate-900/95 border border-slate-700/80 p-1.5 backdrop-blur-2xl shadow-2xl text-xs text-slate-200 divide-y divide-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={() => {
                onOpenWindow('security-center');
                handleCloseContextMenu();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-300 transition text-left cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security Center</span>
            </button>

            <button
              onClick={() => {
                onOpenWindow('admin-console');
                handleCloseContextMenu();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-300 transition text-left cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Administrative Console</span>
            </button>

            <button
              onClick={() => {
                onRequestUAC('Security Subsystem Elevation');
                handleCloseContextMenu();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-300 transition text-left cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Prompt UAC Elevation</span>
            </button>
          </div>

          {/* Wallpaper Selection Submenu */}
          <div className="py-1">
            <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-400">
              Desktop Wallpaper
            </div>
            {wallpapers.map((wp) => (
              <button
                key={wp.id}
                onClick={() => {
                  onSelectWallpaper(wp);
                  handleCloseContextMenu();
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-xl transition text-left cursor-pointer ${
                  currentWallpaper.id === wp.id ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:bg-white/5'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: wp.previewColor }}
                />
                <span className="truncate">{wp.name}</span>
              </button>
            ))}
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onLockScreen();
                handleCloseContextMenu();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 transition text-left cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Lock Workstation (Win+L)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
