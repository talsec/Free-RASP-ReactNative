import Foundation
import TalsecRuntime

@objc(FreeraspReactNative)
class FreeraspReactNative: RCTEventEmitter {

    public static var shared:FreeraspReactNative?
    
    let threatChannelKey = String(Int.random(in: 100_000..<999_999_999)) // key of the argument map under which threats are expected
    let threatChannelName = String(Int.random(in: 100_000..<999_999_999)) // name of the channel over which threat callbacks are sent
    let threatIdentifierList = (1...12).map { _ in Int.random(in: 100_000..<999_999_999) }

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
            reject("initialization_error", "Could not initialize freeRASP", error)
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
    
    /**
     * Method to setup the message passing between native and React Native
     */
    @objc(getThreatChannelData:withRejecter:)
    private func getThreatChannelData(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        resolve([threatChannelName, threatChannelKey])
    }
    
    func dispatchEvent(securityThreat: SecurityThreat) -> Void {
        FreeraspReactNative.shared!.sendEvent(withName: threatChannelName, body: [threatChannelKey: securityThreat.callbackIdentifier])
    }
    
    /**
     * Method to get the random identifiers of callbacks
     */
    @objc(getThreatIdentifiers:withRejecter:)
    private func getThreatIdentifiers(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        resolve(getThreatIdentifiers())
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

    override func supportedEvents() -> [String]! {
        return [threatChannelName]
    }
}

/// An extension to unify callback names with RN ones.
extension SecurityThreat {

    var callbackIdentifier: Int {
        switch self {
            case .signature:
            return FreeraspReactNative.shared!.threatIdentifierList[0]
            case .jailbreak:
                return FreeraspReactNative.shared!.threatIdentifierList[1]
            case .debugger:
                return FreeraspReactNative.shared!.threatIdentifierList[2]
            case .runtimeManipulation:
                return FreeraspReactNative.shared!.threatIdentifierList[3]
            case .passcode:
                return FreeraspReactNative.shared!.threatIdentifierList[4]
            case .passcodeChange:
                return FreeraspReactNative.shared!.threatIdentifierList[5]
            case .simulator:
                return FreeraspReactNative.shared!.threatIdentifierList[6]
            case .missingSecureEnclave:
                return FreeraspReactNative.shared!.threatIdentifierList[7]
            case .deviceChange:
                return FreeraspReactNative.shared!.threatIdentifierList[8]
            case .deviceID:
                return FreeraspReactNative.shared!.threatIdentifierList[9]
            case .unofficialStore:
            return FreeraspReactNative.shared!.threatIdentifierList[10]
            @unknown default:
                abort()
        }
    }
}

extension SecurityThreatCenter: SecurityThreatHandler {
    
    public func threatDetected(_ securityThreat: TalsecRuntime.SecurityThreat) {
        if (securityThreat.rawValue == "passcodeChange") {
            return
        }
        FreeraspReactNative.shared!.dispatchEvent(securityThreat: securityThreat)
    }
}
