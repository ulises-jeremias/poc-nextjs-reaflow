import { css } from '@emotion/react';
import React from 'react';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

type Props = {} & TextareaAutosizeProps;

/**
 * Textarea with autoresize and sane default props.
 *
 * Wrapper around the TextareaAutosize component.
 */
export const Textarea: React.FunctionComponent<Props> = (props) => {
  const {
    minRows = 1,
    maxRows = 5,
    ...rest
  } = props;

  return (
    <TextareaAutosize
      minRows={minRows}
      maxRows={maxRows}
      {...rest}
      css={css`
        resize: none;
        width: 100%;
        padding-left: 5px;
      `}
    />
  );
};

export default Textarea;
