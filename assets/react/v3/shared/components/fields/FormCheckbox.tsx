import AtomCheckbox from '@Atoms/CheckBox';
import { colorPalate, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import type { FormControllerProps } from '@Utils/form';
import { type SerializedStyles, css } from '@emotion/react';

import FormFieldWrapper from './FormFieldWrapper';

interface CheckboxProps extends FormControllerProps<boolean> {
  label?: string;
  description?: string;
  value?: string;
  disabled?: boolean;
  isHidden?: boolean;
  labelCss?: SerializedStyles;
}

const FormCheckbox = ({
  field,
  fieldState,
  disabled,
  value,
  label,
  description,
  isHidden,
  labelCss,
}: CheckboxProps) => {
  return (
    <FormFieldWrapper field={field} fieldState={fieldState} disabled={disabled} isHidden={isHidden}>
      {(inputProps) => {
        const { css, ...restInputProps } = inputProps;

        return (
          <div>
            <AtomCheckbox
              {...field}
              {...restInputProps}
              inputCss={css}
              labelCss={labelCss}
              value={value}
              checked={field.value}
              label={label}
              onChange={() => {
                field.onChange(!field.value);
              }}
            />
            {description && <p css={styles.description}>{description}</p>}
          </div>
        );
      }}
    </FormFieldWrapper>
  );
};

export default FormCheckbox;

const styles = {
  description: css`
    ${typography.body()}
    color: ${colorPalate.text.neutral};
    padding-left: ${spacing[28]};
    margin-top: ${spacing[6]};
  `,
};
