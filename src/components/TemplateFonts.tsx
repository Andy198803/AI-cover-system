import { fontFaces } from "../config/coverConfig";

export function TemplateFonts() {
  const css = fontFaces
    .map(
      (font) => `
@font-face {
  font-family: '${font.family}';
  src: url('${font.src}') format('truetype');
  font-display: swap;
}`
    )
    .join("\n");

  return <style>{css}</style>;
}
