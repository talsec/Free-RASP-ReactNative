internal class RandomGenerator {
    
    internal static func generateRandomIdentifiers(length: Int) -> [Int] {
        var generatedNumbers = Set<Int>()

        while generatedNumbers.count < length {
            generatedNumbers.insert(Int.random(in: 10_000...999_999_999))
        }

        return Array(generatedNumbers)
    }
}
