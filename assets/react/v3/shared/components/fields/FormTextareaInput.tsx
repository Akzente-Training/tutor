import React from 'react';
import { spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import { css } from '@emotion/react';
import { FormControllerProps } from '@Utils/form';

import FormFieldWrapper from './FormFieldWrapper';

interface FormTextareaInputProps extends FormControllerProps<string | null> {
  label?: string;
  rows?: number;
  columns?: number;
  maxLimit?: number;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  placeholder?: string;
  helpText?: string;
  onChange?: (value: string | number) => void;
  onKeyDown?: (keyName: string) => void;
  isHidden?: boolean;
  enableResize?: boolean;
}

const DEFAULT_ROWS = 6;

const FormTextareaInput = ({
  label,
  rows = DEFAULT_ROWS,
  columns,
  maxLimit,
  field,
  fieldState,
  disabled,
  readOnly,
  loading,
  placeholder,
  helpText,
  onChange,
  onKeyDown,
  isHidden,
  enableResize = false,
}: FormTextareaInputProps) => {
  const inputValue = field.value ?? '';
  
  let characterCount;
  if (maxLimit) {
    characterCount = { maxLimit, inputCharacter: inputValue.toString().length };
  }

  return (
    <FormFieldWrapper
      label={label}
      field={field}
      fieldState={fieldState}
      disabled={disabled}
      readOnly={readOnly}
      loading={loading}
      placeholder={placeholder}
      helpText={helpText}
      isHidden={isHidden}
      characterCount={characterCount}
    >
      {(inputProps) => {
        return (
          <>
            <div css={styles.container(enableResize)}>
              <textarea
                {...field}
                {...inputProps}
                value={inputValue}
                onChange={(event) => {
                  const { value } = event.target;
                  if (maxLimit && value.trim().length > maxLimit) {
                    return;
                  }

                  field.onChange(value);

                  if (onChange) {
                    onChange(value);
                  }
                }}
                onKeyDown={(event) => {
                  onKeyDown && onKeyDown(event.key);
                }}
                autoComplete="off"
                rows={rows}
                cols={columns}
              />
            </div>
          </>
        );
      }}
    </FormFieldWrapper>
  );
};

export default FormTextareaInput;

const styles = {
  container: (enableResize = false) => css`
    position: relative;
    display: flex;

    textarea {
      ${typography.body()}
      height: auto;
      padding: ${spacing[8]} ${spacing[12]};
      resize: none;

      ${enableResize &&
      css`
        resize: vertical;
      `}
    }
  `,
};