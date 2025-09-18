import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/utils/cn";

const Range = forwardRef(({ 
  label,
  name,
  value = "", 
  onChange,
  min = 0,
  max = 100,
  step = 1,
  bounds = true,
  error,
  className,
  disabled,
  ...props 
}, ref) => {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  // Parse value string "min-max" into separate values
  useEffect(() => {
    if (value && typeof value === 'string' && value.includes('-')) {
      const [minVal, maxVal] = value.split('-');
      setMinValue(minVal || "");
      setMaxValue(maxVal || "");
    } else {
      setMinValue("");
      setMaxValue("");
    }
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = e.target.value;
    setMinValue(newMin);
    
    if (onChange) {
      const newValue = newMin && maxValue ? `${newMin}-${maxValue}` : "";
      const event = {
        target: {
          name,
          value: newValue
        }
      };
      onChange(event);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = e.target.value;
    setMaxValue(newMax);
    
    if (onChange) {
      const newValue = minValue && newMax ? `${minValue}-${newMax}` : "";
      const event = {
        target: {
          name,
          value: newValue
        }
      };
      onChange(event);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="number"
          min={bounds ? min : undefined}
          max={bounds ? max : undefined}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          placeholder="Min"
          disabled={disabled}
          className={cn(
            "block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-error-500 focus:ring-error-500 focus:border-error-500"
          )}
          {...props}
        />
        <span className="text-gray-500 font-medium">-</span>
        <input
          type="number"
          min={bounds ? min : undefined}
          max={bounds ? max : undefined}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          placeholder="Max"
          disabled={disabled}
          className={cn(
            "block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-error-500 focus:ring-error-500 focus:border-error-500"
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Range.displayName = "Range";

export default Range;