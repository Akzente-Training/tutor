import Alert from '@Atoms/Alert';
import Button from '@Atoms/Button';
import FormSelectInput from '@Components/fields/FormSelectInput';
import FormTextareaInput from '@Components/fields/FormTextareaInput';
import BasicModalWrapper from '@Components/modals/BasicModalWrapper';
import type { ModalProps } from '@Components/modals/Modal';
import { colorTokens, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import Show from '@Controls/Show';
import { useFormWithGlobalError } from '@Hooks/useFormWithGlobalError';
import { useCancelOrderMutation } from '@OrderServices/order';
import type { Option } from '@Utils/types';
import { requiredRule } from '@Utils/validation';
import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

interface CancelOrderModalProps extends ModalProps {
  closeModal: (props?: { action: 'CONFIRM' | 'CLOSE' }) => void;
  order_id: number;
}

type CancellationReason =
  | 'customer_changed_or_canceled_order'
  | 'payment_declined'
  | 'fraudulent_order'
  | 'matter_of_unavailability'
  | 'other';

interface FormField {
  reason: CancellationReason;
  note: string;
  send_notification: boolean;
}

const reasonOptions: (Option<CancellationReason> & { explanation?: string })[] = [
  {
    label: __('Customer changed or canceled order', 'tutor'),
    value: 'customer_changed_or_canceled_order',
    explanation:
      // prettier-ignore
      __('The customer has modified or canceled their order. This action indicates that the customer has either updated their order details or decided to cancel their order entirely. Please review the order history for specific changes or cancellation details.', 'tutor'),
  },
  {
    label: __('Payment declined', 'tutor'),
    value: 'payment_declined',
    explanation: __('Payment is declined by the gateway.', 'tutor'),
  },
  {
    label: __('Fraudulent order', 'tutor'),
    value: 'fraudulent_order',
    explanation:
      // prettier-ignore
      __('The order has been flagged as fraudulent. This action indicates that the order has been identified as potentially fraudulent and requires immediate attention. Please investigate the order details and take appropriate measures to prevent any unauthorized transactions.', 'tutor'),
  },
  {
    label: __('Courses unavailable', 'tutor'),
    value: 'matter_of_unavailability',
    explanation: __('Unfortunately the courses selected on this order is not anymore available.', 'tutor'),
  },
  {
    label: __('Other', 'tutor'),
    value: 'other',
  },
];

function CancelOrderModal({ title, order_id, closeModal, actions }: CancelOrderModalProps) {
  const cancelOrderMutation = useCancelOrderMutation();
  const form = useFormWithGlobalError<FormField>({
    defaultValues: {
      note: '',
      send_notification: true,
    },
  });

  const reasonValue = form.watch('reason');
  const explanation =
    reasonOptions.find((item) => item.value === reasonValue)?.explanation ??
    // prettier-ignore
    __('Please select a reason for the order cancellation. Your input is valuable for understanding the cause.', 'tutor');

  useEffect(() => {
    form.setFocus('reason');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BasicModalWrapper onClose={() => closeModal({ action: 'CLOSE' })} title={title} actions={actions} maxWidth={480}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const response = await cancelOrderMutation.mutateAsync({
            order_id: order_id,
            cancel_reason:
              values.reason === 'other'
                ? values.note
                : (reasonOptions.find((item) => item.value === values.reason)?.explanation ?? ''),
          });

          if (response) {
            closeModal({ action: 'CLOSE' });
          }
        })}
      >
        <div css={styles.formContent}>
          <Controller
            control={form.control}
            name="reason"
            rules={{
              ...requiredRule(),
            }}
            render={(props) => (
              <FormSelectInput
                {...props}
                label={__('Reason for Cancellation', 'tutor')}
                options={reasonOptions}
                placeholder={__('Select a reason', 'tutor')}
              />
            )}
          />

          <Show when={reasonValue !== 'other'}>
            <Alert type="info" icon="bulb">
              {explanation}
            </Alert>
          </Show>

          <Show when={reasonValue === 'other'}>
            <Controller
              control={form.control}
              name="note"
              render={(props) => (
                <FormTextareaInput
                  {...props}
                  label={__('Note', 'tutor')}
                  placeholder={__('Write a note for this action.', 'tutor')}
                  rows={3}
                  enableResize
                />
              )}
            />
          </Show>
        </div>
        <div css={styles.footer}>
          <Button size="small" variant="text" onClick={() => closeModal({ action: 'CLOSE' })}>
            {__('Keep order', 'tutor')}
          </Button>
          <Button type="submit" size="small" variant="danger" loading={cancelOrderMutation.isPending}>
            {__('Cancel order', 'tutor')}
          </Button>
        </div>
      </form>
    </BasicModalWrapper>
  );
}

export default CancelOrderModal;

const styles = {
  inlineFields: css`
    display: flex;
    gap: ${spacing[16]};
  `,
  availableMessage: css`
    ${typography.caption()};
    color: ${colorTokens.text.hints};
    margin-top: ${spacing[12]};

    strong {
      color: ${colorTokens.text.title};
    }
  `,
  formContent: css`
    padding: ${spacing[20]} ${spacing[16]};
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]};
  `,
  footer: css`
    box-shadow: 0px 1px 0px 0px #e4e5e7 inset;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: end;
    gap: ${spacing[16]};
    padding-inline: ${spacing[16]};
  `,
};
