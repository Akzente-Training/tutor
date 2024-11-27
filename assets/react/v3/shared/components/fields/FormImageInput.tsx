import { __ } from '@wordpress/i18n';

import ImageInput from '@Atoms/ImageInput';
import SVGIcon from '@Atoms/SVGIcon';

import AIImageModal from '@Components/modals/AiImageModal';
import { useModal } from '@Components/modals/Modal';
import ProIdentifierModal from '@CourseBuilderComponents/modals/ProIdentifierModal';
import SetupOpenAiModal from '@CourseBuilderComponents/modals/SetupOpenAiModal';

import { tutorConfig } from '@Config/config';
import type { FormControllerProps } from '@Utils/form';

import generateImage2x from '@Images/pro-placeholders/generate-image-2x.webp';
import generateImage from '@Images/pro-placeholders/generate-image.webp';

import type { SerializedStyles } from '@emotion/react';
import FormFieldWrapper from './FormFieldWrapper';

export type Media = {
  id: number;
  url: string;
  name?: string;
  title: string;
  size_bytes?: number;
  size?: string;
  ext?: string;
};

type FormImageInputProps = {
  label?: string;
  size?: 'large' | 'regular' | 'small';
  onChange?: (media: Media | null) => void;
  helpText?: string;
  buttonText?: string;
  infoText?: string;
  generateWithAi?: boolean;
  previewImageCss?: SerializedStyles;
  loading?: boolean;
  onClickAiButton?: () => void;
} & FormControllerProps<Media | null>;

const isTutorPro = !!tutorConfig.tutor_pro_url;
const hasOpenAiAPIKey = tutorConfig.settings?.chatgpt_key_exist;

const FormImageInput = ({
  field,
  fieldState,
  label,
  size,
  helpText,
  buttonText = __('Upload Media', 'tutor'),
  infoText,
  onChange,
  generateWithAi = false,
  previewImageCss,
  loading,
  onClickAiButton,
}: FormImageInputProps) => {
  const { showModal } = useModal();
  const wpMedia = window.wp.media({
    library: { type: 'image' },
  });

  const fieldValue = field.value;

  const uploadHandler = () => {
    wpMedia.open();
  };

  wpMedia.on('select', () => {
    const attachment = wpMedia.state().get('selection').first().toJSON();
    const { id, url, title } = attachment;

    field.onChange({ id, url, title });

    if (onChange) {
      onChange({ id, url, title });
    }
  });

  const clearHandler = () => {
    field.onChange(null);

    if (onChange) {
      onChange(null);
    }
  };

  const handleAiButtonClick = () => {
    if (!isTutorPro) {
      showModal({
        component: ProIdentifierModal,
        props: {
          image: generateImage,
          image2x: generateImage2x,
        },
      });
    } else if (!hasOpenAiAPIKey) {
      showModal({
        component: SetupOpenAiModal,
        props: {
          image: generateImage,
          image2x: generateImage2x,
        },
      });
    } else {
      showModal({
        component: AIImageModal,
        isMagicAi: true,
        props: {
          title: __('AI Studio', 'tutor'),
          icon: <SVGIcon name="magicAiColorize" width={24} height={24} />,
          field,
          fieldState,
        },
      });
      onClickAiButton?.();
    }
  };

  return (
    <FormFieldWrapper
      label={label}
      field={field}
      fieldState={fieldState}
      helpText={helpText}
      onClickAiButton={handleAiButtonClick}
      generateWithAi={generateWithAi}
    >
      {() => {
        return (
          <div>
            <ImageInput
              size={size}
              value={fieldValue}
              uploadHandler={uploadHandler}
              clearHandler={clearHandler}
              buttonText={buttonText}
              infoText={infoText}
              previewImageCss={previewImageCss}
              loading={loading}
            />
          </div>
        );
      }}
    </FormFieldWrapper>
  );
};

export default FormImageInput;
