import Button from '@TutorShared/atoms/Button';
import FormFieldWrapper from '@TutorShared/components/fields/FormFieldWrapper';
import { useModal } from '@TutorShared/components/modals/Modal';
import CourseCard from '@EnrollmentComponents/CourseCard';
import CourseListModal from '@EnrollmentComponents/modals/CourseListModal';
import type { Course, Enrollment } from '@EnrollmentServices/enrollment';
import type { FormControllerProps } from '@TutorShared/utils/form';
import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { useFormContext } from 'react-hook-form';

interface FormSelectCourseProps extends FormControllerProps<Course | null> {
  disabled?: boolean;
}

function FormSelectCourse({ field, fieldState, disabled }: FormSelectCourseProps) {
  const form = useFormContext<Enrollment>();
  const { showModal } = useModal();

  const selectedCourse = form.watch('course');

  const hasError = !!fieldState.error;

  return (
    <FormFieldWrapper field={field} fieldState={fieldState} disabled={disabled}>
      {() => {
        return (
          <div css={styles.wrapper}>
            {selectedCourse ? (
              <CourseCard
                course={selectedCourse}
                isSubscriptionCourse={!!selectedCourse.plans?.length}
                handleReplaceClick={() => {
                  showModal({
                    component: CourseListModal,
                    props: {
                      title: __('Replace course', 'tutor'),
                      form,
                    },
                    closeOnOutsideClick: true,
                  });
                }}
              />
            ) : (
              <Button
                variant={hasError ? 'danger' : 'primary'}
                isOutlined
                buttonCss={styles.buttonStyle}
                disabled={disabled}
                onClick={() => {
                  showModal({
                    component: CourseListModal,
                    props: {
                      title: __('Select course', 'tutor'),
                      form,
                    },
                    closeOnOutsideClick: true,
                  });
                }}
              >
                {__('Select Course', 'tutor')}
              </Button>
            )}
          </div>
        );
      }}
    </FormFieldWrapper>
  );
}
export default FormSelectCourse;

const styles = {
  wrapper: css``,
  buttonStyle: css`
    width: 100%;
  `,
};
