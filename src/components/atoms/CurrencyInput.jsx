import React from 'react';
import { cn } from '@/utils/cn';

const CurrencyInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  className,
  placeholder = "0.00",
  ...props 
}) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Remove non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
    
    const event = {
      target: {
        name,
        value: formattedValue
      }
    };
    onChange(event);
  };

  const displayValue = value ? parseFloat(value).toFixed(2) : '';

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">$</span>
        </div>
        <input
          type="text"
          id={name}
          name={name}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md",
            "placeholder-gray-400 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-error-300 focus:ring-error-500"
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default CurrencyInput;