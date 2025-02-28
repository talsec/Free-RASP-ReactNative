export const commonChecks = [
  { name: 'App Integrity', status: 'ok' },
  { name: 'Privileged Access', status: 'ok' },
  { name: 'Debug', status: 'ok' },
  { name: 'Hooks', status: 'ok' },
  { name: 'Passcode', status: 'ok' },
  { name: 'Simulator', status: 'ok' },
  { name: 'Secure Hardware Not Available', status: 'ok' },
  { name: 'System VPN', status: 'ok' },
  { name: 'Device Binding', status: 'ok' },
  { name: 'Unofficial Store', status: 'ok' },
  { name: 'Screenshot', status: 'ok' },
  { name: 'Screen Recording', status: 'ok' },
];

export const iosChecks = [{ name: 'Device ID', status: 'ok' }];

export const androidChecks = [
  { name: 'Obfuscation Issues', status: 'ok' },
  { name: 'Developer Mode', status: 'ok' },
  { name: 'Malware', status: 'ok' },
  { name: 'ADB Enabled', status: 'ok' },
];
