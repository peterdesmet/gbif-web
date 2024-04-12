import { css } from '@emotion/react';
import { root } from '../../../../style/shared';
// import { focusStyle } from '../../style/shared';

export const mapArea = ({ theme }) => css`
  flex: 1 1 100%;
  display: flex;
  height: 100%;
  max-height: 100vh;
  flex-direction: column;
  position: relative;
`;

export const mapComponent = ({ theme }) => css`
  flex: 1 1 100%;
  border: 1px solid ${theme.paperBorderColor};
  border-radius: ${theme.borderRadius}px;
  display: flex;
  flex-direction: column;
  height: 100%;
  canvas:focus {
    outline: none;
  }
`;

export const resultList = ({ }) => css`
  z-index: 10;
  margin: 12px;
  position: absolute;
  left: 0;
  top: 0;
  width: 350px;
  max-width: 100%;
  height: auto;
  max-height: calc(100% - 24px);
  display: flex;
  flex-direction: column;
`;

export const mapControls = css`
  position: absolute;
  right: 0;
  z-index: 1;
  pointer-events: none;
  max-height: 100%;
  display: flex;
  flex-direction: column;
`;

export const mapControlsOptions = css`
  text-align: end;
  > div {
    pointer-events: auto;
    margin: 12px;
    display: inline-flex;
    background: white;
    border: 1px solid #ddd;
    align-items: center;
    text-align: auto;
    .gb-menuContainer {
      /* width: 250px; */
      button {
        text-align: initial;
      }
    } 
  }
`;

export const mapControlsButton = ({ active } = {}) => css`
  padding: 6px;
  flex: 1 1 auto;
  font-size: 24px;
  text-align: start;
  white-space: nowrap;
  background: ${active ? 'var(--primary500)' : ''};
  color: ${active ? 'white' : 'var(--color800)'};
`;

export const mapControlsContent = css`
  text-align: end;
  margin: 12px;
  margin-top: 0;
  display: block;
  > div {
    min-width: 250px;
    text-align: start;
    display: inline-block;
    pointer-events: auto;
    background: white;
    border: 1px solid #ddd;
  }
`;

export const legendList = css`
  margin: 0;
  padding: 8px 0;
  list-style: none;
`;

export const legendText = css`
  display: block;
  height: auto;
`;

export const legendItem = css`
  ${root}
  display: flex;
  flex-direction: row;
  padding: 4px 16px;
  overflow: hidden;
  align-items: center;
  > div {
    margin-inline-start: 8px;
    max-width: 350px;
  }
  input {
    border-radius: 50%;
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    margin-right: 12px;
  }
  input[type="color"] {
    border: 0.5px solid #00000011;
    padding: 0;
    overflow: hidden;
    display: block;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: none;
  }
`;