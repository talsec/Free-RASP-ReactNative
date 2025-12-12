import TalsecRuntime

/// An extension to unify callback names with RN ones.
extension SecurityThreat {

    var callbackIdentifier: Int {
        switch self {
            case .signature:
                return EventIdentifiers.threatIdentifierList[0]
            case .jailbreak:
                return EventIdentifiers.threatIdentifierList[1]
            case .debugger:
                return EventIdentifiers.threatIdentifierList[2]
            case .runtimeManipulation:
                return EventIdentifiers.threatIdentifierList[3]
            case .passcode:
                return EventIdentifiers.threatIdentifierList[4]
            case .passcodeChange:
                return EventIdentifiers.threatIdentifierList[5]
            case .simulator:
                return EventIdentifiers.threatIdentifierList[6]
            case .missingSecureEnclave:
                return EventIdentifiers.threatIdentifierList[7]
            case .systemVPN:
                return EventIdentifiers.threatIdentifierList[8]
            case .deviceChange:
                return EventIdentifiers.threatIdentifierList[9]
            case .deviceID:
                return EventIdentifiers.threatIdentifierList[10]
            case .unofficialStore:
                return EventIdentifiers.threatIdentifierList[11]
            case .screenshot:
                return EventIdentifiers.threatIdentifierList[12]
            case .screenRecording:
                return EventIdentifiers.threatIdentifierList[13]
            @unknown default:
                abort()
        }
    }
}
