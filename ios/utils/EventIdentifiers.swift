struct EventIdentifiers {
    static let threatIdentifierList: [Int] = (1...14).map { _ in Int.random(in: 100_000..<999_999_999) }
    static let raspExecutionStateIdentifierList: [Int] = (1...1).map { _ in Int.random(in: 100_000..<999_999_999) }
    
    // Channel identifiers for RN event emitter
    static let threatChannelKey: String = String(Int.random(in: 100_000..<999_999_999))
    static let threatChannelName: String = String(Int.random(in: 100_000..<999_999_999))
    static let raspExecutionStateChannelKey: String = String(Int.random(in: 100_000..<999_999_999))
    static let raspExecutionStateChannelName: String = String(Int.random(in: 100_000..<999_999_999))
}
