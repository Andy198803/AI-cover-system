import { fontFaces } from "../config/coverConfig";

export function TemplateFonts() {
  const css = fontFaces
    .map((font) => {
      const format = font.src.endsWith(".otf") ? "opentype" : "truetype";

      return `
@font-face {
  font-family: '${font.family}';
  src: url('${font.src}') format('${format}');
  font-display: swap;
}`;
    })
    .join("\n");

  return <style>{css}</style>;
}
