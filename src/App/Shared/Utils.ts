import { format, isValid, parse } from 'date-fns';
import { kDateFormat, kShortDateFormat, kTimeFormat } from './Constants';
import { ShortDateAndTime } from './Types';

export const delay = (ms: number): Promise<NodeJS.Timeout> =>
  Promise.resolve(
    setTimeout(() => {
      /* do nothing */
    }, ms),
  );

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

export const getShortDateAndTimeFromString = (dateString: string): ShortDateAndTime | undefined => {
  const date = getDateFromString(dateString);
  if (!date) return undefined;
  return { shortDate: format(date, kShortDateFormat), time: format(date, kTimeFormat) };
};

export const getStringFromDate = (date: Date): string => format(date, kDateFormat);

export const getErrorStringForCatch = (anyError: unknown): string => {
  const err = anyError as Error;
  if (err) {
    return err.message;
  }
  return String(anyError);
};

export const getFileExtension = (fileName: string): string =>
  // eslint-disable-next-line no-bitwise
  fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
