import type { SkiHotelSearchRequest } from './types.js';

type ValidationResult<T> =
  | {
      isValid: true;
      data: T;
    }
  | {
      isValid: false;
      errors: string[];
    };

export const validateSkiHotelSearchRequest = (
  body: unknown,
): ValidationResult<SkiHotelSearchRequest> => {
  const errors: string[] = [];

  if (!isRecord(body)) {
    return {
      isValid: false,
      errors: ['Request body must be a JSON object'],
    };
  }

  if (!isNonEmptyString(body.skiSiteName)) {
    errors.push('ski site name must be a non-empty string');
  }

  if (!isValidDateString(body.startDate)) {
    errors.push('start date must be a valid date in DD/MM/YYYY format');
  }

  if (!isValidDateString(body.endDate)) {
    errors.push('end date must be a valid date in DD/MM/YYYY format');
  }

  if (!isValidGroupSize(body.groupSize)) {
    errors.push('group size must be an integer between 1 and 10');
  }

  if (
    isValidDateString(body.startDate) &&
    isValidDateString(body.endDate) &&
    parseDateString(body.startDate).getTime() >
      parseDateString(body.endDate).getTime()
  ) {
    errors.push('start date must be before or equal to end date');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    data: body as SkiHotelSearchRequest,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isValidGroupSize = (value: unknown): value is number => {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 10
  );
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidDateString = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }

  const match = /^(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4})$/.exec(value);

  if (!match?.groups) {
    return false;
  }

  const month = Number(match.groups.month);
  const day = Number(match.groups.day);
  const year = Number(match.groups.year);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const parseDateString = (value: string): Date => {
  const [day, month, year] = value.split('/').map(Number);

  return new Date(year, month - 1, day);
};
