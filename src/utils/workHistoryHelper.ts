import { IWorkHistory } from 'global/interfaces/user';

const getMonthName = (date: Date): string => date.toLocaleString('default', { month: 'long' });

export const getHistoryDateString = (history: IWorkHistory): string => {
  // Create date and extract month, need to subtract one as JS months array starts from 0
  let result = '';
  const date = new Date(Number(history.fromYear), Number(history.fromMonth - 1), 1);
  result += `${getMonthName(date)} ${String(history.fromYear)} - `;

  if (history.isPresentPosition) {
    result += 'Present';
  } else {
    date.setMonth(Number(history.toMonth != null ? history.toMonth - 1 : 0));
    result += `${getMonthName(date)} ${String(history.toYear)}`;
  }
  return result;
};
