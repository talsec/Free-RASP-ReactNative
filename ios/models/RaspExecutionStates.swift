enum RaspExecutionStates : String, Codable, CaseIterable, Equatable {
  
  case fastChecksFinished
  
  public static var allCases: [RaspExecutionStates] {
    return [.fastChecksFinished]
  }
  
  var callbackIdentifier: Int {
    switch self {
      case .fastChecksFinished:
        return EventIdentifiers.raspExecutionStateIdentifierList[0]
    }
  }
}
