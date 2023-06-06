import Foundation
import TalsecRuntime

@objc(FreeraspReactNative)
class FreeraspReactNative: RCTEventEmitter {

    public static var shared:FreeraspReactNative?

    override init() {
        super.init()
        FreeraspReactNative.shared = self
    }

    @objc(talsecStart:)
    func talsecStart(options: NSDictionary) -> Void {
        do {
            try initializeTalsec(talsecConfig: options)
        }
        catch let error as NSError {
            self.sendEvent(withName: "initializationError", body: error.localizedDescription)
            return
        }
        self.sendEvent(withName: "started", body: "started")
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

    override func supportedEvents() -> [String]! {
        return ["initializationError", "started", "privilegedAccess", "debug", "simulator", "appIntegrity", "unofficialStore", "hooks", "deviceBinding", "deviceID", "secureHardwareNotAvailable", "passcodeChange", "passcode"]
    }
}

extension SecurityThreatCenter: SecurityThreatHandler {


    static let threatEventMap: [String: String] = [
        "missingSecureEnclave": "secureHardwareNotAvailable",
        "device binding": "deviceBinding",
    ]
    
    public func threatDetected(_ securityThreat: TalsecRuntime.SecurityThreat) {
        let threatName = SecurityThreatCenter.threatEventMap[securityThreat.rawValue] ?? securityThreat.rawValue
        if (threatName == "passcodeChange") {
            return
        }
        FreeraspReactNative.shared!.sendEvent(withName: threatName, body: threatName)
    }
}
