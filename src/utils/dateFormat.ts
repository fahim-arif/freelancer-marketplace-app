export function timeStringFromDate(dateString: string | undefined): string {
  if (dateString === undefined || dateString === null) {
    return '';
  } else {
    const date = new Date(dateString);
    const mins = date.getMinutes();
    const minsString = mins >= 10 ? `${mins}` : `0${mins}`;
    return `${date.getHours()}:${minsString}`;
  }
}

export function dateStringFromDate(dateString: string | undefined): string {
  if (dateString === undefined || dateString === null) {
    return '';
  } else {
    const date = new Date(dateString);
    return `${date.toDateString()}`;
  }
}
