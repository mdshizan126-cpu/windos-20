export type WindowId = 'security-center' | 'admin-console' | 'task-guard' | 'terminal' | 'system-info' | 'bitlocker-vault';

export interface WindowState {
  id: WindowId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type SecurityStatus = 'active' | 'warning' | 'disabled' | 'evaluating';

export interface SecurityFeature {
  id: string;
  name: string;
  category: 'core' | 'admin' | 'network' | 'hardware' | 'identity';
  description: string;
  status: SecurityStatus;
  badge: string;
  isElevated: boolean;
  iconName: string;
  details: string;
  toggleable: boolean;
  lastVerified: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: 'Global Administrator' | 'Security Officer' | 'Kernel Operator' | 'Standard User';
  email: string;
  isCurrentUser: boolean;
  isElevated: boolean;
  mfaEnforced: boolean;
  lastActive: string;
  privileges: string[];
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  eventId: number;
  eventName: string;
  severity: 'audit_success' | 'info' | 'warning' | 'critical';
  process: string;
  user: string;
  description: string;
}

export interface NetworkConnection {
  id: string;
  process: string;
  pid: number;
  protocol: 'TCP' | 'UDP' | 'DoH' | 'QUIC';
  localAddress: string;
  remoteAddress: string;
  state: 'ESTABLISHED' | 'LISTENING' | 'INSPECTING' | 'BLOCKED';
  status: 'allowed' | 'restricted' | 'blocked';
  bytesSec: string;
}

export interface SystemProcess {
  pid: number;
  name: string;
  user: string;
  integrity: 'Kernel' | 'System' | 'High (Admin)' | 'Medium' | 'AppContainer';
  cpu: number;
  memoryMB: number;
  status: 'Running' | 'Protected' | 'Suspended';
  isProtectedKernel: boolean;
}

export interface UACRequest {
  id: string;
  isOpen: boolean;
  programName: string;
  publisher: string;
  origin: string;
  command: string;
  securityImpact: 'High' | 'Critical';
}

export interface ScanState {
  isScanning: boolean;
  scanType: 'quick' | 'kernel_deep' | 'memory';
  progress: number;
  filesScanned: number;
  threatsFound: number;
  currentPath: string;
  completed: boolean;
  durationSeconds: number;
}

export interface WallpaperOption {
  id: string;
  name: string;
  theme: 'bloom' | 'dark-obsidian' | 'cyber-aurora' | 'solstice-glass' | 'emerald-matrix';
  previewColor: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  source: string;
  read: boolean;
}
