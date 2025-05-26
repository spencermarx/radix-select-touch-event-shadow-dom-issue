import stylesImport from "../index.css?inline";

// Import the styles from the production build
const styles = stylesImport;

export const getShadowDomCss = () => `
${styles}

/* Add Resets */
/**
 * Reset styles for the Shadow DOM
 */

@layer base {
  /* Ensure base font-size is isolated and consistent */
  :host {
    all: unset; /* Reset all inherited properties */
    font-size: 16px; /* Set the base font-size for REM */
    line-height: 1.5; /* Define a consistent line-height */
    font-family: 'Inter', sans-serif; /* Use your desired font */
    display: block; /* Ensure block-level behavior */
    box-sizing: border-box; /* Consistent box model */
  }

  /* Additional reset for html and body within Shadow DOM */
  html,
  body {
    font-size: inherit; /* Use the defined base font-size */
    margin: 0;
    line-height: inherit;
    font-family: inherit;
    color: inherit;
    background-color: transparent; /* Avoid conflicting backgrounds */
  }

  [type='text'],
  input:where(:not([type])),
  [type='email'],
  [type='url'],
  [type='password'],
  [type='number'],
  [type='date'],
  [type='datetime-local'],
  [type='month'],
  [type='search'],
  [type='tel'],
  [type='time'],
  [type='week'],
  [multiple],
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
}
`;
