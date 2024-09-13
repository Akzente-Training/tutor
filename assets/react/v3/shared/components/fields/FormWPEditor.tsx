import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { rgba } from 'polished';

import Button from '@Atoms/Button';
import { LoadingOverlay } from '@Atoms/LoadingSpinner';
import SVGIcon from '@Atoms/SVGIcon';
import Tooltip from '@Atoms/Tooltip';
import WPEditor from '@Atoms/WPEditor';

import AITextModal from '@Components/modals/AITextModal';
import { useModal } from '@Components/modals/Modal';

import { borderRadius, colorTokens, spacing } from '@Config/styles';
import For from '@Controls/For';
import Show from '@Controls/Show';
import type { Editor } from '@CourseBuilderServices/course';
import type { FormControllerProps } from '@Utils/form';
import { styleUtils } from '@Utils/style-utils';
import type { IconCollection } from '@Utils/types';
import { makeFirstCharacterUpperCase } from '@Utils/util';

import FormFieldWrapper from './FormFieldWrapper';

interface FormWPEditorProps extends FormControllerProps<string | null> {
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  placeholder?: string;
  helpText?: string;
  onChange?: (value: string) => void;
  generateWithAi?: boolean;
  onClickAiButton?: () => void;
  hasCustomEditorSupport?: boolean;
  isMinimal?: boolean;
  editors?: Editor[];
  editorUsed?: Editor;
  isMagicAi?: boolean;
  autoFocus?: boolean;
  onCustomEditorButtonClick?: (editor: Editor) => Promise<void>;
  onFullScreenChange?: (isFullScreen: boolean) => void;
}

const customEditorIcons: { [key: string]: IconCollection } = {
  droip: 'droipColorized',
  elementor: 'elementorColorized',
  gutenberg: 'gutenbergColorized',
};

const FormWPEditor = ({
  label,
  field,
  fieldState,
  disabled,
  readOnly,
  loading,
  placeholder,
  helpText,
  onChange,
  generateWithAi = false,
  onClickAiButton,
  hasCustomEditorSupport = false,
  isMinimal = false,
  editors = [],
  editorUsed = { name: 'classic', label: 'Classic Editor', link: '' },
  isMagicAi = false,
  autoFocus = false,
  onCustomEditorButtonClick,
  onFullScreenChange,
}: FormWPEditorProps) => {
  const { showModal } = useModal();

  const editorLabel = hasCustomEditorSupport ? (
    <div css={styles.editorLabel}>
      <span>{label}</span>
      <Show when={editors.length && editorUsed.name === 'classic'}>
        <div css={styles.editorsButtonWrapper}>
          <span>{__('Edit with', 'tutor')}</span>
          <div css={styles.customEditorButtons}>
            <For each={editors}>
              {(editor) => (
                <Tooltip key={editor.name} content={makeFirstCharacterUpperCase(editor.name)} delay={200}>
                  <button
                    key={editor.name}
                    type="button"
                    css={styles.customEditorButton}
                    onClick={async () => {
                      try {
                        await onCustomEditorButtonClick?.(editor);
                        window.location.href = editor.link;
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    <SVGIcon name={customEditorIcons[editor.name]} height={24} width={24} />
                  </button>
                </Tooltip>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  ) : (
    label
  );

  return (
    <FormFieldWrapper
      label={editorLabel}
      field={field}
      fieldState={fieldState}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      helpText={helpText}
      generateWithAi={generateWithAi}
      isMagicAi={isMagicAi}
      onClickAiButton={() => {
        showModal({
          component: AITextModal,
          isMagicAi: true,
          props: {
            title: __('AI Studio', 'tutor'),
            icon: <SVGIcon name="magicAiColorize" width={24} height={24} />,
            field,
            fieldState,
            is_html: true,
          },
        });
      }}
      replaceEntireLabel
    >
      {() => {
        return (
          <Show
            when={hasCustomEditorSupport}
            fallback={
              <WPEditor
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);

                  if (onChange) {
                    onChange(value);
                  }
                }}
                isMinimal={isMinimal}
                autoFocus={autoFocus}
                onFullScreenChange={onFullScreenChange}
              />
            }
          >
            <Show
              when={editorUsed.name === 'classic' && !loading}
              fallback={
                <div css={styles.editorOverlay}>
                  {loading ? (
                    <LoadingOverlay />
                  ) : (
                    <Button
                      variant="tertiary"
                      size="small"
                      buttonCss={styles.editWithButton}
                      icon={
                        customEditorIcons[editorUsed.name] && (
                          <SVGIcon name={customEditorIcons[editorUsed.name]} height={24} width={24} />
                        )
                      }
                      onClick={async () => {
                        if (editorUsed) {
                          try {
                            await onCustomEditorButtonClick?.(editorUsed);
                            window.location.href = editorUsed.link;
                          } catch (error) {
                            console.error(error);
                          }
                        }
                      }}
                    >
                      {editorUsed?.label}
                    </Button>
                  )}
                </div>
              }
            >
              <WPEditor
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);

                  if (onChange) {
                    onChange(value);
                  }
                }}
                isMinimal={isMinimal}
                onFullScreenChange={onFullScreenChange}
              />
            </Show>
          </Show>
        );
      }}
    </FormFieldWrapper>
  );
};

export default FormWPEditor;

const styles = {
  editorLabel: css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  `,
  editorsButtonWrapper: css`
    display: flex;
    align-items: center;
    gap: ${spacing[8]};
    color: ${colorTokens.text.hints};
  `,
  customEditorButtons: css`
    display: flex;
    align-items: center;
    gap: ${spacing[4]};
  `,
  customEditorButton: css`
    ${styleUtils.resetButton}
    display: flex;
    align-items: center;
  `,
  editorOverlay: css`
    height: 360px;
    ${styleUtils.flexCenter()};
    background-color: ${rgba(colorTokens.background.modal, 0.6)};
    border-radius: ${borderRadius.card};
  `,
  editWithButton: css`
    background: ${colorTokens.action.secondary};
    color: ${colorTokens.text.primary};
    box-shadow: inset 0 -1px 0 0 ${rgba('#1112133D', 0.24)}, 0 1px 0 0 ${rgba('#1112133D', 0.8)};
  `,
};
