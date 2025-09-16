import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Reset styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f8fafc;
    color: #1a202c;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
  }

  /* Remove default button styles */
  button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  /* Remove default input styles */
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  /* Remove default link styles */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Remove default list styles */
  ul,
  ol {
    list-style: none;
  }

  /* Remove default table styles */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* Remove default image styles */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: #3b82f6;
    color: white;
  }
`;
