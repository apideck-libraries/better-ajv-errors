import { NOT_REGEX, QUOTES_REGEX, SLASH_REGEX } from '../constants';

export const pointerToDotNotation = (pointer: string): string => {
  return pointer.replace(SLASH_REGEX, '.');
};

export const cleanAjvMessage = (message: string): string => {
  return message.replace(QUOTES_REGEX, "'").replace(NOT_REGEX, 'not');
};

export const getLastSegment = (path: string): string => {
  const segments = path.split('/');
  return segments.pop() as string;
};
