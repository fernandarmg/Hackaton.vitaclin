import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.g50};
    color: ${({ theme }) => theme.colors.g900};
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  button { cursor: pointer; font-family: inherit; }
  input, select, textarea { font-family: inherit; }
  a { text-decoration: none; color: inherit; }
`
