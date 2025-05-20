// Handles common input logic

import { useState } from 'react';

// Simple hook for managing form input fields
export const useFormInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange,
  };
};