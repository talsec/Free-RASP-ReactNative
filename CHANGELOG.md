## 1.1.0

#### Android

- 🆕 Android now has support for device state callbacks:
  - 📲 **Secure Hardware Not Available**: fires when hardware-backed KeyStore is not available
  - 📲 **Passcode**: fires when freeRASP detects unlocked bootloader on the device

#### iOS

- ⛙ `Missing Secure Enclave` detection becomes **`Secure Hardware Not Available`** to match the newly added Android callback. The functionality remains unchanged.

## 1.0.0

- Initial release of freeRASP.
