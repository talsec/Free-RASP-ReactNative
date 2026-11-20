struct EventIdentifiers {
    static var generatedNumbers = RandomGenerator.generateRandomIdentifiers(length: 22)
    
    // Channel identifiers for RN event emitter
    static let threatChannelKey: String = String(generatedNumbers[0])
    static let threatChannelName: String = String(generatedNumbers[1])
    static let raspExecutionStateChannelKey: String = String(generatedNumbers[2])
    static let raspExecutionStateChannelName: String = String(generatedNumbers[3])
  
    static let raspExecutionStateIdentifierList: [Int] = Array(generatedNumbers[4...6])
    static let threatIdentifierList: [Int] = generatedNumbers.suffix(15)

}
