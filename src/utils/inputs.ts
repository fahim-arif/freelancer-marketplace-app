import React from 'react';

export function strictNumericCheck(e: React.KeyboardEvent): boolean {
  const key: string = e.key.toLocaleLowerCase();
  const isInvalidChar: boolean = key === 'e' || key === '.' || key === '+' || key === '-';
  if (isInvalidChar) {
    e.preventDefault();
    return false;
  }
  return true;
}

export const handleNumberChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  next: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
) => {
  const parsedInt = parseInt(event.target.value, 10);
  const alwaysInt = isNaN(parsedInt) ? 0 : parsedInt;
  event.target.value = `${alwaysInt}`;
  next(event);
};
