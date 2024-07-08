import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { Controller } from 'react-hook-form';

import Button from '@Atoms/Button';

import FormDateInput from '@Components/fields/FormDateInput';
import FormInput from '@Components/fields/FormInput';
import FormTextareaInput from '@Components/fields/FormTextareaInput';
import FormTimeInput from '@Components/fields/FormTimeInput';

import { borderRadius, colorPalate, colorTokens, fontSize, shadow, spacing, zIndex } from '@Config/styles';
import { typography } from '@Config/typography';
import { useFormWithGlobalError } from '@Hooks/useFormWithGlobalError';

import FormSelectInput from '@Components/fields/FormSelectInput';
import { useIsScrolling } from '@Hooks/useIsScrolling';
import { styleUtils } from '@Utils/style-utils';
import { useSaveZoomMeetingMutation, type ZoomMeeting, type ZoomMeetingFormData } from '@CourseBuilderServices/course';
import { getCourseId } from '@CourseBuilderUtils/utils';
import { format } from 'date-fns';
import { DateFormats } from '@Config/constants';

interface MeetingFormProps {
  onCancel: () => void;
  data: ZoomMeeting | null;
  timezones: {
    [key: string]: string;
  };
  meetingHost: {
    [key: string]: string;
  };
  topicId?: string;
}

const courseId = getCourseId();

const ZoomMeetingForm = ({ onCancel, data, timezones, meetingHost, topicId }: MeetingFormProps) => {
  const { ref, isScrolling } = useIsScrolling({ defaultValue: true });
  const currentMeeting = data;

  const meetingForm = useFormWithGlobalError<ZoomMeetingFormData>({
    defaultValues: {
      meeting_name: currentMeeting?.post_title ?? '',
      meeting_summary: currentMeeting?.post_content ?? '',
      meeting_date: currentMeeting?.meeting_data.start_time
        ? format(new Date(currentMeeting?.meeting_data.start_time), DateFormats.yearMonthDay)
        : '',
      meeting_time: currentMeeting?.meeting_data.start_time
        ? format(new Date(currentMeeting?.meeting_data.start_time), DateFormats.hoursMinutes)
        : '',
      meeting_duration: currentMeeting?.meeting_data.duration ? String(currentMeeting?.meeting_data.duration) : '',
      meeting_duration_unit: currentMeeting?.meeting_data.duration_unit ?? 'min',
      meeting_timezone: currentMeeting?.meeting_data.timezone ?? '',
      auto_recording: currentMeeting?.meeting_data.settings.auto_recording ?? 'none',
      meeting_password: currentMeeting?.meeting_data.password ?? '',
      meeting_host: Object.values(meetingHost)[0],
    },
  });

  const saveZoomMeeting = useSaveZoomMeetingMutation(String(courseId));
  const timeZonesOptions = Object.keys(timezones).map((key) => ({
    label: timezones[key],
    value: key,
  }));

  const onSubmit = async (formData: ZoomMeetingFormData) => {
    if (!courseId) {
      return;
    }

    const response = await saveZoomMeeting.mutateAsync({
      ...(currentMeeting && { meeting_id: Number(currentMeeting.ID) }),
      ...(topicId && { topic_id: Number(topicId) }),
      course_id: courseId,
      meeting_title: formData.meeting_name,
      meeting_summary: formData.meeting_summary,
      meeting_date: format(new Date(formData.meeting_date), DateFormats.monthDayYear),
      meeting_time: formData.meeting_time,
      meeting_duration: Number(formData.meeting_duration),
      meeting_duration_unit: formData.meeting_duration_unit,
      meeting_timezone: formData.meeting_timezone,
      auto_recording: formData.auto_recording,
      meeting_password: formData.meeting_password,
      click_form: topicId ? 'course_builder' : 'metabox',
      meeting_host: Object.keys(meetingHost)[0],
    });

    if (response.data) {
      onCancel();
      meetingForm.reset();
    }
  };

  return (
    <div css={styles.container}>
      <div css={styles.formWrapper} ref={ref}>
        <Controller
          name="meeting_name"
          control={meetingForm.control}
          rules={{
            required: 'Meeting name is required',
          }}
          render={(controllerProps) => (
            <FormInput
              {...controllerProps}
              label={__('Meeting Name', 'tutor')}
              placeholder={__('Enter meeting name', 'tutor')}
            />
          )}
        />

        <Controller
          name="meeting_summary"
          control={meetingForm.control}
          rules={{
            required: 'Meeting summary is required',
          }}
          render={(controllerProps) => (
            <FormTextareaInput
              {...controllerProps}
              label={__('Meeting Summary', 'tutor')}
              placeholder={__('Enter meeting summary', 'tutor')}
              rows={3}
              enableResize
            />
          )}
        />

        <div css={styles.meetingDateTimeWrapper}>
          <Controller
            name="meeting_date"
            control={meetingForm.control}
            rules={{
              required: 'Meeting date is required',
            }}
            render={(controllerProps) => (
              <FormDateInput
                {...controllerProps}
                label={__('Meeting Date', 'tutor')}
                placeholder={__('Enter meeting date', 'tutor')}
                disabledBefore={new Date().toISOString()}
              />
            )}
          />

          <Controller
            name="meeting_time"
            control={meetingForm.control}
            rules={{
              required: 'Meeting time is required',
            }}
            render={(controllerProps) => <FormTimeInput {...controllerProps} placeholder={__('Start time', 'tutor')} />}
          />
          <div css={styles.meetingTimeWrapper}>
            <Controller
              name="meeting_duration"
              control={meetingForm.control}
              rules={{
                required: 'Meeting duration is required',
              }}
              render={(controllerProps) => (
                <FormInput {...controllerProps} placeholder={__('Duration', 'tutor')} type="number" />
              )}
            />
            <Controller
              name="meeting_duration_unit"
              control={meetingForm.control}
              rules={{
                required: 'Meeting duration unit is required',
              }}
              render={(controllerProps) => (
                <FormSelectInput
                  {...controllerProps}
                  options={[
                    { label: 'Minutes', value: 'min' },
                    { label: 'Hours', value: 'hr' },
                  ]}
                />
              )}
            />
          </div>
        </div>

        <Controller
          name="meeting_timezone"
          control={meetingForm.control}
          rules={{
            required: 'Time zone is required',
          }}
          render={(controllerProps) => (
            <FormSelectInput
              {...controllerProps}
              label={__('Time Zone', 'tutor')}
              placeholder="Select time zone"
              options={timeZonesOptions}
              isSearchable
            />
          )}
        />
        <Controller
          name="auto_recording"
          control={meetingForm.control}
          rules={{
            required: 'Auto recording is required',
          }}
          render={(controllerProps) => (
            <FormSelectInput
              {...controllerProps}
              label={__('Auto recording', 'tutor')}
              placeholder="Select auto recording option"
              options={[
                { label: 'No Recordings', value: 'none' },
                { label: 'Local', value: 'local' },
                { label: 'Cloud', value: 'cloud' },
              ]}
            />
          )}
        />

        <Controller
          name="meeting_password"
          control={meetingForm.control}
          rules={{
            required: 'Meeting password is required',
          }}
          render={(controllerProps) => (
            <FormInput
              {...controllerProps}
              label={__('Meeting Password', 'tutor')}
              placeholder={__('Enter meeting password', 'tutor')}
              type="password"
              isPassword
            />
          )}
        />

        <Controller
          name="meeting_host"
          control={meetingForm.control}
          rules={{
            required: 'Meeting host is required',
          }}
          render={(controllerProps) => (
            <FormInput
              {...controllerProps}
              label={__('Meeting Host', 'tutor')}
              placeholder={__('Enter meeting host', 'tutor')}
              disabled
            />
          )}
        />
      </div>

      <div css={styles.buttonWrapper({ isScrolling })}>
        <Button variant="text" size="small" onClick={onCancel}>
          {__('Cancel', 'tutor')}
        </Button>
        <Button
          loading={saveZoomMeeting.isPending}
          variant="primary"
          size="small"
          onClick={meetingForm.handleSubmit(onSubmit)}
        >
          {data ? __('Update Meeting', 'tutor') : __('Create Meeting', 'tutor')}
        </Button>
      </div>
    </div>
  );
};

export default ZoomMeetingForm;

const styles = {
  container: css`
    ${styleUtils.display.flex('column')}
    background: ${colorTokens.background.white};
    padding-block: ${spacing[12]};
    border-radius: ${borderRadius.card};
    box-shadow: ${shadow.popover};
    ${typography.caption('regular')};

    * > label {
      font-size: ${fontSize[15]};
      color: ${colorPalate.text.default};
    }
  `,
  formWrapper: css`
    ${styleUtils.display.flex('column')}
    padding-inline: ${spacing[12]};
    padding-bottom: ${spacing[8]};
    gap: ${spacing[12]};
    max-height: 400px;
    height: 100%;
    overflow-y: auto;
  `,
  meetingDateTimeWrapper: css`
    ${styleUtils.display.flex('column')}
    gap: ${spacing[6]};
  `,
  meetingTimeWrapper: css`
    ${styleUtils.display.flex()}
    justify-content: space-between;
    align-items: flex-start;
    gap: ${spacing[6]};
  `,
  buttonWrapper: ({ isScrolling = false }) => css`
    ${styleUtils.display.flex()}
    padding-top: ${spacing[8]};
    padding-inline: ${spacing[12]};
    justify-content: flex-end;
    gap: ${spacing[8]};
    z-index: ${zIndex.positive};
    ${
      isScrolling &&
      css`
      box-shadow: ${shadow.scrollable};
    `
    }
  `,
};