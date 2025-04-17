import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { 
  getCurrencyForCountry, 
  formatCurrencyInput, 
  parseCurrencyInput 
} from '@/lib/currencyUtils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (value: number) => void;
  countryCode: string;
  showCurrencyTooltip?: boolean;
  showCurrencyCode?: boolean;
}

/**
 * Currency input component that automatically formats the input based on the selected country
 * 
 * Features:
 * - Automatically updates currency symbol based on countryCode
 * - Formats input with proper currency symbol
 * - Returns numeric value without currency symbol to onChange handler
 * - Optional tooltip showing currency name
 */
const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    countryCode, 
    className = '', 
    showCurrencyTooltip = true,
    showCurrencyCode = false,
    ...props 
  }, ref) => {
    // Get currency information
    const currency = getCurrencyForCountry(countryCode || 'DEFAULT');
    
    // Internal state for formatted display value
    const [displayValue, setDisplayValue] = useState('');
    
    // Update display value when props change
    useEffect(() => {
      const numericValue = typeof value === 'string' ? 
        parseCurrencyInput(value) : value;
      
      const formatted = formatCurrencyInput(numericValue, countryCode);
      setDisplayValue(formatted);
    }, [value, countryCode]);
    
    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Get input value
      const inputValue = e.target.value;
      
      // If user clears the input, reset to currency symbol only
      if (!inputValue || inputValue === currency.symbol) {
        setDisplayValue(currency.symbol);
        onChange(0);
        return;
      }
      
      // Parse numeric value from input
      const numericValue = parseCurrencyInput(inputValue);
      
      // Format for display
      const formatted = formatCurrencyInput(numericValue, countryCode);
      setDisplayValue(formatted);
      
      // Call onChange with numeric value
      onChange(numericValue);
    };
    
    // Create the input element with optional tooltip
    const inputElement = (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={displayValue || currency.symbol}
          onChange={handleChange}
          className={`${className}`}
          {...props}
        />
        {showCurrencyCode && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
            {currency.code}
          </div>
        )}
      </div>
    );
    
    // Wrap in tooltip if requested
    if (showCurrencyTooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {inputElement}
            </TooltipTrigger>
            <TooltipContent>
              <p>{currency.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return inputElement;
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };