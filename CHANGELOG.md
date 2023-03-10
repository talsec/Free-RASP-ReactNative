# freeRASP 1.1.0

We are proud to share with you the first batch of improvements of freeRASP!

## What's new?

Android devices now support device state listeners. What's more, we unified remaining Android and iOS interfaces for more convenient developer's experience.

### Android

- 🆕 Android now has support for device state callbacks:
  - 📲 **`Secure Hardware Not Available`**: fires when hardware-backed KeyStore is not available
  - 📲 **`Passcode`**: fires when freeRASP detects that device is not secured with any type of lock

### iOS

- ❗ BREAKING API CHANGE: Renamed `Missing Secure Enclave` to **`Secure Hardware Not Available`** to match the newly added Android callback. The functionality remains unchanged.

### Other improvements

- 📄 Documentation updates and improvements

# freeRASP 1.0.0

- Initial release of freeRASP.
