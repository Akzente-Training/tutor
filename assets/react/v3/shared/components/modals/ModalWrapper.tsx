import React, { useEffect } from 'react';
import SVGIcon from '@Atoms/SVGIcon';
import { borderRadius, Breakpoint, colorTokens, shadow, spacing } from '@Config/styles';
import { typography } from '@Config/typography';
import { css } from '@emotion/react';
import { styleUtils } from '@Utils/style-utils';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

const ModalWrapper = ({ children, onClose, title }: ModalWrapperProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'initial';
    };
  }, []);

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        {title && <h5 css={typography.heading5('medium')}>{title}</h5>}
        <button type="button" css={styles.closeButton} onClick={onClose}>
          <SVGIcon name="times" width={14} height={14} />
        </button>
      </div>
      <div css={styles.content}>{children}</div>
    </div>
  );
};

export default ModalWrapper;

const styles = {
  container: css`
    background: ${colorTokens.background.white};
    margin: ${spacing[24]};
    max-width: 1236px;
    box-shadow: ${shadow.modal};
    border-radius: ${borderRadius[10]};
    overflow: hidden;

    ${Breakpoint.smallTablet} {
      width: 90%;
    }
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing[20]};
    width: 100%;
    background: ${colorTokens.background.white};
    border-bottom: 1px solid ${colorTokens.stroke.divider};
  `,
  closeButton: css`
    ${styleUtils.resetButton};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: ${borderRadius.circle};
    background: ${colorTokens.background.white};

    svg {
      color: ${colorTokens.icon.default};
      transition: color 0.3s ease-in-out;
    }

    :hover {
      svg {
        color: ${colorTokens.icon.hover};
      }
    }

    :focus {
      box-shadow: ${shadow.focus};
    }
  `,
  content: css`
    overflow: hidden;
    overflow-y: auto;
    max-height: 90vh;
  `,
};