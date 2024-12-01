import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/react';

import SVGIcon from '@Atoms/SVGIcon';
import { borderRadius, colorTokens, shadow, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import { useQuizModalContext } from '@CourseBuilderContexts/QuizModalContext';
import type { QuizQuestionOption } from '@CourseBuilderServices/quiz';
import { animateLayoutChanges } from '@Utils/dndkit';
import type { FormControllerProps } from '@Utils/form';
import { styleUtils } from '@Utils/style-utils';
import { nanoid } from '@Utils/util';

interface FormTrueFalseProps extends FormControllerProps<QuizQuestionOption> {
  index: number;
  onCheckCorrectAnswer: () => void;
  isOverlay?: boolean;
}

const FormTrueFalse = ({ index, field, onCheckCorrectAnswer, isOverlay = false }: FormTrueFalseProps) => {
  const { activeQuestionId } = useQuizModalContext();

  const inputValue = field.value ?? {
    answer_id: nanoid(),
    answer_title: '',
    is_correct: '0',
    belongs_question_id: activeQuestionId,
    belongs_question_type: 'true_false',
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.value.answer_id || 0,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : undefined,
  };

  return (
    <div
      {...attributes}
      css={styles.option({ isSelected: !!Number(field.value.is_correct), isOverlay })}
      ref={setNodeRef}
      style={style}
    >
      <button type="button" css={styleUtils.resetButton} onClick={onCheckCorrectAnswer}>
        <SVGIcon
          data-check-icon
          name={Number(field.value.is_correct) ? 'checkFilled' : 'check'}
          height={32}
          width={32}
        />
      </button>
      <div css={styles.optionLabel({ isSelected: !!Number(field.value.is_correct), isDragging, isOverlay })}>
        <span>{inputValue.answer_title}</span>

        <button
          {...listeners}
          type="button"
          css={styles.optionDragButton({
            isOverlay,
          })}
          data-visually-hidden
        >
          <SVGIcon name="dragVertical" height={24} width={24} />
        </button>
      </div>
    </div>
  );
};

export default FormTrueFalse;

const styles = {
  optionWrapper: css`
    ${styleUtils.display.flex('column')};
    gap: ${spacing[12]};
  `,
  option: ({
    isSelected,
    isOverlay,
  }: {
    isSelected: boolean;
    isOverlay: boolean;
  }) => css`
    ${styleUtils.display.flex()};
    ${typography.caption('medium')};
    align-items: center;
    color: ${colorTokens.text.subdued};
    gap: ${spacing[10]};
    height: 48px;
    align-items: center;

    [data-check-icon] {
      opacity: 0;
      transition: opacity 0.15s ease-in-out;
      fill: none;
      flex-shrink: 0;
      color: ${colorTokens.icon.default};
    }

    &:hover {
      [data-check-icon] {
        opacity: ${isOverlay ? 0 : 1};
      }
    }


    ${
      isSelected &&
      css`
        [data-check-icon] {
          opacity: 1;
          color: ${colorTokens.bg.success};
        }
      `
    }
  `,
  optionLabel: ({
    isSelected,
    isDragging,
    isOverlay,
  }: {
    isSelected: boolean;
    isDragging: boolean;
    isOverlay: boolean;
  }) => css`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    border-radius: ${borderRadius.card};
    padding: ${spacing[12]} ${spacing[16]};
    background-color: ${colorTokens.background.white};
    text-transform: capitalize;

    [data-visually-hidden] {
      opacity: 0;
    }

    &:hover {
      outline: 1px solid ${colorTokens.stroke.hover};

      [data-visually-hidden] {
        opacity: 1;
      }
    }

    ${
      isSelected &&
      css`
        background-color: ${colorTokens.background.success.fill40};
        color: ${colorTokens.text.primary};

        &:hover {
          outline: 1px solid ${colorTokens.stroke.success.fill70};
        }
      `
    }

    ${
      isDragging &&
      css`
        background-color: ${colorTokens.stroke.hover};
      `
    }

    ${
      isOverlay &&
      css`
        box-shadow: ${shadow.drag};
      `
    }
  `,
  optionDragButton: ({
    isOverlay,
  }: {
    isOverlay: boolean;
  }) => css`
    ${styleUtils.resetButton}
    ${styleUtils.flexCenter()}
    transform: rotate(90deg);
    color: ${colorTokens.icon.default};
    cursor: grab;
    place-self: center center;

    ${
      isOverlay &&
      css`
        cursor: grabbing;
      `
    }
  `,
};
