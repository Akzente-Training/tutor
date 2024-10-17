import { useToast } from '@Atoms/Toast';
import { Media } from '@Components/fields/FormImageInput';
import { tutorConfig } from '@Config/config';
import { ErrorResponse } from '@Utils/form';
import { wpAjaxInstance } from '@Utils/api';
import endpoints from '@Utils/endpoints';
import { useMutation, useQuery } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import { Option } from '@/v3/shared/utils/types';

export interface PaymentField {
  name: string;
  label: string;
  type: 'select' | 'text' | 'secret_key' | 'textarea' | 'image' | 'webhook_url';
  options?: Option<string>[] | Record<string, string>;
  hint?: string;
  value: any;
}

export interface PaymentMethod {
  name: string;
  label: string;
  is_active: boolean;
  icon: string;
  support_subscription: boolean;
  update_available: boolean;
  is_manual?: boolean;
  fields: PaymentField[];
}

export interface PaymentSettings {
  payment_methods: PaymentMethod[];
}

export const getWebhookUrl = (gateway: string) => {
  return `${tutorConfig.home_url}/wp-json/tutor/v1/ecommerce-webhook?payment_method=${gateway}`;
};

export const initialPaymentSettings: PaymentSettings = {
  payment_methods: [
    {
      name: 'paypal',
      label: __('Paypal', 'tutor'),
      is_active: false,
      icon: `${tutorConfig.tutor_url}assets/images/paypal.svg`,
      support_subscription: true,
      update_available: false,
      is_manual: false,
      fields: [
        {
          name: 'environment',
          label: __('PyPal Environment', 'tutor'),
          type: 'select',
          options: [
            {
              label: __('Test', 'tutor'),
              value: 'test',
            },
            {
              label: __('Live', 'tutor'),
              value: 'live',
            },
          ],
          value: 'test',
        },
        {
          name: 'merchant_email',
          label: __('Merchant Email', 'tutor'),
          type: 'text',
          value: '',
        },
        {
          name: 'client_id',
          label: __('Client ID', 'tutor'),
          type: 'text',
          value: '',
        },
        {
          name: 'secret_id',
          label: __('Secret ID', 'tutor'),
          type: 'secret_key',
          value: '',
        },
        {
          name: 'webhook_id',
          label: __('Webhook ID', 'tutor'),
          type: 'secret_key',
          value: '',
        },
        {
          name: 'webhook_url',
          label: __('Webhook URL', 'tutor'),
          type: 'webhook_url',
          value: getWebhookUrl('paypal'),
        },
      ],
    },
  ],
};

export const convertPaymentMethods = (methods: PaymentMethod[], gateways: PaymentGateway[]) => {
  if (gateways.length === 0) {
    return methods;
  }

  gateways.forEach((gateway) => {
    // Append settings if payment plugin installed but settings fields are not available.
    if (gateway.is_installed && !methods.find((method) => method.name === gateway.name)) {
      methods.push(gateway);
    }

    // Remove settings if payment plugin is not available.
    if (!gateway.is_installed && methods.find((method) => method.name === gateway.name)) {
      methods = methods.filter((method) => method.name !== gateway.name);
    }
  });

  return methods;
};

const getPaymentSettings = () => {
  return wpAjaxInstance.get<PaymentSettings>(endpoints.GET_PAYMENT_SETTINGS).then((response) => response.data);
};

export const usePaymentSettingsQuery = () => {
  return useQuery({
    queryKey: ['PaymentSettings'],
    queryFn: getPaymentSettings,
  });
};

export interface PaymentGateway {
  name: string;
  label: string;
  icon: string;
  is_active: boolean;
  is_installed: boolean;
  support_subscription: boolean;
  is_installable: boolean;
  update_available: boolean;
  fields: PaymentField[];
}

const getPaymentGateways = () => {
  return wpAjaxInstance.get<PaymentGateway[]>(endpoints.GET_PAYMENT_GATEWAYS).then((response) => response.data);
};

export const usePaymentGatewaysQuery = () => {
  return useQuery({
    queryKey: ['PaymentGateways'],
    queryFn: getPaymentGateways,
  });
};

interface PaymentResponse {
  status_code: number;
  message: string;
  data: PaymentMethod | null;
}

interface PaymentPayload {
  slug: string;
}

const installPayment = (payload: PaymentPayload) => {
  return wpAjaxInstance.post<PaymentPayload, PaymentResponse>(endpoints.INSTALL_PAYMENT_GATEWAY, {
    ...payload,
  });
};

export const useInstallPaymentMutation = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: installPayment,
    onSuccess: (response) => {
      showToast({ type: 'success', message: response.message });
    },
    onError: (error: ErrorResponse) => {
      showToast({ type: 'danger', message: error.response.data.message });
    },
  });
};

const removePayment = (payload: PaymentPayload) => {
  return wpAjaxInstance.post<PaymentPayload, PaymentResponse>(endpoints.REMOVE_PAYMENT_GATEWAY, {
    ...payload,
  });
};

export const useRemovePaymentMutation = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: removePayment,
    onSuccess: (response) => {
      showToast({ type: 'success', message: response.message });
    },
    onError: (error: ErrorResponse) => {
      showToast({ type: 'danger', message: error.response.data.message });
    },
  });
};
