import { createClientCaller } from 'next-intl/client';
import { routing } from './routing';

export const { useLocale, useTranslations, useMessages, useFormatter, useNow } = createClientCaller(routing);