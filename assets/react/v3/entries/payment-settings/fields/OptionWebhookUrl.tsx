import { CURRENT_VIEWPORT } from '@Config/constants';
import { copyToClipboard } from '@Utils/util';
import Button from '@Atoms/Button';
import SVGIcon from '@Atoms/SVGIcon';
import { useToast } from '@Atoms/Toast';
import FormFieldWrapper from '@Components/fields/FormFieldWrapper';
import { colorTokens, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import Show from '@Controls/Show';
import type { FormControllerProps } from '@Utils/form';
import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';

interface OptionWebhookUrlProps extends FormControllerProps<string> {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  helpText?: string;
}

const OptionWebhookUrl = ({
  label,
  field,
  fieldState,
  disabled,
  loading,
  placeholder,
  helpText,
}: OptionWebhookUrlProps) => {
  const { showToast } = useToast();

  const handleCopyClick = async () => {
    try {
      await copyToClipboard(field.value);
      showToast({
        type: 'success',
        message: __('Copied to clipboard', 'tutor'),
      });
    } catch (error) {
      showToast({
        type: 'danger',
        message: __('Failed to copy: ', 'tutor') + error,
      });
    }
  };

  return (
    <FormFieldWrapper
      label={label}
      field={field}
      fieldState={fieldState}
      disabled={disabled}
      loading={loading}
      placeholder={placeholder}
      helpText={helpText}
      isInlineLabel={CURRENT_VIEWPORT.isAboveSmallMobile}
    >
      {() => {
        return (
          <div css={styles.container}>
            <div css={styles.url}>{field.value}</div>
            <Show when={field.value}>
              <Button
                variant="tertiary"
                isOutlined
                size="small"
                icon={<SVGIcon name="duplicate" />}
                onClick={handleCopyClick}
              >
                {__('Copy', 'tutor')}
              </Button>
            </Show>
          </div>
        );
      }}
    </FormFieldWrapper>
  );
};

export default OptionWebhookUrl;

const styles = {
  container: css`
    max-width: 350px;
    display: flex;
    align-items: center;
    gap: ${spacing[12]};
  `,
  url: css`
    ${typography.small()};
    color: ${colorTokens.text.status.completed};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
};
