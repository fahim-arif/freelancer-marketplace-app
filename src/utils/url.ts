export const getQueryParams = (filters: object | null): string => {
  const searchParams = new URLSearchParams();
  if (filters !== null) {
    Object.entries(filters)
      .filter(([_, v]) => v !== undefined)
      .forEach(([k, v]) => searchParams.append(k, v));
  }

  if (searchParams.get('pageSize') === null) {
    searchParams.append('pageSize', `${30}`);
  }

  return searchParams.toString();
};
