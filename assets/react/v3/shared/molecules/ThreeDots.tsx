import Button from '@Atoms/Button';
import SVGIcon from '@Atoms/SVGIcon';
import { borderRadius, colorPalate, colorTokens, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import { css } from '@emotion/react';
import { AnimationType } from '@Hooks/useAnimation';
import { styleUtils } from '@Utils/style-utils';
import React, { MouseEvent, ReactNode, useRef } from 'react';

import Popover from './Popover';
import Show from '@Controls/Show';
import { rgba } from 'polished';

interface ThreeDotsOptionProps {
  text: string | ReactNode;
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onClosePopover?: () => void;
  isTrash?: boolean;
}

export const ThreeDotsOption = ({ text, icon, onClick, onClosePopover, isTrash = false }: ThreeDotsOptionProps) => {
  return (
    <button
      type="button"
      css={styles.option(isTrash)}
      onClick={event => {
        if (onClick) {
          onClick(event);
        }
        if (onClosePopover) {
          onClosePopover();
        }
      }}
    >
      {icon && icon}
      <span>{text}</span>
    </button>
  );
};

export type ArrowPosition = 'top' | 'bottom' | 'left' | 'right';
export type DotsOrientation = 'vertical' | 'horizontal';
interface ThreeDotsProps {
  isOpen: boolean;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  closePopover: () => void;
  children: ReactNode;
  arrowPosition?: ArrowPosition;
  animationType?: AnimationType;
  dotsOrientation?: DotsOrientation;
  maxWidth?: string;
}

const ThreeDots = ({
  onClick,
  isOpen,
  disabled = false,
  closePopover,
  arrowPosition = 'top',
  children,
  animationType = AnimationType.slideLeft,
  dotsOrientation = 'horizontal',
  maxWidth = '148px',
}: ThreeDotsProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button type="button" ref={ref} onClick={onClick} css={styles.button({ isOpen })} disabled={disabled}>
        <SVGIcon name={dotsOrientation === 'horizontal' ? 'threeDots' : 'threeDotsVertical'} width={32} height={32} />
      </button>
      <Popover
        gap={13}
        maxWidth={maxWidth}
        arrow={arrowPosition}
        triggerRef={ref}
        isOpen={isOpen}
        closePopover={closePopover}
        animationType={animationType}
      >
        <div css={styles.wrapper}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              const props = {
                onClosePopover: closePopover,
              };

              return React.cloneElement(child, props);
            }

            return child;
          })}
        </div>
      </Popover>
    </>
  );
};

ThreeDots.Option = ThreeDotsOption;
export default ThreeDots;

const styles = {
  wrapper: css`
    padding-block: ${spacing[8]};
    position: relative;
  `,
  option: (isTrash: boolean) => css`
    ${styleUtils.resetButton};
    ${typography.body()};

    width: 100%;
    padding: ${spacing[10]} ${spacing[20]};
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${spacing[8]};

    svg {
      flex-shrink: 0;
      color: ${colorTokens.icon.default};
    }

    :hover {
      background-color: ${colorTokens.background.hover};
      color: ${colorTokens.text.title};

      svg {
        color: ${colorTokens.icon.hover};
      }
    }

    ${isTrash &&
    css`
      color: ${colorTokens.text.error};

      &:hover {
        background-color: ${rgba(colorTokens.bg.error, 0.1)};
      }

      &:active {
        background-color: ${colorPalate.surface.critical.neutralPressed};
      }
    `}
  `,
  button: ({ isOpen = false }) => css`
    ${styleUtils.resetButton};
    width: 32px;
    height: 32px;
    border-radius: ${borderRadius.circle};
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease-in-out;

    svg {
      color: ${colorTokens.icon.default};
    }

    :hover {
      background-color: ${colorTokens.background.hover};

      svg {
        color: ${colorTokens.icon.default};
      }
    }

    ${isOpen &&
    css`
      background-color: ${colorTokens.background.hover};
      svg {
        color: ${colorTokens.icon.brand};
      }
    `}
  `,
};
