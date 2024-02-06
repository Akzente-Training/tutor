import { __ } from "@wordpress/i18n";
import { translateText } from '@Hooks/useTranslation';
import { isValid } from 'date-fns';
import { UseControllerProps } from 'react-hook-form';

import { ProductDiscount, isDefined, ProductOptionValue } from './types';
import { hasDuplicateEntries, arrayIntersect } from './util';

type Rule = UseControllerProps['rules'];

export const requiredRule = (): Rule => ({
  required: { value: true, message: __('This field is required', 'tutor') },
});

export const maxValueRule = ({ maxValue, message }: { maxValue: number; message?: string }): Rule => ({
  max: {
    value: maxValue,
    message: message || translateText('COM_SPPAGEBUILDER_STORE_ERROR_MSG_FIELD_MAX_VALUE', { maxValue }),
  },
});

export const discountRule = (): Rule => ({
  validate: (value?: ProductDiscount) => {
    if (value?.amount === undefined) {
      return translateText('COM_SPPAGEBUILDER_STORE_ERROR_MSG_FIELD_REQUIRED');
    }
    return undefined;
  },
});

export const invalidDateRule = (): Rule => ({
  validate: (value?: string) => {
    if (!isValid(new Date(value || ''))) {
      return 'Invalid date entered!';
    }

    return undefined;
  },
});

export const maxLimitRule = (maxLimit: number): Rule => ({
  validate: (value?: string) => {
    if (value && maxLimit < value.length) {
      return translateText('COM_SPPAGEBUILDER_STORE_ERROR_MSG_MAX_CHARACTERS', { maxLimit });
    }
    return undefined;
  },
});

export const invalidTimeRule = (): Rule => ({
  validate: (value?: string) => {
    if (!value) {
      return undefined;
    }

    const message = 'Invalid time entered!';

    const [hours, minutesAndMeridian] = value.split(':');

    if (!hours || !minutesAndMeridian) {
      return message;
    }

    const [minutes, meridian] = minutesAndMeridian.split(' ');

    if (!minutes || !meridian) {
      return message;
    }

    if (hours.length !== 2 || minutes.length !== 2) {
      return message;
    }

    if (Number(hours) < 1 || Number(hours) > 12) {
      return message;
    }

    if (Number(minutes) < 0 || Number(minutes) > 59) {
      return message;
    }

    if (!['am', 'pm'].includes(meridian.toLowerCase())) {
      return message;
    }

    return undefined;
  },
});