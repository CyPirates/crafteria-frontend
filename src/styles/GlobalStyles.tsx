import { createGlobalStyle } from "styled-components";


export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #39393C; /* 기본 배경색 설정 */
    color: #FFFFFF; /* 텍스트 색상을 흰색으로 설정 */
    //font-family: 'Arial', sans-serif; /* 기본 폰트 설정 */
    font-family: 'Noto Sans KR', sans-serif;
  }

  *, *::before, *::after {
    box-sizing: border-box; /* 박스 모델 설정 */
  }
  /* @font-face {
  font-family: 'Noto Sans KR';
  font-weight: 300;
  src: url('./fonts/NotoSansKR-Light.otf') format('woff2'),
    url('./fonts/NotoSansKR-Light.otf') format('woff'),
    url('./fonts/NotoSansKR-Light.otf') format('truetype');
}

@font-face {
  font-family: 'Noto Sans KR';
  font-weight: 400;
  src: url('./fonts/NotoSansKR-Regular.otf') format('woff2'),
    url('./fonts/NotoSansKR-Regular.otf') format('woff'),
    url('./fonts/NotoSansKR-Regular.otf') format('truetype');
}
@font-face {
  font-family: 'Noto Sans KR';
  font-weight: 500;
  src: url('./fonts/NotoSansKR-Medium.otf') format('woff2');
}

@font-face {
  font-family: 'Noto Sans KR';
  font-weight: 700;
  src: url('./fonts/NotoSansKR-Bold.otf') format('woff2'),
    url('./fonts/NotoSansKR-Bold.otf') format('woff'),
    url('./fonts/NotoSansKR-Bold.otf') format('truetype');
} */

* {
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}
`;