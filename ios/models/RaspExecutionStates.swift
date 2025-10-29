enum RaspExecutionStates : String, Codable, CaseIterable, Equatable {
  
  case allChecksFinished
  
  public static var allCases: [RaspExecutionStates] {
    return [.allChecksFinished]
  }
  
  var callbackIdentifier: Int {
    switch self {
      case .allChecksFinished:
        return EventIdentifiers.raspExecutionStateIdentifierList[0]
    }
  }
}
