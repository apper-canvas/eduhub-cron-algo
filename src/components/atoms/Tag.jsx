import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Badge from "./Badge";

const Tag = forwardRef(({ 
  label,
  name,
  value = "",
  onChange,
  placeholder = "Add tag...",
  maxTags,
  error,
  className,
  disabled,
  ...props 
}, ref) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Parse comma-separated string into tags array
  useEffect(() => {
    if (value && typeof value === 'string') {
      const tagArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      setTags(tagArray);
    } else {
      setTags([]);
    }
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Escape') {
      setInputValue("");
    } else if (e.key === 'Backspace' && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      if (!maxTags || tags.length < maxTags) {
        const newTags = [...tags, trimmedValue];
        setTags(newTags);
        setInputValue("");
        
        if (onChange) {
          const event = {
            target: {
              name,
              value: newTags.join(',')
            }
          };
          onChange(event);
        }
      }
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    
    if (onChange) {
      const event = {
        target: {
          name,
          value: newTags.join(',')
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
      <div className={cn(
        "min-h-[42px] px-3 py-2 bg-white border border-gray-300 rounded-lg",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500",
        "disabled:bg-gray-50 disabled:cursor-not-allowed",
        error && "border-error-500 focus-within:ring-error-500 focus-within:border-error-500"
      )}>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="primary"
              className="flex items-center gap-1 cursor-pointer hover:bg-primary-200 transition-colors"
              onClick={() => !disabled && removeTag(index)}
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  className="ml-1 hover:text-primary-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                  }}
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={addTag}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled || (maxTags && tags.length >= maxTags)}
            className="flex-1 min-w-[80px] outline-none bg-transparent text-gray-900 placeholder-gray-500 disabled:cursor-not-allowed"
            {...props}
          />
        </div>
      </div>
      {maxTags && (
        <p className="text-xs text-gray-500">
          {tags.length}/{maxTags} tags
        </p>
      )}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Tag.displayName = "Tag";

export default Tag;