import { isValid, parse } from 'date-fns';
import { kDateFormat } from './Constants';

export const delay = (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getDateFromString = (dateString: string): Date | undefined => {
  let date: Date | undefined;

  if (dateString) {
    date = new Date(dateString);
    if (!isValid(date)) {
      date = parse(dateString, kDateFormat, new Date());
      if (!isValid(date)) {
        date = undefined;
      }
    }
  }

  return date;
};
