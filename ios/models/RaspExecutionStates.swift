enum RaspExecutionStates : String, Codable, CaseIterable, Equatable {
  
  case fastChecksFinished
  case criticalChecksFinished
  case postponedChecksFinished
  
  // Same order as RaspExecutionState.getValues() in TypeScript
  public static var allCases: [RaspExecutionStates] {
    return [.fastChecksFinished, .criticalChecksFinished, .postponedChecksFinished]
  }
  
  var callbackIdentifier: Int {
    switch self {
      case .fastChecksFinished:
        return EventIdentifiers.raspExecutionStateIdentifierList[0]
      case .criticalChecksFinished:
        return EventIdentifiers.raspExecutionStateIdentifierList[1]
      case .postponedChecksFinished:
        return EventIdentifiers.raspExecutionStateIdentifierList[2]
    }
  }
}
