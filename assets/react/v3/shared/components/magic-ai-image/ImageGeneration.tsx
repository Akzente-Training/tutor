import MagicButton from '@Atoms/MagicButton';
import SVGIcon from '@Atoms/SVGIcon';
import FormImageRadioGroup from '@Components/fields/FormImageRadioGroup';
import FormTextareaInput from '@Components/fields/FormTextareaInput';
import { borderRadius, colorTokens, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import For from '@Controls/For';
import Show from '@Controls/Show';
import { useMagicImageGenerationMutation } from '@CourseBuilderServices/magic-ai';
import threeDSrc from '@Images/ai-types/3d.jpg';
import blackAndWhiteSrc from '@Images/ai-types/black-and-white.jpg';
import cartoonSrc from '@Images/ai-types/cartoon.jpg';
import illustrationSrc from '@Images/ai-types/illustration.jpg';
import noneSrc from '@Images/ai-types/none.jpg';
import photoSrc from '@Images/ai-types/photo.jpg';
import sketchSrc from '@Images/ai-types/sketch.jpg';
import { styleUtils } from '@Utils/style-utils';
import type { OptionWithImage } from '@Utils/types';
import { css } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  type MagicImageGenerationFormFields,
  type StyleType,
  inspirationPrompts,
  useMagicImageGeneration,
} from './ImageContext';
import { AiImageItem } from './ImageItem';
import { magicAIStyles } from './styles';

const styleOptions: OptionWithImage<StyleType>[] = [
  {
    label: __('None', 'tutor'),
    value: 'none',
    image: noneSrc,
  },
  {
    label: __('Filmic', 'tutor'),
    value: 'filmic',
    image: photoSrc,
  },
  {
    label: __('Photo', 'tutor'),
    value: 'photo',
    image: illustrationSrc,
  },
  {
    label: __('Neon', 'tutor'),
    value: 'neon',
    image: illustrationSrc,
  },
  {
    label: __('Dreamy', 'tutor'),
    value: 'dreamy',
    image: illustrationSrc,
  },
  {
    label: __('Black and white', 'tutor'),
    value: 'black-and-white',
    image: blackAndWhiteSrc,
  },
  {
    label: __('Retrowave', 'tutor'),
    value: 'retrowave',
    image: illustrationSrc,
  },
  {
    label: __('3D', 'tutor'),
    value: '3d',
    image: threeDSrc,
  },
  {
    label: __('Concept art', 'tutor'),
    value: 'concept_art',
    image: sketchSrc,
  },
  {
    label: __('Sketch', 'tutor'),
    value: 'sketch',
    image: sketchSrc,
  },
  {
    label: __('Illustration', 'tutor'),
    value: 'illustration',
    image: illustrationSrc,
  },
  {
    label: __('Painting', 'tutor'),
    value: 'painting',
    image: cartoonSrc,
  },
];

export const ImageGeneration = () => {
  const form = useForm<MagicImageGenerationFormFields>({
    defaultValues: {
      style: 'none',
      prompt: '',
    },
  });
  const { images, setImages } = useMagicImageGeneration();
  const magicImageGenerationMutation = useMagicImageGenerationMutation();
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [imageLoading, setImageLoading] = useState([false, false, false, false]);

  return (
    <form
      css={magicAIStyles.wrapper}
      onSubmit={form.handleSubmit(async (values) => {
        setImageLoading([true, true, true, true]);
        setShowEmptyState(false);
        await Promise.all(
          Array.from({ length: 4 }).map((_, index) => {
            return magicImageGenerationMutation.mutateAsync(values).then((response) => {
              setImages((previous) => {
                const copy = [...previous];
                copy[index] = response.data.data?.[0]?.b64_json ?? null;
                return copy;
              });

              setImageLoading((previous) => {
                const copy = [...previous];
                copy[index] = false;
                return copy;
              });
            });
          }),
        );
      })}
    >
      <div css={magicAIStyles.left}>
        <Show when={!showEmptyState} fallback={<SVGIcon name="magicAiPlaceholder" width={72} height={72} />}>
          <div css={styles.images}>
            <For each={images}>
              {(src, index) => {
                return <AiImageItem key={index} src={src} loading={imageLoading[index]} index={index} />;
              }}
            </For>
          </div>
        </Show>
      </div>
      <div css={magicAIStyles.right}>
        <div css={styles.fields}>
          <div css={styles.promptWrapper}>
            <Controller
              control={form.control}
              name="prompt"
              render={(props) => (
                <FormTextareaInput
                  {...props}
                  label={__('Describe your image', 'tutor')}
                  placeholder={__('Write 5 words to describe...', 'tutor')}
                  rows={4}
                  isMagicAi
                  disabled={magicImageGenerationMutation.isPending}
                />
              )}
            />
            <button
              type="button"
              css={styles.inspireButton}
              onClick={() => {
                const length = inspirationPrompts.length;
                const index = Math.floor(Math.random() * length);
                form.reset({ ...form.getValues(), prompt: inspirationPrompts[index] });
              }}
              disabled={magicImageGenerationMutation.isPending}
            >
              <SVGIcon name="bulbLine" />
              {__('Inspire me', 'tutor')}
            </button>
          </div>

          <Controller
            control={form.control}
            name="style"
            render={(props) => (
              <FormImageRadioGroup
                {...props}
                label={__('Styles', 'tutor')}
                options={styleOptions}
                disabled={magicImageGenerationMutation.isPending}
              />
            )}
          />
        </div>

        <div css={magicAIStyles.rightFooter}>
          <MagicButton type="submit" disabled={magicImageGenerationMutation.isPending}>
            <SVGIcon name={images.length > 0 ? 'reload' : 'magicAi'} width={24} height={24} />
            {images.length > 0 ? __('Generate again', 'tutor') : __('Generate now', 'tutor')}
          </MagicButton>
          <div css={magicAIStyles.rightFooterInfo}>
            <div>
              <SVGIcon name="seeds" width={20} height={20} />
              {__('Use 1 of 50 icons', 'tutor')}
            </div>
            <a href="/">{__('Upgrade for more', 'tutor')}</a>
          </div>
        </div>
      </div>
    </form>
  );
};

const styles = {
  images: css`
		display: grid;
		grid-template-columns: repeat(2, minmax(300px, 1fr));
    grid-template-rows: repeat(2, minmax(300px, 1fr));
		gap: ${spacing[12]};
    align-self: start;
    margin-block: ${spacing[24]};
	`,
  fields: css`
		display: flex;
		flex-direction: column;
		gap: ${spacing[12]};
	`,
  promptWrapper: css`
		position: relative;
    textarea {
      padding-bottom: ${spacing[40]} !important;
    }
	`,
  inspireButton: css`
		${styleUtils.resetButton};	
		${typography.small()};
		position: absolute;
		height: 28px;
		bottom: ${spacing[12]};
		left: ${spacing[12]};
		border: 1px solid ${colorTokens.stroke.brand};
		border-radius: ${borderRadius[4]};
		display: flex;
		align-items: center;
		gap: ${spacing[4]};
		color: ${colorTokens.text.brand};
		padding-inline: ${spacing[12]};
		background-color: ${colorTokens.background.white};

		&:hover {
			background-color: ${colorTokens.background.brand};
			color: ${colorTokens.text.white};
		}
	`,
};
