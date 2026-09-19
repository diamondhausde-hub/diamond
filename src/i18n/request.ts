import { createServerCaller } from 'next-intl/server';
import { routing } from './routing';

export const { getLocale, getTranslations, getMessages } = createServerCaller(routing);