import {relativeTime} from 'human-date';

export const getRelativeTime = (date: Date | null): string => {
  const result = relativeTime(date || new Date());
  if (result === ' ago') {
    return 'just now';
  }
  return result;
};
