import numberWithCommas from "@/utils/format-number";

describe('numberWithCommas', () => {

    // Returns a string with commas separating thousands when given a number greater than or equal to 1000 and less than or equal to 100,000,000.
    it('should return a string with commas separating thousands', () => {
            // Arrange
        const input = 1234567;
        const expected = '1,234,567';
      
            // Act
        const result = numberWithCommas(input);
      
            // Assert
        expect(result).toEqual(expected);
    });

    // Returns undefined when given a non-numeric value.
    it('should return undefined when given a non-numeric value', () => {
        // Arrange
        const input = 'abc';
  
        // Act
        const result = numberWithCommas(input);
  
        // Assert
        expect(result).toBeUndefined();
      });

})