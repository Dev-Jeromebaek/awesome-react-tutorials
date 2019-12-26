/** @jsx jsx */
import { Fragment } from 'react';
import { css, jsx } from '@emotion/core';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import Button from '../Button/Button';

export type DialogProps = {
  visible: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  hideButtons?: boolean;
  cancellable?: boolean;
  cancelText: string;
  confirmText: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};


const Dialog = ({
  visible,
  title,
  description,
  hideButtons,
  cancellable,
  cancelText,
  confirmText,
  children,
  onCancel,
  onConfirm
}: DialogProps) => {
  if (!visible) return null;
  
  return (
    <Fragment>
      <div css={[fullscreen, darkLayer]}></div>
      <div css={[fullscreen, whiteBoxWrapper]}>
        <div css={whiteBox}>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
          {children}
          {!hideButtons && (
            <ButtonGroup css={{ marginTop: "3rem" }} rightAlign>
              {cancellable && (
                <Button theme="tertiary" onClick={onCancel}>
                  {cancelText}
                </Button>
              )}
              <Button onClick={onConfirm}>{confirmText}</Button>
            </ButtonGroup>
          )}
        </div>
      </div>
    </Fragment>
  );
};

Dialog.defaultProps = {
  cancelText: '취소',
  confirmText: '확인'
};

const fullscreen = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const darkLayer = css`
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
`;

const whiteBoxWrapper = css`
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const whiteBox = css`
  box-sizing: border-box;
  border-radius: 4px;
  width: 25rem;
  background: white;
  box-shadow: 0px 4px 8px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;

  h3 {
    font-size: 1.5rem;
    color: #343a40;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    margin: 0;
    color: #868e96;
  }
`;

export default Dialog;
