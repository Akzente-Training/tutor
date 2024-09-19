import Button from '@Atoms/Button';
import SVGIcon from '@Atoms/SVGIcon';
import FormInputWithContent from '@Components/fields/FormInputWithContent';
import BasicModalWrapper from '@Components/modals/BasicModalWrapper';
import type { ModalProps } from '@Components/modals/Modal';
import { DateFormats } from '@Config/constants';
import { colorTokens, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import { type ContentType, useGetH5PLessonContentsQuery } from '@CourseBuilderServices/curriculum';
import { type H5PContent, useGetH5PQuizContentsQuery } from '@CourseBuilderServices/quiz';
import { useDebounce } from '@Hooks/useDebounce';
import { useFormWithGlobalError } from '@Hooks/useFormWithGlobalError';
import type { Column } from '@Molecules/Table';
import Table from '@Molecules/Table';
import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { format } from 'date-fns';
import { Controller } from 'react-hook-form';

interface H5PContentListModalProps extends ModalProps {
  closeModal: (props?: { action: 'CONFIRM' | 'CLOSE' }) => void;
  onAddContent: (content: H5PContent) => void;
  contentType: ContentType;
}

const H5PContentListModal = ({ title, closeModal, onAddContent, contentType }: H5PContentListModalProps) => {
  const form = useFormWithGlobalError<{
    search: string;
  }>({
    defaultValues: {
      search: '',
    },
  });
  const search = useDebounce(form.watch('search'), 300);
  const getH5PQuizzesQuery = useGetH5PQuizContentsQuery(search, contentType);
  const getH5PContentsQuery = useGetH5PLessonContentsQuery(search, contentType);

  const content = contentType === 'tutor_h5p_quiz' ? getH5PQuizzesQuery.data : getH5PContentsQuery.data;

  const columns: Column<H5PContent>[] = [
    {
      Header: <div css={styles.tableLabel}>{__('Title', 'tutor')}</div>,
      Cell: (item) => {
        return <div css={styles.title}>{item.title}</div>;
      },
    },
    {
      Header: <div css={styles.tableLabel}>{__('Content Type', 'tutor')}</div>,
      Cell: (item) => {
        return <div>{item.content_type}</div>;
      },
    },
    {
      Header: <div css={styles.tableLabel}>{__('Author', 'tutor')}</div>,
      Cell: (item) => {
        return <div>{item.user_name}</div>;
      },
    },
    {
      Header: <div css={styles.tableLabel}>{__('Created At', 'tutor')}</div>,
      Cell: (item) => {
        return <div>{format(new Date(item.updated_at), DateFormats.yearMonthDayHourMinuteSecond)}</div>;
      },
    },
    {
      Header: <div css={styles.tableLabel}>{__('Actions', 'tutor')}</div>,
      Cell: (item) => {
        return (
          <div>
            <Button
              size="small"
              variant="secondary"
              onClick={() => {
                closeModal({ action: 'CONFIRM' });
                onAddContent(item);
              }}
            >
              {__('Add Content', 'tutor')}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <BasicModalWrapper title={title} onClose={() => closeModal({ action: 'CLOSE' })}>
      <div css={styles.modalWrapper}>
        <div css={styles.searchWrapper}>
          <Controller
            control={form.control}
            name="search"
            render={(controllerProps) => (
              <FormInputWithContent
                {...controllerProps}
                showVerticalBar={false}
                content={<SVGIcon name="search" width={24} height={24} />}
              />
            )}
          />
        </div>
        <div css={styles.tableWrapper}>
          <Table
            columns={columns}
            data={content?.output || []}
            loading={getH5PQuizzesQuery.isLoading || getH5PContentsQuery.isLoading}
          />
        </div>
      </div>
    </BasicModalWrapper>
  );
};

export default H5PContentListModal;

const styles = {
  modalWrapper: css`
    width: 720px;
    padding-bottom: ${spacing[28]};
  `,
  searchWrapper: css`
    display: flex;
    padding: ${spacing[20]};
  `,
  tableWrapper: css`
    max-height: calc(100vh - 350px);
    overflow: auto;

    tr {
      &:hover {
        &:hover {
          [data-button] {
            display: block;
          }
          [data-price] {
            display: none;
          }
        }
      }
    }
  `,
  tableLabel: css`
    ${typography.body('medium')};
    text-align: left;
    color: ${colorTokens.text.primary};
  `,
  title: css`
    text-align: left;
    ${typography.caption()};
  `,
};
