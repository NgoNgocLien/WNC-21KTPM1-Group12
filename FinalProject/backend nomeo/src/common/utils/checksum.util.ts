/**
 * Generate Luhn checksum for a given base number.
 * @param baseNumber - The numeric string to calculate checksum for.
 * @returns The checksum digit.
 */
export function generateLuhnChecksum(baseNumber: string): string {
    let sum = 0;
    const digits = baseNumber.split('').map(Number).reverse();
  
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
  
    const checksum = (10 - (sum % 10)) % 10;
    return checksum.toString();
  }
  
  /**
   * Generate account number with Luhn checksum.
   * @param customerId - The customer ID to include in the account number.
   * @returns A unique account number with checksum.
   */
  export function generateAccountNumber(customerId: number): string {
    const baseNumber = `100${customerId}${Date.now().toString().slice(-3)}`;
    const checksum = generateLuhnChecksum(baseNumber);
    return `ACC${baseNumber}${checksum}`;
  }  