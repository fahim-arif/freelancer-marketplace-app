export const getLimitedWords = (description: string, limit = 15): string => {
  const words = description.split(' ');
  if (words.length >= limit) {
    return `${words.slice(0, 15).join(' ')}...`;
  }

  return description;
};
