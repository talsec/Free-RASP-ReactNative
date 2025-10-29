import Foundation
import TalsecRuntime

@objc(FreeraspReactNative)
class FreeraspReactNative: RCTEventEmitter {

    public static var shared:FreeraspReactNative?

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

    /**
     * Method to setup the message passing between native and React Native
     */
    @objc(getThreatChannelData:withRejecter:)
    private func getThreatChannelData(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        resolve([EventIdentifiers.threatChannelName, EventIdentifiers.threatChannelKey])
    }
  
    /**
     * Method to setup the message passing between native and React Native
     */
    @objc(getRaspExecutionStateChannelData:withRejecter:)
    private func getRaspExecutionStateChannelData(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
      resolve([EventIdentifiers.raspExecutionStateChannelName, EventIdentifiers.raspExecutionStateChannelKey])
    }

    func dispatchEvent(securityThreat: SecurityThreat) -> Void {
        FreeraspReactNative.shared!.sendEvent(withName: EventIdentifiers.threatChannelName, body: [
          EventIdentifiers.threatChannelKey: securityThreat.callbackIdentifier,
        ])
    }
  
    func dispatchRaspExecutionStateEvent(event: RaspExecutionStates) -> Void {
      FreeraspReactNative.shared!.sendEvent(withName: EventIdentifiers.raspExecutionStateChannelName, body: [
        EventIdentifiers.raspExecutionStateChannelKey: event.callbackIdentifier,
      ])
    }

    /**
     * Method to get the random identifiers of callbacks
     */
    @objc(getThreatIdentifiers:withRejecter:)
    private func getThreatIdentifiers(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
      resolve(freerasp_react_native.getThreatIdentifiers())
    }
  
    /**
     * Method to get the random identifiers of callbacks
     */
    @objc(getRaspExecutionStateIdentifiers:withRejecter:)
    private func getRaspExecutionStateIdentifiers(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
      resolve(freerasp_react_native.getRaspExecutionStateIdentifiers())
    }

    /**
     * We never send an invalid callback over our channel.
     * Therefore, if this happens, we want to kill the app.
     */
    @objc(onInvalidCallback)
    private func onInvalidCallback() -> Void {
        abort()
    }

    override func supportedEvents() -> [String]! {
      return [EventIdentifiers.threatChannelName, EventIdentifiers.raspExecutionStateChannelName]
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


