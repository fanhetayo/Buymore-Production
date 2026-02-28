import React, { useState } from "react";

interface SelectProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  return <div className="relative">{children}</div>;
};

export const SelectTrigger: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return <div className={`border border-gray-300 rounded px-3 py-2 cursor-pointer ${className}`}>{children}</div>;
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="absolute bg-white border border-gray-300 rounded mt-1 z-10">{children}</div>;
};

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        /* dummy, value handled in parent */
      }}
    >
      {children}
    </div>
  );
};