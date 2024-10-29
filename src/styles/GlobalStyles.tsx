// GlobalStyles.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.bgColor};
    color: ${({ theme }) => theme.textColor};
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
