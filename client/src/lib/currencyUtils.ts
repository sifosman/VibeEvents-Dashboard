/**
 * Formats a number as currency with the specified currency code
 * @param amount The amount to format
 * @param currencyCode The ISO currency code (e.g., 'USD', 'ZAR', 'EUR')
 * @param locale The locale to use for formatting (defaults to 'en-ZA' for South African format)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'ZAR',
  locale: string = 'en-ZA'
): string {
  if (isNaN(amount)) return `${currencyCode} 0.00`;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if the Intl API doesn't support the currency or locale
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

/**
 * Parses a currency string back to a number
 * @param currencyString The currency string to parse
 * @returns The parsed number value
 */
export function parseCurrency(currencyString: string): number {
  if (!currencyString) return 0;
  
  // Remove currency symbols, spaces, and commas, then parse as float
  const numericString = currencyString
    .replace(/[^\d.-]/g, '')
    .replace(/,/g, '.');
    
  return parseFloat(numericString) || 0;
}

/**
 * Calculates the price after applying a discount percentage
 * @param originalPrice The original price
 * @param discountPercent The discount percentage (e.g., 10 for 10%)
 * @returns The discounted price
 */
export function calculateDiscount(originalPrice: number, discountPercent: number): number {
  if (isNaN(originalPrice) || isNaN(discountPercent)) return originalPrice;
  
  return originalPrice * (1 - (discountPercent / 100));
}

/**
 * Creates a simple price range display from min and max prices
 * @param minPrice The minimum price
 * @param maxPrice The maximum price
 * @param currencyCode The ISO currency code
 * @returns Formatted price range string
 */
export function formatPriceRange(
  minPrice: number, 
  maxPrice: number, 
  currencyCode: string = 'ZAR'
): string {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice, currencyCode);
  }
  
  return `${formatCurrency(minPrice, currencyCode)} - ${formatCurrency(maxPrice, currencyCode)}`;
}