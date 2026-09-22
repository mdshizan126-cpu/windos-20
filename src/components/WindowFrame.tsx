import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, Copy, X, ShieldCheck, Lock } from 'lucide-react';
import { WindowState } from '../types';

interface WindowFrameProps {
  window: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  children
}) => {
  const [pos, setPos] = useState(win.position);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0
  });

  useEffect(() => {
    setPos(win.position);
  }, [win.position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStartRef.current.mouseX;
      const dy = ev.clientY - dragStartRef.current.mouseY;
      setPos({
        x: Math.max(0, dragStartRef.current.startX + dx),
        y: Math.max(0, dragStartRef.current.startY + dy)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!win.isOpen || win.isMinimized) return null;

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex: win.zIndex,
        left: win.isMaximized ? 0 : `${pos.x}px`,
        top: win.isMaximized ? 0 : `${pos.y}px`,
        width: win.isMaximized ? '100vw' : `${win.size.width}px`,
        height: win.isMaximized ? 'calc(100vh - 68px)' : `${win.size.height}px`
      }}
      className={`fixed flex flex-col overflow-hidden transition-all duration-150 ${
        win.isMaximized ? 'rounded-none' : 'rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)]'
      } ${
        isActive 
          ? 'border border-white/20 ring-1 ring-cyan-500/30' 
          : 'border border-slate-800/80 opacity-95'
      } bg-slate-950/95 backdrop-blur-3xl`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
        className={`h-11 px-4 flex items-center justify-between select-none cursor-move border-b transition-colors ${
          isActive 
            ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
            : 'bg-slate-950/90 border-slate-800/60 text-slate-400'
        }`}
      >
        {/* Title & Status */}
        <div className="flex items-center space-x-2.5 truncate">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="text-xs font-semibold tracking-wide truncate">{win.title}</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Admin Mode
          </span>
        </div>

        {/* Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center space-x-1" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={onMinimize}
            title="Minimize"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onMaximize}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            {win.isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white text-slate-400 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-hidden relative bg-slate-950/70">
        {children}
      </div>
    </div>
  );
};
