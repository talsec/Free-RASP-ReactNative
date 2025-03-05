import { Platform } from 'react-native';

export class Threat {
  value: number;

  static AppIntegrity = new Threat(0);
  static PrivilegedAccess = new Threat(0);
  static Debug = new Threat(0);
  static Hooks = new Threat(0);
  static Passcode = new Threat(0);
  static Simulator = new Threat(0);
  static SecureHardwareNotAvailable = new Threat(0);
  static SystemVPN = new Threat(0);
  static DeviceBinding = new Threat(0);
  static DeviceID = new Threat(0);
  static UnofficialStore = new Threat(0);
  static ObfuscationIssues = new Threat(0);
  static DevMode = new Threat(0);
  static Malware = new Threat(0);
  static ADBEnabled = new Threat(0);
  static Screenshot = new Threat(0);
  static ScreenRecording = new Threat(0);

  constructor(value: number) {
    this.value = value;
  }

  static getValues(): Threat[] {
    return Platform.OS === 'android'
      ? [
          this.AppIntegrity,
          this.PrivilegedAccess,
          this.Debug,
          this.Hooks,
          this.Passcode,
          this.Simulator,
          this.SecureHardwareNotAvailable,
          this.SystemVPN,
          this.DeviceBinding,
          this.UnofficialStore,
          this.ObfuscationIssues,
          this.DevMode,
          this.Malware,
          this.ADBEnabled,
          this.Screenshot,
          this.ScreenRecording,
        ]
      : [
          this.AppIntegrity,
          this.PrivilegedAccess,
          this.Debug,
          this.Hooks,
          this.Passcode,
          this.Simulator,
          this.SecureHardwareNotAvailable,
          this.SystemVPN,
          this.DeviceBinding,
          this.DeviceID,
          this.UnofficialStore,
          this.Screenshot,
          this.ScreenRecording,
        ];
  }
}
