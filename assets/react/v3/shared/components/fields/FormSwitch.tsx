import Switch from '@Atoms/Switch';
import { spacing } from '@Config/styles';
import type { FormControllerProps } from '@Utils/form';
import { type SerializedStyles, css } from '@emotion/react';

import type { ReactNode } from 'react';
import FormFieldWrapper from './FormFieldWrapper';

export type labelPositionType = 'left' | 'right';

interface FormSwitchProps extends FormControllerProps<boolean> {
  label?: string | ReactNode;
  title?: string;
  subTitle?: string;
  disabled?: boolean;
  loading?: boolean;
  labelPosition?: labelPositionType;
  helpText?: string;
  isHidden?: boolean;
  labelCss?: SerializedStyles;
  onChange?: (value: boolean) => void;
}

const FormSwitch = ({
  field,
  fieldState,
  label,
  disabled,
  loading,
  labelPosition = 'left',
  helpText,
  isHidden,
  labelCss,
  onChange,
}: FormSwitchProps) => {
  return (
    <FormFieldWrapper
      label={label}
      field={field}
      fieldState={fieldState}
      loading={loading}
      helpText={helpText}
      isHidden={isHidden}
      isInlineLabel={true}
    >
      {(inputProps) => {
        return (
          <div css={styles.wrapper}>
            <Switch
              {...field}
              {...inputProps}
              disabled={disabled}
              checked={field.value}
              labelCss={labelCss}
              labelPosition={labelPosition}
              onChange={() => {
                field.onChange(!field.value);
                onChange?.(!field.value);
              }}
            />
          </div>
        );
      }}
    </FormFieldWrapper>
  );
};

export default FormSwitch;

const styles = {
  wrapper: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[40]};
  `,
};
