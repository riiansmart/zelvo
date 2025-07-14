/**
 * Generic form input hook for Zelvo forms.
 * Returns a `value` and `onChange` handler so components can bind input state declaratively.
 *
 * @param initialValue initial field value
 * @returns object with `value` and `onChange`
 */

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