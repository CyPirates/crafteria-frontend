import { createGlobalStyle } from "styled-components";


export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #39393C; /* 기본 배경색 설정 */
    color: #FFFFFF; /* 텍스트 색상을 흰색으로 설정 */
    font-family: 'Arial', sans-serif; /* 기본 폰트 설정 */
  }

  *, *::before, *::after {
    box-sizing: border-box; /* 박스 모델 설정 */
  }
`;