import TalsecRuntime

internal func getProtectedWindow(completion: @escaping (UIWindow?) -> Void) {
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

internal func getThreatIdentifiers() -> [Int] {
    return SecurityThreat.allCases
        .filter {
            threat in threat.rawValue != "passcodeChange"
        }
        .map {
            threat in threat.callbackIdentifier
        }
}

internal func getRaspExecutionStateIdentifiers() -> [Int] {
  return RaspExecutionStates.allCases
        .map {
            event in event.callbackIdentifier
        }
}
