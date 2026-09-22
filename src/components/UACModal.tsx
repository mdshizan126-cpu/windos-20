import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, X, Lock, KeyRound } from 'lucide-react';
import { UACRequest } from '../types';

interface UACModalProps {
  request: UACRequest | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UACModal: React.FC<UACModalProps> = ({ request, onConfirm, onCancel }) => {
  const [pin, setPin] = useState('');
  const [usePin, setUsePin] = useState(false);
  const [error, setError] = useState(false);

  if (!request || !request.isOpen) return null;

  const handleVerify = () => {
    if (usePin && pin !== '2026' && pin.length > 0 && pin !== '1234') {
      setError(true);
      setTimeout(() => setError(false), 1500);
      return;
    }
    onConfirm();
    setPin('');
  };

  return (
    <AnimatePresence>
      <div 
        id="uac-secure-desktop-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 340 }}
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-[#1c2230]/95 border border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-slate-100 backdrop-blur-2xl"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-transparent px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-inner">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-amber-400">
                  User Account Control • Admin Elevation
                </h3>
                <p className="text-xs text-slate-400">Windows 20 Virtual Secure Mode</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-medium text-slate-100">
                Do you want to allow this application to make changes to your device?
              </h2>
              <p className="text-xs text-slate-400">
                An application requires elevated administrative privileges to modify protected kernel parameters.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/80 border border-slate-700/60 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Program name:</span>
                <span className="font-semibold text-sky-300 font-mono">{request.programName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Verified publisher:</span>
                <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {request.publisher}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">File origin:</span>
                <span className="text-slate-300 font-mono truncate max-w-[260px]">{request.origin}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Impact Assessment:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {request.securityImpact} Administrative Token
                </span>
              </div>
            </div>

            {/* Authentication mode toggle */}
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 p-3 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-sky-400" />
                  Elevating as: <strong className="text-white">Alex Vance (Administrator)</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setUsePin(!usePin)}
                  className="text-sky-400 hover:text-sky-300 underline font-medium text-[11px]"
                >
                  {usePin ? 'Use Windows Hello Biometric' : 'Enter PIN / Passkey'}
                </button>
              </div>

              {usePin ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter Admin PIN (e.g. 2026)"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-[11px] text-red-400">Incorrect PIN. Try PIN: 2026 or click Yes directly.</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Windows Hello Face / Passkey Attestation Ready
                  </span>
                  <span className="text-slate-500 font-mono">VSM-Enforced</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-slate-950/70 px-6 py-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              id="uac-cancel-btn"
              onClick={onCancel}
              className="px-5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all cursor-pointer"
            >
              No, Deny Access
            </button>
            <button
              id="uac-confirm-btn"
              onClick={handleVerify}
              className="px-6 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md shadow-amber-500/20 border border-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Yes, Grant Elevation
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
