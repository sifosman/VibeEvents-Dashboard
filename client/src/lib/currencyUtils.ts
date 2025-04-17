// This file contains utility functions for currency handling
// based on the user's country selection

// Currency code mapping for countries
export const COUNTRY_TO_CURRENCY: Record<string, { code: string; symbol: string; name: string }> = {
  // Africa
  'ZA': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  'NG': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  'EG': { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  'KE': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  'GH': { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  'MA': { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
  'TZ': { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  'ET': { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  'CI': { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
  'CM': { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc' },
  'UG': { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  'AO': { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  'ZM': { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
  'BW': { code: 'BWP', symbol: 'P', name: 'Botswanan Pula' },
  'SN': { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
  'NA': { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar' },
  'MZ': { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
  'MW': { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
  'MU': { code: 'MUR', symbol: '₨', name: 'Mauritian Rupee' },
  'SS': { code: 'SSP', symbol: 'SSP', name: 'South Sudanese Pound' },
  
  // Europe
  'GB': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'DE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'FR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'IT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'ES': { code: 'EUR', symbol: '€', name: 'Euro' },
  'NL': { code: 'EUR', symbol: '€', name: 'Euro' },
  'CH': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  'SE': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  'NO': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  'DK': { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  'PL': { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  'BE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'IE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'AT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'PT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'FI': { code: 'EUR', symbol: '€', name: 'Euro' },
  'CZ': { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  'RO': { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  'GR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'HU': { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  
  // Americas
  'US': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'CA': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'MX': { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  'BR': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  'AR': { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  'CO': { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  'CL': { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  'PE': { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  'UY': { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso' },
  'CR': { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
  'DO': { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso' },
  'GT': { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal' },
  'PA': { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa' },
  'JM': { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
  'TT': { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
  
  // Asia
  'CN': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'JP': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'IN': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'KR': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  'ID': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  'SA': { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  'TR': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  'AE': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  'TH': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  'MY': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  'SG': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  'PH': { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  'PK': { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  'BD': { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  'VN': { code: 'VND', symbol: '₫', name: 'Vietnamese Đồng' },
  'HK': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  'TW': { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },
  
  // Australia/Oceania
  'AU': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'NZ': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  'FJ': { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' },
  'PG': { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina' },
  'SB': { code: 'SBD', symbol: 'SI$', name: 'Solomon Islands Dollar' },
  
  // Default fallback for countries without specific mapping
  'DEFAULT': { code: 'USD', symbol: '$', name: 'US Dollar' }
};

/**
 * Get currency info for a country code
 * @param countryCode ISO 2-letter country code
 * @returns Currency information for the country
 */
export function getCurrencyForCountry(countryCode: string) {
  const upperCountryCode = countryCode?.toUpperCase();
  return COUNTRY_TO_CURRENCY[upperCountryCode] || COUNTRY_TO_CURRENCY.DEFAULT;
}

/**
 * Format a number as a currency value
 * @param amount The amount to format
 * @param countryCode ISO 2-letter country code
 * @param options Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  countryCode: string,
  options: {
    includeSymbol?: boolean;
    includeCurrencyCode?: boolean;
    decimals?: number;
  } = {}
) {
  const { includeSymbol = true, includeCurrencyCode = false, decimals = 2 } = options;
  
  // Get currency info for country
  const currency = getCurrencyForCountry(countryCode);
  
  // Format value with appropriate number of decimal places
  const formattedAmount = amount.toLocaleString(undefined, { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  // Build formatted currency string
  let result = '';
  
  if (includeSymbol) {
    result += currency.symbol;
  }
  
  result += formattedAmount;
  
  if (includeCurrencyCode) {
    result += ` ${currency.code}`;
  }
  
  return result;
}

/**
 * Format currency input value (for use in input fields)
 * @param value Current value
 * @param countryCode ISO 2-letter country code
 * @returns Formatted value with appropriate currency symbol
 */
export function formatCurrencyInput(value: string | number, countryCode: string): string {
  const currency = getCurrencyForCountry(countryCode);
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return currency.symbol;
  }
  
  return `${currency.symbol}${numericValue.toFixed(2)}`;
}

/**
 * Parse currency input value to number
 * @param value Input value with currency symbol
 * @returns Numeric value without symbol
 */
export function parseCurrencyInput(value: string): number {
  // Remove any non-numeric characters except decimal point
  const numericString = value.replace(/[^\d.]/g, '');
  
  // Parse to float
  const parsed = parseFloat(numericString);
  
  // Return 0 if parsing results in NaN
  return isNaN(parsed) ? 0 : parsed;
}