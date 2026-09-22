import React, { useState, useEffect, useCallback } from 'react';
import { 
  WindowId, 
  WindowState, 
  SecurityFeature, 
  AdminUser, 
  SecurityEventLog, 
  NetworkConnection, 
  SystemProcess, 
  UACRequest, 
  WallpaperOption, 
  SystemAlert 
} from './types';
import { 
  INITIAL_SECURITY_FEATURES, 
  INITIAL_ADMIN_USERS, 
  INITIAL_EVENT_LOGS, 
  INITIAL_NETWORK_CONNECTIONS, 
  INITIAL_PROCESSES, 
  WALLPAPERS, 
  INITIAL_ALERTS 
} from './data/mockSecurityData';
import { LockScreen } from './components/LockScreen';
import { UACModal } from './components/UACModal';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { WindowFrame } from './components/WindowFrame';
import { SecurityCenterWindow } from './components/SecurityCenterWindow';
import { AdminConsoleWindow } from './components/AdminConsoleWindow';
import { TaskGuardWindow } from './components/TaskGuardWindow';
import { TerminalAdminWindow } from './components/TerminalAdminWindow';
import { SystemInfoWindow } from './components/SystemInfoWindow';

export default function App() {
  // Lock screen state
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // UAC prompt state
  const [uacRequest, setUacRequest] = useState<UACRequest | null>(null);

  // Administrative Lockdown mode toggle
  const [adminLockdownActive, setAdminLockdownActive] = useState<boolean>(false);

  // Active Wallpaper
  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperOption>(WALLPAPERS[0]);

  // System alerts / notifications
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);

  // Security features state
  const [features, setFeatures] = useState<SecurityFeature[]>(INITIAL_SECURITY_FEATURES);

  // Users & Privileges
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);

  // Security Event Logs
  const [eventLogs, setEventLogs] = useState<SecurityEventLog[]>(INITIAL_EVENT_LOGS);

  // Network Connections
  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>(INITIAL_NETWORK_CONNECTIONS);

  // System processes
  const [processes, setProcesses] = useState<SystemProcess[]>(INITIAL_PROCESSES);

  // Window manager state
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    'security-center': {
      id: 'security-center',
      title: 'Windows 20 Security Center • Active Defense',
      icon: 'ShieldCheck',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 70, y: 35 },
      size: { width: 940, height: 600 }
    },
    'admin-console': {
      id: 'admin-console',
      title: 'Administrative Access Controls & Group Policy',
      icon: 'Sliders',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
      position: { x: 120, y: 70 },
      size: { width: 880, height: 560 }
    },
    'task-guard': {
      id: 'task-guard',
      title: 'Task Guard • Process Security & Integrity Levels',
      icon: 'Activity',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      position: { x: 160, y: 90 },
      size: { width: 860, height: 540 }
    },
    'terminal': {
      id: 'terminal',
      title: 'PowerShell 7.5 (Administrator)',
      icon: 'Terminal',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      position: { x: 200, y: 120 },
      size: { width: 800, height: 480 }
    },
    'system-info': {
      id: 'system-info',
      title: 'Windows 20 System Specifications & Security Attestation',
      icon: 'Settings',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      position: { x: 230, y: 140 },
      size: { width: 780, height: 520 }
    },
    'bitlocker-vault': {
      id: 'bitlocker-vault',
      title: 'BitLocker 2.0 Hardware Drive Vault',
      icon: 'HardDrive',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      position: { x: 250, y: 160 },
      size: { width: 750, height: 480 }
    }
  });

  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('security-center');
  const [maxZIndex, setMaxZIndex] = useState<number>(10);

  // Add system alert helper
  const addAlert = useCallback((
    title: string, 
    message: string, 
    severity: 'info' | 'success' | 'warning' | 'critical' = 'info'
  ) => {
    const newAlert: SystemAlert = {
      id: `alert-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      severity,
      source: 'Security Subsystem',
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  // Keyboard shortcut listener (Lock Workstation: Win+L or Alt+L or Ctrl+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.altKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setIsLocked(true);
        addAlert('Workstation Locked', 'Session locked under administrative security policy.', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addAlert]);

  // Window operations
  const focusWindow = (id: WindowId) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setActiveWindowId(id);
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ
      }
    }));
  };

  const openWindow = (id: WindowId) => {
    focusWindow(id);
  };

  const closeWindow = (id: WindowId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false
      }
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true
      }
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: WindowId) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized
      }
    }));
  };

  // Trigger UAC modal
  const requestUAC = (appName: string) => {
    setUacRequest({
      id: `uac-${Date.now()}`,
      isOpen: true,
      programName: appName,
      publisher: 'Microsoft Windows 20 Kernel Authority',
      origin: 'C:\\Windows\\System32\\secadmin.exe',
      command: `${appName} /elevated=true`,
      securityImpact: 'High'
    });
  };

  const confirmUAC = () => {
    if (uacRequest) {
      addAlert(
        'Administrative Elevation Granted',
        `Granted elevated token to ${uacRequest.programName}. Logged in security event audit channel.`,
        'success'
      );

      // Add to event logs
      const newLog: SecurityEventLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        eventId: 4672,
        eventName: 'Special Privileges Assigned to New Logon',
        severity: 'audit_success',
        process: uacRequest.origin,
        user: 'alex.vance (Administrator)',
        description: `Elevation request approved via UAC. Program: ${uacRequest.programName}.`
      };
      setEventLogs(prev => [newLog, ...prev]);
    }
    setUacRequest(null);
  };

  const cancelUAC = () => {
    if (uacRequest) {
      addAlert(
        'Elevation Request Denied',
        `User cancelled administrative elevation for ${uacRequest.programName}.`,
        'warning'
      );
    }
    setUacRequest(null);
  };

  // Toggle security feature
  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f => {
      if (f.id === id) {
        const nextStatus = f.status === 'active' ? 'disabled' : 'active';
        addAlert(
          `${f.name} Status Changed`,
          `Protection status changed to ${nextStatus}. Admin audit log recorded.`,
          nextStatus === 'active' ? 'success' : 'warning'
        );
        return {
          ...f,
          status: nextStatus
        };
      }
      return f;
    }));
  };

  // Toggle user privilege
  const toggleUserPrivilege = (userId: string, privilege: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const has = u.privileges.includes(privilege);
        const nextPrivs = has 
          ? u.privileges.filter(p => p !== privilege) 
          : [...u.privileges, privilege];
        addAlert(
          'User Token Modified',
          `Privilege ${privilege} ${has ? 'revoked from' : 'granted to'} ${u.name}.`,
          'info'
        );
        return { ...u, privileges: nextPrivs };
      }
      return u;
    }));
  };

  // Toggle Network rule
  const toggleNetworkRule = (id: string) => {
    setNetworkConnections(prev => prev.map(conn => {
      if (conn.id === id) {
        const nextStatus = conn.status === 'blocked' ? 'allowed' : 'blocked';
        const nextState = nextStatus === 'blocked' ? 'BLOCKED' : 'ESTABLISHED';
        return { ...conn, status: nextStatus, state: nextState };
      }
      return conn;
    }));
  };

  // Kill Process
  const killProcess = (pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };

  // Toggle Admin Lockdown
  const toggleAdminLockdown = () => {
    const nextState = !adminLockdownActive;
    setAdminLockdownActive(nextState);
    if (nextState) {
      addAlert(
        'ADMIN LOCKDOWN MODE ACTIVATED',
        'Workstation isolated. Unsolicited inbound sockets dropped. Strict kernel boundary enforced.',
        'critical'
      );
    } else {
      addAlert(
        'Admin Lockdown Mode Relaxed',
        'Zero-trust network baseline returned to standard enterprise profile.',
        'info'
      );
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1. Desktop Canvas & Wallpapers */}
      <Desktop
        onOpenWindow={openWindow}
        onLockScreen={() => setIsLocked(true)}
        onRequestUAC={requestUAC}
        currentWallpaper={currentWallpaper}
        wallpapers={WALLPAPERS}
        onSelectWallpaper={(wp) => setCurrentWallpaper(wp)}
      />

      {/* 2. Window Manager: Windows 20 Security Center */}
      <WindowFrame
        window={windows['security-center']}
        isActive={activeWindowId === 'security-center'}
        onFocus={() => focusWindow('security-center')}
        onClose={() => closeWindow('security-center')}
        onMinimize={() => minimizeWindow('security-center')}
        onMaximize={() => maximizeWindow('security-center')}
      >
        <SecurityCenterWindow
          features={features}
          onToggleFeature={toggleFeature}
          eventLogs={eventLogs}
          networkConnections={networkConnections}
          onToggleNetworkRule={toggleNetworkRule}
          onRequestUAC={requestUAC}
          onAddAlert={addAlert}
        />
      </WindowFrame>

      {/* 3. Window Manager: Admin Console */}
      <WindowFrame
        window={windows['admin-console']}
        isActive={activeWindowId === 'admin-console'}
        onFocus={() => focusWindow('admin-console')}
        onClose={() => closeWindow('admin-console')}
        onMinimize={() => minimizeWindow('admin-console')}
        onMaximize={() => maximizeWindow('admin-console')}
      >
        <AdminConsoleWindow
          users={users}
          onToggleUserPrivilege={toggleUserPrivilege}
          onRequestUAC={requestUAC}
          onLockScreen={() => setIsLocked(true)}
          onAddAlert={addAlert}
        />
      </WindowFrame>

      {/* 4. Window Manager: Task Guard & Process Integrity */}
      <WindowFrame
        window={windows['task-guard']}
        isActive={activeWindowId === 'task-guard'}
        onFocus={() => focusWindow('task-guard')}
        onClose={() => closeWindow('task-guard')}
        onMinimize={() => minimizeWindow('task-guard')}
        onMaximize={() => maximizeWindow('task-guard')}
      >
        <TaskGuardWindow
          processes={processes}
          onKillProcess={killProcess}
          onAddAlert={addAlert}
        />
      </WindowFrame>

      {/* 5. Window Manager: Terminal (PowerShell 7.5 Admin) */}
      <WindowFrame
        window={windows['terminal']}
        isActive={activeWindowId === 'terminal'}
        onFocus={() => focusWindow('terminal')}
        onClose={() => closeWindow('terminal')}
        onMinimize={() => minimizeWindow('terminal')}
        onMaximize={() => maximizeWindow('terminal')}
      >
        <TerminalAdminWindow
          onLockScreen={() => setIsLocked(true)}
          onRequestUAC={requestUAC}
          onAddAlert={addAlert}
        />
      </WindowFrame>

      {/* 6. Window Manager: System Specifications & Info */}
      <WindowFrame
        window={windows['system-info']}
        isActive={activeWindowId === 'system-info'}
        onFocus={() => focusWindow('system-info')}
        onClose={() => closeWindow('system-info')}
        onMinimize={() => minimizeWindow('system-info')}
        onMaximize={() => maximizeWindow('system-info')}
      >
        <SystemInfoWindow
          onCheckUpdates={() => {
            addAlert('Windows Update', 'Checking cryptographic telemetry... Your Windows 20 build is fully up to date.', 'success');
          }}
        />
      </WindowFrame>

      {/* 7. Windows 20 Taskbar & Dock */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onOpenWindow={openWindow}
        onLockScreen={() => setIsLocked(true)}
        onRequestUAC={requestUAC}
        alerts={alerts}
        onDismissAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))}
        onClearAllAlerts={() => setAlerts([])}
        adminLockdownActive={adminLockdownActive}
        onToggleAdminLockdown={toggleAdminLockdown}
      />

      {/* 8. User Account Control (UAC) Elevation Modal */}
      <UACModal
        request={uacRequest}
        onConfirm={confirmUAC}
        onCancel={cancelUAC}
      />

      {/* 9. Windows 20 Lock Screen (With Hello Face, PIN, Biometrics & Enclave) */}
      <LockScreen
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        userName="Alex Vance"
      />
    </div>
  );
}
