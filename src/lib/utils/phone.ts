/**
 * Phone number canonicalization for Zambian numbers.
 * 
 * Canonical format: +260XXXXXXXXX (country code + 9 digits)
 * 
 * Accepted input formats:
 * - 097 123 4567
 * - 0971234567
 * - +260 97 123 4567
 * - 260971234567
 * +260971234567
 * 
 * All normalize to: +260XXXXXXXXX (country code + 9 digits)
 */

export function canonicalizePhone(input: string): string {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  
  // Handle different input formats
  if (digits.startsWith('0')) {
    // Local format: 0971234567 -> +260971234567
    return '+260' + digits.slice(1);
  }
  
  if (digits.startsWith('260')) {
    // International without +: 260971234567 -> +260971234567
    return '+' + digits;
  }
  
  if (digits.startsWith('+260')) {
    // Already in correct format
    return '+' + digits;
  }
  
  // If it's just 9 digits (no country code), assume Zambia
  if (digits.length === 9 && digits.startsWith('9')) {
    return '+260' + digits;
  }
  
  // If it already starts with +260, return as is
  if (digits.startsWith('+260')) {
    return '+' + digits.slice(1);
  }
  
  // Default: assume it's a Zambian number without country code
  if (digits.length === 9) {
    return '+260' + digits;
  }
  
  // Fallback: return as-is with + prefix if it looks like a phone number
  if (digits.length >= 9) {
    return '+' + digits;
  }
  
  // Invalid - return as-is (will be caught by validation)
  return input;
}

export function isValidZambianPhone(input: string): boolean {
  try {
    const canonical = canonicalizePhone(input);
    // Must be exactly +260 followed by 9 digits
    return /^\+260\d{9}$/.test(canonical);
  } catch {
    return false;
  }
}

export function formatPhoneForDisplay(input: string): string {
  const canonical = canonicalizePhone(input);
  // Format as +260 XX XXX XXXX for display
  if (canonical.startsWith('+260') && canonical.length === 13) {
    const rest = canonical.slice(4);
    return `+260 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }
  return canonical;
}