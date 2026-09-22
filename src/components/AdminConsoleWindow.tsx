import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Key, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  Lock, 
  Plus, 
  Trash2, 
  AlertTriangle,
  RefreshCw,
  LogOut,
  Fingerprint,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { AdminUser } from '../types';

interface AdminConsoleWindowProps {
  users: AdminUser[];
  onToggleUserPrivilege: (userId: string, privilege: string) => void;
  onRequestUAC: (appName: string) => void;
  onLockScreen: () => void;
  onAddAlert: (title: string, message: string, severity?: 'info' | 'success' | 'warning' | 'critical') => void;
}

export const AdminConsoleWindow: React.FC<AdminConsoleWindowProps> = ({
  users,
  onToggleUserPrivilege,
  onRequestUAC,
  onLockScreen,
  onAddAlert
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || 'usr-01');
  const [activeTab, setActiveTab] = useState<'users' | 'gpo' | 'sessions'>('users');

  // GPO State toggles
  const [gpoPolicies, setGpoPolicies] = useState([
    {
      id: 'gpo-1',
      name: 'Enforce MFA / Biometrics for Administrator Elevation',
      category: 'Identity & Access',
      enabled: true,
      description: 'Demands Windows Hello face or FIDO2 hardware key validation for every administrative credential elevation.'
    },
    {
      id: 'gpo-2',
      name: 'Chassis & USB Storage Lock on Workstation Lock',
      category: 'Device Control',
      enabled: true,
      description: 'Automatically unmounts and isolates removable USB storage controllers whenever workstation is locked.'
    },
    {
      id: 'gpo-3',
      name: 'Mandatory Driver Code Signing Enforcement',
      category: 'Kernel Security',
      enabled: true,
      description: 'Strictly forbids loading device drivers without valid WHQL or Microsoft Hardware Dev Center digital signatures.'
    },
    {
      id: 'gpo-4',
      name: 'PowerShell Constrained Language Mode for Non-Admins',
      category: 'Script Security',
      enabled: true,
      description: 'Prevents standard users from executing arbitrary unvetted .NET objects or reflection APIs.'
    },
    {
      id: 'gpo-5',
      name: 'Remote Desktop Network Level Authentication (NLA)',
      category: 'Network Access',
      enabled: true,
      description: 'Enforces pre-authentication using CredSSP before initiating RDP encrypted tunnels.'
    }
  ]);

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  const handleToggleGPO = (id: string) => {
    setGpoPolicies(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.enabled;
        onAddAlert(
          'Group Policy Updated',
          `Policy "${p.name}" has been ${nextState ? 'enforced' : 'relaxed'}.`,
          nextState ? 'success' : 'warning'
        );
        return { ...p, enabled: nextState };
      }
      return p;
    }));
  };

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-56 sm:w-60 border-r border-slate-800/80 bg-slate-900/60 p-4 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Admin Console</h2>
              <span className="text-[11px] font-mono text-amber-400">Access Control Manager</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>User Accounts &amp; Roles</span>
            </button>

            <button
              onClick={() => setActiveTab('gpo')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'gpo'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Group Policy Objects (GPO)</span>
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'sessions'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Active Admin Sessions</span>
            </button>
          </nav>
        </div>

        {/* Lock Workstation Quick Action */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onLockScreen}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Workstation (Win+L)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ===================== TAB 1: USERS & PRIVILEGES ===================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">Administrative Accounts &amp; Token Privileges</h1>
                <p className="text-xs text-slate-400">
                  Manage Local Security Authority (LSA) token rights and user elevation.
                </p>
              </div>

              <button
                onClick={() => onRequestUAC('Account Provisioning Manager')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Elevate New Administrator</span>
              </button>
            </div>

            {/* User Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    selectedUserId === user.id
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-800/80">
                    <span className={user.isElevated ? 'text-amber-400' : 'text-slate-400'}>
                      {user.isElevated ? 'Elevated' : 'Standard'}
                    </span>
                    {user.mfaEnforced && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" />
                        MFA
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected User Detail Card */}
            {selectedUser && (
              <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-base font-bold text-slate-950 shadow-md">
                      {selectedUser.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        {selectedUser.name}
                        {selectedUser.isCurrentUser && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Current Session
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">{selectedUser.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-amber-300 border border-slate-700">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                {/* Assigned Privileges Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Assigned Security Token Privileges ({selectedUser.privileges.length})
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">NT Token Rights</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                    {selectedUser.privileges.map((priv, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                      >
                        <span className="text-slate-300 truncate mr-2">{priv}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: GROUP POLICY OBJECTS ===================== */}
        {activeTab === 'gpo' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl font-bold text-white">Group Policy Objects (GPO) Security Boundaries</h1>
              <p className="text-xs text-slate-400">
                Machine-wide administrative security configurations and compliance locks.
              </p>
            </div>

            <div className="space-y-3">
              {gpoPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {policy.category}
                      </span>
                      <h3 className="text-xs font-semibold text-white">{policy.name}</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {policy.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleGPO(policy.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                      policy.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{policy.enabled ? 'Enforced' : 'Disabled'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: ACTIVE SESSIONS ===================== */}
        {activeTab === 'sessions' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl font-bold text-white">Active Administrative Logon Sessions</h1>
              <p className="text-xs text-slate-400">
                Inspect live security tokens, interactive desktop handles, and remote sessions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Session 1 (Console - Primary Interactive)</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      User: alex.vance | Auth: Windows Hello Face (VSM Enclave) | State: Active
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLockScreen}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-semibold transition"
                >
                  Lock Session
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Session 0 (Isolated Services &amp; Daemons)</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      User: NT AUTHORITY\SYSTEM | Protected Kernel Process Boundaries: Active
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400 px-3 py-1 bg-slate-800 rounded-lg">
                  Non-Interactive
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
