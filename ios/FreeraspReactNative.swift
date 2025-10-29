import Foundation
import TalsecRuntime

@objc(FreeraspReactNative)
class FreeraspReactNative: RCTEventEmitter {

    public static var shared:FreeraspReactNative?

    let threatChannelKey = String(Int.random(in: 100_000..<999_999_999)) // key of the argument map under which threats are expected
    let threatChannelName = String(Int.random(in: 100_000..<999_999_999)) // name of the channel over which threat callbacks are sent
  
    let raspExecutionStateChannelKey = String(Int.random(in: 100_000..<999_999_999)) // key of the argument map under which threats are expected
    let raspExecutionStateChannelName = String(Int.random(in: 100_000..<999_999_999)) // name of the channel over which threat callbacks are sent

    override init() {
        super.init()
        FreeraspReactNative.shared = self
    }

    @objc(talsecStart:withResolver:withRejecter:)
    func talsecStart(options: NSDictionary, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        do {
            try initializeTalsec(talsecConfig: options)
        }
        catch let error as NSError {
            reject("TalsecInitializationError", "Could not initialize freeRASP: \(error.domain)", error)
            return
        }
        resolve("freeRASP started")
    }

    func initializeTalsec(talsecConfig: NSDictionary) throws {
        guard let iosConfig = talsecConfig["iosConfig"] as? NSDictionary else {
            throw NSError(domain: "Missing iosConfig parameter in Talsec Native Plugin", code: 1)
        }
        guard let appBundleIds = iosConfig["appBundleId"] as? String else {
            throw NSError(domain: "Missing appBundleId parameter in Talsec Native Plugin", code: 2)
        }
        guard let appTeamId = iosConfig["appTeamId"] as? String else {
            throw NSError(domain: "Missing appTeamId parameter in Talsec Native Plugin", code: 3)
        }
        guard let watcherMailAddress = talsecConfig["watcherMail"] as? String else {
            throw NSError(domain: "Missing watcherMail parameter in Talsec Native Plugin", code: 4)
        }
        let isProd = talsecConfig["isProd"] as? Bool ?? true

        let config = TalsecConfig(appBundleIds: [appBundleIds], appTeamId: appTeamId, watcherMailAddress: watcherMailAddress, isProd: isProd)
        Talsec.start(config: config)
    }

    @objc(blockScreenCapture:withResolver:withRejecter:)
    private func blockScreenCapture(enable: Bool, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        getProtectedWindow { window in
            if let window = window {
                Talsec.blockScreenCapture(enable: enable, window: window)
                resolve("Screen capture is now \((enable) ? "Blocked" : "Enabled").")
            } else {
                reject("BlockScreenCaptureError", "No windows found to block screen capture", nil)
            }
        }
    }
    
    @objc(isScreenCaptureBlocked:withRejecter:)
    private func isScreenCaptureBlocked(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        getProtectedWindow { window in
            if let window = window {
                let isBlocked = Talsec.isScreenCaptureBlocked(in: window)
                resolve(isBlocked)
            } else {
                reject("IsScreenCaptureBlockedError", "Error while checking if screen capture is blocked", nil)
            }
        }
    }
  
    @objc(storeExternalId:withResolver:withRejecter:)
    private func storeExternalId(externalId: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        UserDefaults.standard.set(externalId, forKey: "app.talsec.externalid")
        resolve("OK - Store external ID")
    }
    
    private func getProtectedWindow(completion: @escaping (UIWindow?) -> Void) {
        DispatchQueue.main.async {
            if #available(iOS 13.0, *) {
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                    if let window = windowScene.windows.first {
                        completion(window)
                    } else {
                        completion(nil)
                    }
                } else {
                    completion(nil)
                }
            }
        }
    }

    /**
     * Method to setup the message passing between native and React Native
     */
    @objc(getThreatChannelData:withRejecter:)
    private func getThreatChannelData(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        resolve([threatChannelName, threatChannelKey])
    }
  
    /**
     * Method to setup the message passing between native and React Native
     */
    @objc(getRaspExecutionStateChannelData:withRejecter:)
    private func getRaspExecutionStateChannelData(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
      resolve([raspExecutionStateChannelName, raspExecutionStateChannelKey])
    }

    func dispatchEvent(securityThreat: SecurityThreat) -> Void {
        FreeraspReactNative.shared!.sendEvent(withName: threatChannelName, body: [
            threatChannelKey: securityThreat.callbackIdentifier,
        ])
    }
  
    func dispatchRaspExecutionStateEvent(event: RaspExecutionStates) -> Void {
      FreeraspReactNative.shared!.sendEvent(withName: raspExecutionStateChannelName, body: [
        raspExecutionStateChannelKey: event.callbackIdentifier,
      ])
    }

    /**
     * Method to get the random identifiers of callbacks
     */
    @objc(getThreatIdentifiers:withRejecter:)
    private func getThreatIdentifiers(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        resolve(getThreatIdentifiers())
    }
  
    /**
     * Method to get the random identifiers of callbacks
     */
    @objc(getRaspExecutionStateIdentifiers:withRejecter:)
    private func getRaspExecutionStateIdentifiers(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        resolve(getRaspExecutionStateIdentifiers())
    }

    /**
     * We never send an invalid callback over our channel.
     * Therefore, if this happens, we want to kill the app.
     */
    @objc(onInvalidCallback)
    private func onInvalidCallback() -> Void {
        abort()
    }

    private func getThreatIdentifiers() -> [Int] {
        return SecurityThreat.allCases
            .filter {
                threat in threat.rawValue != "passcodeChange"
            }
            .map {
                threat in threat.callbackIdentifier
            }
    }
  
    private func getRaspExecutionStateIdentifiers() -> [Int] {
      return RaspExecutionStates.allCases
            .map {
                event in event.callbackIdentifier
            }
    }

    override func supportedEvents() -> [String]! {
      return [threatChannelName, raspExecutionStateChannelName]
    }
}

struct ThreatIdentifiers {
    static let threatIdentifierList: [Int] = (1...14).map { _ in Int.random(in: 100_000..<999_999_999) }
    static let raspExecutionStateIdentifierList: [Int] = (1...1).map { _ in Int.random(in: 100_000..<999_999_999) }
}

/// An extension to unify callback names with RN ones.
extension SecurityThreat {

    var callbackIdentifier: Int {
        switch self {
            case .signature:
                return ThreatIdentifiers.threatIdentifierList[0]
            case .jailbreak:
                return ThreatIdentifiers.threatIdentifierList[1]
            case .debugger:
                return ThreatIdentifiers.threatIdentifierList[2]
            case .runtimeManipulation:
                return ThreatIdentifiers.threatIdentifierList[3]
            case .passcode:
                return ThreatIdentifiers.threatIdentifierList[4]
            case .passcodeChange:
                return ThreatIdentifiers.threatIdentifierList[5]
            case .simulator:
                return ThreatIdentifiers.threatIdentifierList[6]
            case .missingSecureEnclave:
                return ThreatIdentifiers.threatIdentifierList[7]
            case .systemVPN:
                return ThreatIdentifiers.threatIdentifierList[8]
            case .deviceChange:
                return ThreatIdentifiers.threatIdentifierList[9]
            case .deviceID:
                return ThreatIdentifiers.threatIdentifierList[10]
            case .unofficialStore:
                return ThreatIdentifiers.threatIdentifierList[11]
            case .screenshot:
                return ThreatIdentifiers.threatIdentifierList[12]
            case .screenRecording:
                return ThreatIdentifiers.threatIdentifierList[13]
            @unknown default:
                abort()
        }
    }
}

extension SecurityThreatCenter: @retroactive SecurityThreatHandler, @retroactive RaspExecutionState {

    public func threatDetected(_ securityThreat: TalsecRuntime.SecurityThreat) {
        if (securityThreat.rawValue == "passcodeChange") {
            return
        }
        FreeraspReactNative.shared!.dispatchEvent(securityThreat: securityThreat)
    }
  
    public func onAllChecksFinished() {
      
      FreeraspReactNative.shared!.dispatchRaspExecutionStateEvent(event: RaspExecutionStates.allChecksFinished)
    }
}

enum RaspExecutionStates : String, Codable, CaseIterable, Equatable {
  
  case allChecksFinished
  
  public static var allCases: [RaspExecutionStates] {
    return [.allChecksFinished]
  }
  
  var callbackIdentifier: Int {
    switch self {
      case .allChecksFinished:
        return ThreatIdentifiers.raspExecutionStateIdentifierList[0]
    }
  }
}
