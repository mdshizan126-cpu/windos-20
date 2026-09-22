import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Unlock, ScanFace, KeyRound, Wifi, Battery, AlertCircle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  userName?: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  userName = 'Alex Vance'
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [authMode, setAuthMode] = useState<'hello' | 'pin'>('hello');
  const [isScanningFace, setIsScanningFace] = useState<boolean>(true);
  const [pinError, setPinError] = useState<boolean>(false);
  const [showKeypad, setShowKeypad] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLocked) {
      setIsScanningFace(true);
      const timer = setTimeout(() => {
        setIsScanningFace(false);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  if (!isLocked) return null;

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '2026' || pin === '1234' || pin.length >= 4) {
      setPinError(false);
      onUnlock();
      setPin('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1800);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pin.length < 6) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4 && (newPin === '2026' || newPin === '1234')) {
        setTimeout(onUnlock, 150);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100, transition: { duration: 0.35, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9000] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-[#0d1627] to-[#050b14] text-white select-none"
    >
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-indigo-600/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* Top Bar: Security Enclave Status Indicators */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TPM 3.0 Attestation Active</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>VBS / HVCI Enforced</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>BitLocker XTS-AES 256 Locked</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-1.5">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Secured Mesh</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span>98%</span>
          </div>
        </div>
      </header>

      {/* Middle Center: Time, Windows Hello Scanner & Unlock Panel */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto">
        {/* Time and Date Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-1 mb-8"
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] font-sans">
            {time || '00:00:00'}
          </h1>
          <p className="text-base sm:text-lg font-light text-slate-300 tracking-wider">
            {date || 'Loading System Clock...'}
          </p>
        </motion.div>

        {/* User Card & Biometric / PIN Unlocker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm rounded-3xl bg-slate-900/60 border border-white/15 p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5"
        >
          {/* Avatar and Identity */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-semibold text-white">
                  AV
                </div>
              </div>
              
              {/* Windows Hello Biometric Radar Ring */}
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-950 border border-cyan-400/60 shadow">
                <ScanFace className={`w-4 h-4 text-cyan-300 ${isScanningFace ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            <h2 className="text-lg font-medium text-white">{userName}</h2>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Global Administrator • Elevated</span>
            </div>
          </div>

          {/* Windows Hello Status or PIN Input */}
          <div className="space-y-3">
            {authMode === 'hello' ? (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-cyan-300 font-medium">
                    {isScanningFace ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>Windows Hello: Verifying Facial Biometrics...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Identity Authenticated • VSM Key Matched</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Anti-spoofing IR scan passed platform verification.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    id="btn-unlock-hello"
                    onClick={onUnlock}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Workstation</span>
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode('pin');
                      setShowKeypad(true);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Switch to PIN / Passkey</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePinSubmit} className="space-y-3">
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter PIN (Default: 2026)"
                      className="w-full py-2.5 px-4 pr-10 text-center tracking-[0.4em] font-mono rounded-xl bg-black/40 border border-white/20 text-white placeholder:text-slate-500 placeholder:tracking-normal placeholder:font-sans text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-cyan-400 hover:text-cyan-300 transition"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {pinError && (
                    <p className="text-[11px] text-red-400 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Invalid PIN. Default demo PIN is 2026</span>
                    </p>
                  )}
                </div>

                {/* Keypad */}
                {showKeypad && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handleKeypadPress(digit)}
                        className="py-2.5 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 text-sm font-medium transition cursor-pointer text-slate-200"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPin('')}
                      className="py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400"
                    >
                      CLR
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-slate-200"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('2026')}
                      className="py-2.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/30 text-xs text-cyan-300 font-semibold"
                    >
                      AUTO
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('hello')}
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                  >
                    <ScanFace className="w-3.5 h-3.5" />
                    <span>Back to Face ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={onUnlock}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-mono"
                  >
                    Admin Bypass
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer: System Integrity Details */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-8 py-5 text-xs text-slate-400 border-t border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-300">Windows 20 Enterprise • Build 28400.1004</span>
        </div>
        <div className="flex items-center space-x-6 text-[11px] font-mono">
          <span>Security Isolation: Enforced</span>
          <span>Zero-Trust Boundary: Active</span>
          <span>Press Any Key / Click Unlock</span>
        </div>
      </footer>
    </motion.div>
  );
};
