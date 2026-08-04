import arMessages from './ar.json';
import enMessages from './en.json';

export type Messages = typeof enMessages;

export const ar = arMessages as Messages;
export const en = enMessages as Messages;

export const allMessages: Record<'ar' | 'en', Messages> = { ar, en };