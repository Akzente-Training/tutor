import React from 'react';
import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { Controller } from 'react-hook-form';

import FormInput from '@Components/fields/FormInput';
import FormTextareaInput from '@Components/fields/FormTextareaInput';
import FormSelectInput from '@Components/fields/FormSelectInput';

import Button from '@Atoms/Button';
import SVGIcon from '@Atoms/SVGIcon';

import { borderRadius, colorTokens, fontWeight, spacing, zIndex } from '@Config/styles';
import { typography } from '@Config/typography';
import { useFormWithGlobalError } from '@Hooks/useFormWithGlobalError';

import ModalWrapper from '@Components/modals/ModalWrapper';
import { ModalProps } from '@Components/modals/Modal';
import FormInputWithContent from '@Components/fields/FormInputWithContent';

interface AddLessonModalProps extends ModalProps {
  closeModal: (props?: { action: 'CONFIRM' | 'CLOSE' }) => void;
}

type TimeLimitUnit = 'weeks' | 'days' | 'hours';

interface AddLessonForm {
  assignment_title: string;
  summary: string;
  attachments: File[] | null;
  time_limit: number;
  time_limit_unit: TimeLimitUnit;
  total_points: number;
  minimum_pass_points: number;
  fileupload_limit: number;
  maximum_filesize_limit: number;
}

const AddAssignmentModal = ({ closeModal, icon, title, subtitle }: AddLessonModalProps) => {
  const form = useFormWithGlobalError<AddLessonForm>({
    defaultValues: {
      assignment_title: '',
      summary: '',
      attachments: null,
      time_limit: 0,
      time_limit_unit: 'weeks',
      total_points: 0,
      minimum_pass_points: 0,
      fileupload_limit: 0,
      maximum_filesize_limit: 0,
    },
  });

  const timeLimitOptions: {
    label: string;
    value: TimeLimitUnit;
  }[] = [
    {
      label: __('Weeks', 'tutor'),
      value: 'weeks',
    },
    {
      label: __('Days', 'tutor'),
      value: 'days',
    },
    {
      label: __('Hours', 'tutor'),
      value: 'hours',
    },
  ];

  const onSubmit = (data: AddLessonForm) => {
    console.log(data);
    closeModal({ action: 'CONFIRM' });
  };

  return (
    <ModalWrapper
      onClose={() => closeModal({ action: 'CLOSE' })}
      icon={icon}
      title={title}
      subtitle={subtitle}
      actions={
        <>
          <Button variant="text" onClick={() => closeModal({ action: 'CLOSE' })}>
            {__('Cancel', 'tutor')}
          </Button>
          <Button variant="primary" onClick={form.handleSubmit(onSubmit)}>
            {__('Save', 'tutor')}
          </Button>
        </>
      }
    >
      <div css={{ width: '1472px', height: '100%' }}>
        <div css={styles.wrapper}>
          <div>
            <div css={styles.assignmentInfo}>
              <Controller
                name="assignment_title"
                control={form.control}
                render={(controllerProps) => (
                  <FormInput
                    {...controllerProps}
                    label={__('Assignment Title', 'tutor')}
                    placeholder={__('Enter Assignment Title', 'tutor')}
                    maxLimit={245}
                    isClearable
                  />
                )}
              />

              <Controller
                name="summary"
                control={form.control}
                render={(controllerProps) => (
                  <FormTextareaInput
                    {...controllerProps}
                    label={__('Summary', 'tutor')}
                    placeholder={__('Enter Assignment Summary', 'tutor')}
                  />
                )}
              />
            </div>
          </div>

          <div css={styles.rightPanel}>
            <div css={styles.uploadAttachment}>
              <span css={styles.uploadLabel}>{__('Attachments', 'tutor')}</span>
              <Button
                icon={<SVGIcon name="attach" height={24} width={24} />}
                variant="secondary"
                buttonContentCss={css`
                  justify-content: center;
                `}
              >
                {__('Upload Attachment', 'tutor')}
              </Button>
            </div>

            <div css={styles.timeLimit}>
              <Controller
                name="time_limit"
                control={form.control}
                render={(controllerProps) => (
                  <FormInput
                    {...controllerProps}
                    type="number"
                    label={__('Time limit', 'tutor')}
                    placeholder="0"
                    helpText={__('Set the time limit for the course. Set 0 for unlimited time', 'tutor')}
                    removeBorder
                    dataAttribute="data-time-limit"
                  />
                )}
              />

              <Controller
                name="time_limit_unit"
                control={form.control}
                render={(controllerProps) => (
                  <FormSelectInput
                    {...controllerProps}
                    options={timeLimitOptions}
                    removeBorder
                    removeOptionsMinWidth
                    dataAttribute="data-time-limit-unit"
                  />
                )}
              />
            </div>

            <Controller
              name="total_points"
              control={form.control}
              render={(controllerProps) => (
                <FormInput
                  {...controllerProps}
                  type="number"
                  label={__('Total points', 'tutor')}
                  placeholder="0"
                  helpText={__('Set the total points for the assignment', 'tutor')}
                />
              )}
            />

            <Controller
              name="minimum_pass_points"
              control={form.control}
              render={(controllerProps) => (
                <FormInput
                  {...controllerProps}
                  type="number"
                  label={__('Minimum pass points', 'tutor')}
                  placeholder="0"
                  helpText={__('Set the minimum pass points for the assignment', 'tutor')}
                />
              )}
            />

            <Controller
              name="fileupload_limit"
              control={form.control}
              render={(controllerProps) => (
                <FormInput
                  {...controllerProps}
                  placeholder="0"
                  type="number"
                  label={__('File upload Limit', 'tutor')}
                  helpText={__('Set the file upload limit for the assignment', 'tutor')}
                />
              )}
            />

            <Controller
              name="maximum_filesize_limit"
              control={form.control}
              render={(controllerProps) => (
                <FormInputWithContent
                  {...controllerProps}
                  type="number"
                  label={__('Maximum file size limit', 'tutor')}
                  placeholder="0"
                  content={__('MB', 'tutor')}
                  contentPosition="right"
                  helpText={__('Set the maximum file size limit for the assignment', 'tutor')}
                />
              )}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddAssignmentModal;

const styles = {
  wrapper: css`
    width: 1035px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 395px;
    height: 100%;
  `,
  assignmentInfo: css`
    padding-block: ${spacing[24]};
    padding-inline: ${spacing[24]} ${spacing[64]};
    display: flex;
    flex-direction: column;
    gap: ${spacing[24]};
    position: sticky;
    top: 0;
  `,
  rightPanel: css`
    border-left: 1px solid ${colorTokens.stroke.divider};
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]};
    padding-block: ${spacing[24]};
    padding-inline: ${spacing[64]} ${spacing[24]};
  `,
  timeLimit: css`
    display: grid;
    align-items: end;
    grid-template-columns: 1fr 100px;

    & input {
      border: 1px solid ${colorTokens.stroke.default};

      &[data-time-limit] {
        border-radius: ${borderRadius[6]} 0 0 ${borderRadius[6]};
        border-right: none;

        &:focus {
          border-right: 1px solid ${colorTokens.stroke.default};
          z-index: ${zIndex.positive};
        }
      }
      &[data-time-limit-unit] {
        border-radius: 0 ${borderRadius[6]} ${borderRadius[6]} 0;
      }
    }
  `,
  uploadAttachment: css`
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]};
  `,
  uploadLabel: css`
    ${typography.body()}
    color: ${colorTokens.text.title};
  `,
};