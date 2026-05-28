export function calculateSingleLineFontSize(params: {
  element: HTMLElement;
  maxFontSize: number;
  minFontSize: number;
  maxWidth: number;
}) {
  const { element, maxFontSize, minFontSize, maxWidth } = params;
  let nextSize = maxFontSize;
  const measurer = document.createElement("span");
  const computedStyle = window.getComputedStyle(element);

  measurer.textContent = element.textContent;
  measurer.style.position = "fixed";
  measurer.style.left = "-9999px";
  measurer.style.top = "-9999px";
  measurer.style.visibility = "hidden";
  measurer.style.whiteSpace = "nowrap";
  measurer.style.fontFamily = computedStyle.fontFamily;
  measurer.style.fontWeight = computedStyle.fontWeight;
  measurer.style.letterSpacing = computedStyle.letterSpacing;
  document.body.appendChild(measurer);

  while (nextSize > minFontSize) {
    measurer.style.fontSize = `${nextSize}px`;

    if (measurer.getBoundingClientRect().width <= maxWidth) {
      break;
    }

    nextSize -= 1;
  }

  measurer.remove();

  return nextSize;
}
