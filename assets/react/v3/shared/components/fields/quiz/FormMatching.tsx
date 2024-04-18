import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';

import SVGIcon from '@Atoms/SVGIcon';
import Button from '@Atoms/Button';
import ImageInput from '@Atoms/ImageInput';

import { borderRadius, colorTokens, shadow, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import { styleUtils } from '@Utils/style-utils';
import Show from '@Controls/Show';
import type { FormControllerProps } from '@Utils/form';
import type { QuizQuestionOption } from '@CourseBuilderServices/quiz';
import { isDefined } from '@Utils/types';
import { useSortable } from '@dnd-kit/sortable';
import { animateLayoutChanges } from '@Utils/dndkit';
import { CSS } from '@dnd-kit/utilities';
import { useFormContext } from 'react-hook-form';
import { useQuizModalContext } from '@CourseBuilderContexts/QuizModalContext';
import type { QuizForm } from '@CourseBuilderComponents/modals/QuizModal';

interface FormMatchingProps extends FormControllerProps<QuizQuestionOption> {
  index: number;
  imageMatching: boolean;
  onRemoveOption: () => void;
}

const FormMatching = ({ index, imageMatching, onRemoveOption, field }: FormMatchingProps) => {
  const inputValue = field.value ?? {
    ID: '',
    title: '',
  };
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useFormContext<QuizForm>();
  const { activeQuestionIndex } = useQuizModalContext();
  const markAsCorrect = form.watch(`questions.${activeQuestionIndex}.markAsCorrect`);

  const isCorrect = Array.isArray(markAsCorrect)
    ? markAsCorrect.some((item) => item === inputValue.ID)
    : markAsCorrect === inputValue.ID;

  const [isEditing, setIsEditing] = useState(false);
  const [previousValue] = useState<QuizQuestionOption>(inputValue);

  const wpMedia = window.wp.media({
    library: { type: 'image' },
  });

  const uploadHandler = () => {
    wpMedia.open();
  };

  wpMedia.on('select', () => {
    const attachment = wpMedia.state().get('selection').first().toJSON();
    const { id, url, title } = attachment;

    field.onChange({
      ...inputValue,
      image: { id, url, title },
    });
  });

  const clearHandler = () => {
    field.onChange({
      ...inputValue,
      image: {
        id: null,
        url: '',
        title: '',
      },
    });
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.value?.ID || 0,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : undefined,
  };

  useEffect(() => {
    if (isDefined(inputRef.current) && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div {...attributes} css={styles.option({ isSelected: isCorrect, isEditing })} ref={setNodeRef} style={style}>
      <div
        onClick={() => form.setValue(`questions.${activeQuestionIndex}.markAsCorrect`, field.value.ID)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            form.setValue(`questions.${activeQuestionIndex}.markAsCorrect`, field.value.ID);
          }
        }}
      >
        <SVGIcon data-check-icon name={isCorrect ? 'checkFilled' : 'check'} height={32} width={32} />
      </div>
      <div
        css={styles.optionLabel({ isSelected: isCorrect, isEditing })}
        onClick={() => {
          form.setValue(`questions.${activeQuestionIndex}.markAsCorrect`, field.value.ID);
        }}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === 'Enter') {
            form.setValue(`questions.${activeQuestionIndex}.markAsCorrect`, field.value.ID);
          }
        }}
      >
        <div css={styles.optionHeader}>
          <div css={styles.optionCounter({ isSelected: isCorrect, isEditing })}>{String.fromCharCode(65 + index)}</div>

          <button {...listeners} type="button" css={styles.optionDragButton} data-visually-hidden>
            <SVGIcon name="dragVertical" height={24} width={24} />
          </button>

          <div css={styles.optionActions}>
            <button
              type="button"
              css={styles.actionButton}
              data-edit-button
              onClick={(event) => {
                event.stopPropagation();
                setIsEditing(true);
              }}
            >
              <SVGIcon name="edit" width={24} height={24} />
            </button>
            <button
              type="button"
              css={styles.actionButton}
              data-visually-hidden
              onClick={(event) => {
                event.stopPropagation();
                alert('@TODO: will be implemented later');
              }}
            >
              <SVGIcon name="copyPaste" width={24} height={24} />
            </button>
            <button
              type="button"
              css={styles.actionButton}
              data-visually-hidden
              onClick={(event) => {
                event.stopPropagation();
                onRemoveOption();
              }}
            >
              <SVGIcon name="delete" width={24} height={24} />
            </button>
          </div>
        </div>
        <div css={styles.optionBody}>
          <Show
            when={isEditing}
            fallback={
              <div css={styles.placeholderWrapper({ isImageMatching: imageMatching })}>
                <Show
                  when={imageMatching}
                  fallback={
                    <div css={styles.optionPlaceholder}>{inputValue.title || __('Answer title...', 'tutor')}</div>
                  }
                >
                  <Show
                    when={inputValue.image}
                    fallback={
                      <div css={styles.imagePlaceholder}>
                        <SVGIcon name="imagePreview" height={48} width={48} />
                      </div>
                    }
                  >
                    {(image) => (
                      <div css={styles.imagePlaceholder}>
                        <img src={image.url} alt={image.title} />
                      </div>
                    )}
                  </Show>
                </Show>
                <div css={styles.optionPlaceholder}>
                  {inputValue.matchedTitle || __('Matched answer titile...', 'tutor')}
                </div>
              </div>
            }
          >
            <div css={styles.optionInputWrapper}>
              <Show
                when={imageMatching}
                fallback={
                  <input
                    {...field}
                    ref={inputRef}
                    type="text"
                    css={styles.optionInput}
                    placeholder={__('Write anything..', 'tutor')}
                    value={inputValue.title}
                    onChange={(event) => {
                      field.onChange({
                        ...inputValue,
                        title: event.target.value,
                      });
                    }}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                    }}
                  />
                }
              >
                <ImageInput
                  value={inputValue.image || null}
                  infoText={__('Size: 700x430 pixels', 'tutor')}
                  uploadHandler={uploadHandler}
                  clearHandler={clearHandler}
                  emptyImageCss={styles.emptyImageInput}
                  previewImageCss={styles.previewImageInput}
                />
              </Show>
              <input
                {...field}
                type="text"
                css={styles.optionInput}
                placeholder={__('Matched option..', 'tutor')}
                value={inputValue.matchedTitle}
                onChange={(event) => {
                  field.onChange({
                    ...inputValue,
                    matchedTitle: event.target.value,
                  });
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                }}
              />
              <div css={styles.optionInputButtons}>
                <Button
                  variant="text"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsEditing(false);
                    field.onChange(previousValue);
                  }}
                >
                  {__('Cancel', 'tutor')}
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsEditing(false);
                  }}
                >
                  {__('Ok', 'tutor')}
                </Button>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default FormMatching;

const styles = {
  option: ({
    isSelected,
    isEditing,
  }: {
    isSelected: boolean;
    isEditing: boolean;
  }) => css`
      ${styleUtils.display.flex()};
      ${typography.caption('medium')};
      align-items: center;
      color: ${colorTokens.text.subdued};
      gap: ${spacing[10]};
      align-items: center;
  
      [data-check-icon] {
        opacity: 0;
        transition: opacity 0.15s ease-in-out;
        fill: none;
      }

      [data-visually-hidden] {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }

      [data-edit-button] {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
  
      &:hover {
        [data-check-icon] {
          opacity: 1;
        }

        [data-visually-hidden] {
          opacity: 1;
        }

        ${
          !isEditing &&
          css`
          [data-edit-button] {
            opacity: 1;
          }
        `
        }
      }
  
  
      ${
        isSelected &&
        css`
          [data-check-icon] {
            opacity: 1;
            fill: ${colorTokens.bg.success};
          }
        `
      }

      ${
        isEditing &&
        css`
        [data-edit-button] {
          opacity: 0;
        }
      `
      }
    `,
  optionLabel: ({
    isSelected,
    isEditing,
  }: {
    isSelected: boolean;
    isEditing: boolean;
  }) => css`
      display: flex;
      flex-direction: column;
      gap: ${spacing[12]};
      width: 100%;
      border-radius: ${borderRadius.card};
      padding: ${spacing[12]} ${spacing[16]};
      transition: box-shadow 0.15s ease-in-out;
      background-color: ${colorTokens.background.white};
      cursor: pointer;
  
      &:hover {
        box-shadow: 0 0 0 1px ${colorTokens.stroke.hover};
      }
  
      ${
        isSelected &&
        css`
          background-color: ${colorTokens.background.success.fill40};
          color: ${colorTokens.text.primary};
  
          &:hover {
            box-shadow: 0 0 0 1px ${colorTokens.stroke.success.fill70};
          }
        `
      }

      ${
        isEditing &&
        css`
          background-color: ${colorTokens.background.white};
          box-shadow: 0 0 0 1px ${isSelected ? colorTokens.stroke.success.fill70 : colorTokens.stroke.brand};

          &:hover {
            box-shadow: 0 0 0 1px ${isSelected ? colorTokens.stroke.success.fill70 : colorTokens.stroke.brand};
          }
        `
      }
    `,
  optionHeader: css`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  `,
  optionCounter: ({
    isSelected,
    isEditing,
  }: {
    isSelected: boolean;
    isEditing: boolean;
  }) => css`
    height: ${spacing[24]};
    width: ${spacing[24]};
    border-radius: ${borderRadius.min};
    ${typography.caption('medium')};
    color: ${colorTokens.text.subdued};
    background-color: ${colorTokens.background.default};
    text-align: center;
    place-self: center start;

    ${
      isSelected &&
      !isEditing &&
      css`
        background-color: ${colorTokens.bg.white};
      `
    }
  `,
  optionDragButton: css`
    ${styleUtils.resetButton}
    ${styleUtils.flexCenter()}
    transform: rotate(90deg);
    color: ${colorTokens.icon.default};
    cursor: grab;
    place-self: center center;
  `,
  optionActions: css`
    ${styleUtils.display.flex()}
    gap: ${spacing[8]};
    place-self: center end;
  `,
  actionButton: css`
    ${styleUtils.resetButton};
    ${styleUtils.display.flex()}
    color: ${colorTokens.icon.default};
    cursor: pointer;
  `,
  optionBody: css`
    ${styleUtils.display.flex()}
  `,
  placeholderWrapper: ({
    isImageMatching,
  }: {
    isImageMatching: boolean;
  }) => css`
    ${styleUtils.display.flex('column')}
    width: 100%;

    ${
      isImageMatching &&
      css`
        gap: ${spacing[12]};
      `
    }
  `,
  imagePlaceholder: css`
    ${styleUtils.flexCenter()};
    height: 210px;
    width: 100%;
    background-color: ${colorTokens.background.default};
    border-radius: ${borderRadius.card};
    overflow: hidden;
    svg {
      color: ${colorTokens.icon.hints};
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  `,
  emptyImageInput: css`
    background-color: ${colorTokens.background.default};
    height: 210px;
  `,
  previewImageInput: css`
    height: 210px;
  `,
  optionPlaceholder: css`
    ${typography.body()};
    color: ${colorTokens.text.subdued};
    padding-block: ${spacing[4]};
  `,
  optionInputWrapper: css`
    ${styleUtils.display.flex('column')}
    width: 100%;
    gap: ${spacing[12]};
  `,
  optionInput: css`
    ${styleUtils.resetButton};
    ${typography.caption()};
    flex: 1;
    color: ${colorTokens.text.subdued};
    padding: ${spacing[4]} ${spacing[10]};
    box-shadow: 0 0 0 1px ${colorTokens.stroke.default};
    border-radius: ${borderRadius[6]};
    resize: vertical;

    &:focus {
      box-shadow: ${shadow.focus};
    }
  `,
  optionInputButtons: css`
    ${styleUtils.display.flex()}
    justify-content: flex-end;
    gap: ${spacing[8]};
  `,
};
