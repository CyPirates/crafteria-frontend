import { createGlobalStyle } from "styled-components";
import PoppinsRegular from "../fonts/Poppins-Regular.ttf";
import PoppinsMedium from "../fonts/Poppins-Medium.ttf";
import PoppinsBold from "../fonts/Poppins-Bold.ttf";

export const GlobalStyle = createGlobalStyle`
  /* Regular */
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsRegular}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  /* Medium */
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsMedium}) format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  /* Bold */
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsBold}) format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.bgColor};
    color: ${({ theme }) => theme.textColor};
    font-family: 'Poppins', sans-serif;
  }
`;
