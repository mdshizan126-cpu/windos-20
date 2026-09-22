import { SecurityFeature, AdminUser, SecurityEventLog, NetworkConnection, SystemProcess, WallpaperOption, SystemAlert } from '../types';

export const INITIAL_SECURITY_FEATURES: SecurityFeature[] = [
  {
    id: 'hvci',
    name: 'Memory Integrity (HVCI)',
    category: 'core',
    description: 'Hypervisor-protected code integrity runs kernel processes inside an isolated virtual container.',
    status: 'active',
    badge: 'Hardware Isolated',
    isElevated: true,
    iconName: 'Cpu',
    details: 'Virtualization-based Security (VBS) is enabled and enforcing W^X (Write XOR Execute) memory pages.',
    toggleable: true,
    lastVerified: 'Just now'
  },
  {
    id: 'realtime_defender',
    name: 'Windows 20 Neural Defender',
    category: 'core',
    description: 'Continuous heuristic and on-device neural model scanning for zero-day threats and unauthorized modifications.',
    status: 'active',
    badge: 'Neural Engine Active',
    isElevated: true,
    iconName: 'ShieldCheck',
    details: 'Cloud-delivered definition v2026.09.2204. Zero active virus signatures detected across 428,910 objects.',
    toggleable: true,
    lastVerified: '12 seconds ago'
  },
  {
    id: 'uac_elevation',
    name: 'User Account Control (UAC) - Level 4',
    category: 'admin',
    description: 'Enforces secure desktop isolation and requires biometric or PIN authentication before running elevated administrative tokens.',
    status: 'active',
    badge: 'Always Notify & Secure Desktop',
    isElevated: true,
    iconName: 'Lock',
    details: 'Admin Approval Mode is mandatory for all built-in and third-party executable runtimes.',
    toggleable: true,
    lastVerified: 'Active policy'
  },
  {
    id: 'bitlocker',
    name: 'BitLocker 2.0 Hardware Drive Vault',
    category: 'hardware',
    description: 'XTS-AES 256-bit full disk volume encryption tied to hardware TPM 3.0 platform registers.',
    status: 'active',
    badge: '100% Encrypted (NVMe C:)',
    isElevated: true,
    iconName: 'HardDrive',
    details: 'Volume Status: Fully Protected. Hardware key bound to PCR[0,2,4,7,11]. Auto-lock on physical chassis intrusion.',
    toggleable: false,
    lastVerified: 'Boot validation passed'
  },
  {
    id: 'smartscreen',
    name: 'SmartScreen Zero-Trust App Guard',
    category: 'core',
    description: 'Blocks unsigned binaries, reputation-deficient installers, and unauthorized PowerShell scripts.',
    status: 'active',
    badge: 'Zero-Trust Enforced',
    isElevated: false,
    iconName: 'FileText',
    details: 'Reputation analysis filters out untrusted downloads. Execution boundary containerizes sandbox downloads.',
    toggleable: true,
    lastVerified: 'Online'
  },
  {
    id: 'kernel_dma',
    name: 'Kernel DMA Protection & IOMMU',
    category: 'hardware',
    description: 'Shields PCIe and Thunderbolt ports from Direct Memory Access attacks and unauthorized hardware injection.',
    status: 'active',
    badge: 'Bus Lock Active',
    isElevated: true,
    iconName: 'Activity',
    details: 'External DMA remapping table locked to validated peripheral device IDs only.',
    toggleable: true,
    lastVerified: 'Hardware verified'
  },
  {
    id: 'tpm_attestation',
    name: 'TPM 3.0 Cryptographic Attestation',
    category: 'hardware',
    description: 'Secure cryptoprocessor verifies boot chain integrity from UEFI firmware to OS kernel loader.',
    status: 'active',
    badge: 'Platform Attested',
    isElevated: true,
    iconName: 'Key',
    details: 'Manufacturer: MSFT TPM 3.0 Revision 1.8. Health state: Normal. Platform certificate chain valid.',
    toggleable: false,
    lastVerified: 'Valid'
  },
  {
    id: 'firewall_adaptive',
    name: 'Adaptive Quantum-Resistant Firewall',
    category: 'network',
    description: 'Deep packet inspection for all IPv4/IPv6, QUIC, and DNS-over-HTTPS inbound & outbound telemetry.',
    status: 'active',
    badge: 'All Profiles Guarded',
    isElevated: false,
    iconName: 'Globe',
    details: 'Domain: Block Inbound / Allow Outbound. Private: Block Inbound. Zero open listening unauthenticated ports.',
    toggleable: true,
    lastVerified: 'Filtering live'
  },
  {
    id: 'windows_hello',
    name: 'Windows Hello Advanced Biometrics',
    category: 'identity',
    description: 'Infrared facial recognition and FIDO2 passkeys with anti-spoofing liveness verification.',
    status: 'active',
    badge: 'Anti-Spoofing Level 3',
    isElevated: false,
    iconName: 'ScanFace',
    details: 'Biometric telemetry stored exclusively in isolated virtual enclave (Virtual Secure Mode).',
    toggleable: true,
    lastVerified: 'Enrolled'
  },
  {
    id: 'exploit_mitigation',
    name: 'Kernel Exploit & ROP Mitigation',
    category: 'core',
    description: 'Hardware-enforced Stack Protection (CET), Control Flow Guard (CFG), and Arbitrary Code Guard (ACG).',
    status: 'active',
    badge: 'CET Shadow Stack Active',
    isElevated: true,
    iconName: 'ShieldAlert',
    details: 'Zero buffer overflows or Return-Oriented Programming gadget chains permitted in user or kernel space.',
    toggleable: true,
    lastVerified: 'Strict'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-01',
    name: 'Alex Vance',
    username: 'alex.vance@system.internal',
    role: 'Global Administrator',
    email: 'alex.vance@enterprise.local',
    isCurrentUser: true,
    isElevated: true,
    mfaEnforced: true,
    lastActive: 'Currently active',
    privileges: [
      'SeDebugPrivilege (Debug programs)',
      'SeSecurityPrivilege (Manage auditing and security log)',
      'SeTakeOwnershipPrivilege (Take ownership of files or objects)',
      'SeTcbPrivilege (Act as part of operating system)',
      'SeBackupPrivilege (Back up files and directories)',
      'SeLoadDriverPrivilege (Load and unload device drivers)'
    ]
  },
  {
    id: 'usr-02',
    name: 'System Security Service (SYSTEM)',
    username: 'NT AUTHORITY\\SYSTEM',
    role: 'Kernel Operator',
    email: 'system@local',
    isCurrentUser: false,
    isElevated: true,
    mfaEnforced: true,
    lastActive: 'Always active',
    privileges: [
      'SeCreateTokenPrivilege',
      'SeAssignPrimaryTokenPrivilege',
      'SeLockMemoryPrivilege',
      'SeAuditPrivilege'
    ]
  },
  {
    id: 'usr-03',
    name: 'Sarah Connor',
    username: 's.connor@sec.corp',
    role: 'Security Officer',
    email: 's.connor@enterprise.local',
    isCurrentUser: false,
    isElevated: false,
    mfaEnforced: true,
    lastActive: '34 minutes ago',
    privileges: [
      'SeAuditPrivilege (Generate security audits)',
      'SeChangeNotifyPrivilege (Bypass traverse checking)',
      'SeProfileSingleProcessPrivilege'
    ]
  },
  {
    id: 'usr-04',
    name: 'Guest / Sandbox Profile',
    username: 'LOCAL\\StandardGuest',
    role: 'Standard User',
    email: 'sandbox@guest.local',
    isCurrentUser: false,
    isElevated: false,
    mfaEnforced: false,
    lastActive: 'Yesterday 18:22',
    privileges: [
      'SeChangeNotifyPrivilege',
      'SeUndockPrivilege'
    ]
  }
];

export const INITIAL_EVENT_LOGS: SecurityEventLog[] = [
  {
    id: 'log-101',
    timestamp: '00:19:12',
    eventId: 4672,
    eventName: 'Special Privileges Assigned',
    severity: 'audit_success',
    process: 'C:\\Windows\\System32\\lsass.exe',
    user: 'alex.vance (Administrator)',
    description: 'Administrative privileges granted: SeDebugPrivilege, SeSecurityPrivilege, SeTcbPrivilege.'
  },
  {
    id: 'log-102',
    timestamp: '00:18:45',
    eventId: 5038,
    eventName: 'Code Integrity Hash Validated',
    severity: 'info',
    process: 'C:\\Windows\\System32\\ntoskrnl.exe',
    user: 'NT AUTHORITY\\SYSTEM',
    description: 'Kernel module digital signature verified by Microsoft Production Root CA 2026.'
  },
  {
    id: 'log-103',
    timestamp: '00:17:30',
    eventId: 4624,
    eventName: 'Successful Interactive Logon',
    severity: 'audit_success',
    process: 'C:\\Windows\\System32\\winlogon.exe',
    user: 'alex.vance',
    description: 'Logon type 2 (Interactive). Windows Hello Face biometric token verified in Virtual Secure Mode.'
  },
  {
    id: 'log-104',
    timestamp: '00:15:10',
    eventId: 7045,
    eventName: 'Service Created & Enforced',
    severity: 'info',
    process: 'C:\\Windows\\System32\\services.exe',
    user: 'NT AUTHORITY\\SYSTEM',
    description: 'A new service was installed: Win20-NeuralShieldCore.sys (StartType: Automatic / Protected).'
  },
  {
    id: 'log-105',
    timestamp: '00:11:02',
    eventId: 4688,
    eventName: 'A New Process Was Created',
    severity: 'info',
    process: 'C:\\Windows\\System32\\cmd.exe',
    user: 'alex.vance (Elevated)',
    description: 'Token Elevation Type: Full (UAC Token Elevation). Mandatory Integrity: High.'
  },
  {
    id: 'log-106',
    timestamp: '00:08:44',
    eventId: 5156,
    eventName: 'Firewall Filter Packet Allowed',
    severity: 'info',
    process: 'C:\\Program Files\\WindowsApps\\Edge.exe',
    user: 'alex.vance',
    description: 'Outbound TCP connection to 142.250.190.46:443 permitted under Private profile rule #1402.'
  },
  {
    id: 'log-107',
    timestamp: '00:02:18',
    eventId: 1102,
    eventName: 'Audit Log Defense Active',
    severity: 'audit_success',
    process: 'C:\\Windows\\System32\\svchost.exe',
    user: 'NT AUTHORITY\\SYSTEM',
    description: 'Security event log write integrity validated. Tamper protection lock active.'
  }
];

export const INITIAL_NETWORK_CONNECTIONS: NetworkConnection[] = [
  {
    id: 'net-01',
    process: 'System (NT Kernel)',
    pid: 4,
    protocol: 'TCP',
    localAddress: '192.168.1.105:445',
    remoteAddress: '0.0.0.0:* (LISTEN)',
    state: 'LISTENING',
    status: 'allowed',
    bytesSec: '0 B/s'
  },
  {
    id: 'net-02',
    process: 'NeuralShieldCore.exe',
    pid: 1420,
    protocol: 'DoH',
    localAddress: '192.168.1.105:54912',
    remoteAddress: 'security.microsoft.com:443',
    state: 'ESTABLISHED',
    status: 'allowed',
    bytesSec: '42.8 KB/s'
  },
  {
    id: 'net-03',
    process: 'lsass.exe (LSA Isolation)',
    pid: 820,
    protocol: 'TCP',
    localAddress: '127.0.0.1:49667',
    remoteAddress: '127.0.0.1:49668',
    state: 'ESTABLISHED',
    status: 'allowed',
    bytesSec: '1.2 KB/s'
  },
  {
    id: 'net-04',
    process: 'WindowsUpdateClient.exe',
    pid: 3188,
    protocol: 'QUIC',
    localAddress: '192.168.1.105:58921',
    remoteAddress: 'update.windows.com:443',
    state: 'ESTABLISHED',
    status: 'allowed',
    bytesSec: '128.4 KB/s'
  },
  {
    id: 'net-05',
    process: 'svchost.exe (RPC Endpoint)',
    pid: 994,
    protocol: 'TCP',
    localAddress: '0.0.0.0:135',
    remoteAddress: '0.0.0.0:* (LISTEN)',
    state: 'LISTENING',
    status: 'restricted',
    bytesSec: '0 B/s'
  },
  {
    id: 'net-06',
    process: 'UntrustedInboundProbe (Blocked)',
    pid: 0,
    protocol: 'TCP',
    localAddress: '192.168.1.105:3389',
    remoteAddress: '198.51.100.77:49201',
    state: 'BLOCKED',
    status: 'blocked',
    bytesSec: '0 B/s'
  }
];

export const INITIAL_PROCESSES: SystemProcess[] = [
  {
    pid: 4,
    name: 'System Kernel Core',
    user: 'NT AUTHORITY\\SYSTEM',
    integrity: 'Kernel',
    cpu: 0.8,
    memoryMB: 142.4,
    status: 'Protected',
    isProtectedKernel: true
  },
  {
    pid: 820,
    name: 'lsass.exe (Credential Guard)',
    user: 'NT AUTHORITY\\SYSTEM',
    integrity: 'Kernel',
    cpu: 0.2,
    memoryMB: 48.1,
    status: 'Protected',
    isProtectedKernel: true
  },
  {
    pid: 980,
    name: 'winlogon.exe (Hello Biometrics)',
    user: 'NT AUTHORITY\\SYSTEM',
    integrity: 'System',
    cpu: 0.1,
    memoryMB: 32.5,
    status: 'Running',
    isProtectedKernel: true
  },
  {
    pid: 1420,
    name: 'Windows 20 Defender Neural Service',
    user: 'NT AUTHORITY\\SYSTEM',
    integrity: 'System',
    cpu: 2.1,
    memoryMB: 198.6,
    status: 'Running',
    isProtectedKernel: true
  },
  {
    pid: 2404,
    name: 'explorer.exe (Shell UI)',
    user: 'alex.vance',
    integrity: 'High (Admin)',
    cpu: 1.4,
    memoryMB: 184.2,
    status: 'Running',
    isProtectedKernel: false
  },
  {
    pid: 3912,
    name: 'AdminSecurityConsole.exe',
    user: 'alex.vance (Elevated)',
    integrity: 'High (Admin)',
    cpu: 0.6,
    memoryMB: 94.0,
    status: 'Running',
    isProtectedKernel: false
  },
  {
    pid: 5120,
    name: 'PowerShell 7.5 (Administrator)',
    user: 'alex.vance (Elevated)',
    integrity: 'High (Admin)',
    cpu: 0.4,
    memoryMB: 68.3,
    status: 'Running',
    isProtectedKernel: false
  },
  {
    pid: 6180,
    name: 'Microsoft Edge Sandbox Process',
    user: 'alex.vance',
    integrity: 'AppContainer',
    cpu: 3.2,
    memoryMB: 280.9,
    status: 'Running',
    isProtectedKernel: false
  }
];

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'bloom',
    name: 'Windows 20 Prism Bloom',
    theme: 'bloom',
    previewColor: '#2b5876'
  },
  {
    id: 'dark-obsidian',
    name: 'Obsidian Cobalt Security',
    theme: 'dark-obsidian',
    previewColor: '#0f172a'
  },
  {
    id: 'cyber-aurora',
    name: 'Nordic Cyber Aurora',
    theme: 'cyber-aurora',
    previewColor: '#042f2e'
  },
  {
    id: 'emerald-matrix',
    name: 'Shield Matrix Emerald',
    theme: 'emerald-matrix',
    previewColor: '#064e3b'
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    title: 'Zero-Trust Defense Active',
    message: 'Windows 20 Kernel Isolation and TPM 3.0 Attestation are functioning at maximum security tier.',
    timestamp: '2m ago',
    severity: 'success',
    source: 'Security Center',
    read: false
  },
  {
    id: 'alt-2',
    title: 'BitLocker Volume Verified',
    message: 'NVMe Volume C: key integrity checked against hardware platform registers successfully.',
    timestamp: '15m ago',
    severity: 'info',
    source: 'Drive Vault',
    read: false
  },
  {
    id: 'alt-3',
    title: 'UAC Admin Mode Enforced',
    message: 'All administrative privilege requests require active user confirmation and biometric check.',
    timestamp: '1h ago',
    severity: 'info',
    source: 'Account Control',
    read: true
  }
];
