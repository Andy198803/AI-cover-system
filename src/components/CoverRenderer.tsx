import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { CoverData, CoverTemplateConfig, TextStyleConfig } from "../types/cover";
import { calculateSingleLineFontSize } from "../utils/textScale";

type CoverRendererProps = {
  template: CoverTemplateConfig;
  data: CoverData;
};

type CoverCanvasProps = CoverRendererProps & {
  scale?: number;
};

function getTextStyle(config: TextStyleConfig): CSSProperties {
  return {
    fontFamily: config.fontFamily,
    fontSize: `${config.fontSize}px`,
    fontWeight: config.fontWeight,
    color: config.color,
    lineHeight: config.lineHeight,
    letterSpacing: config.letterSpacing === undefined ? undefined : `${config.letterSpacing}px`,
    textAlign: config.textAlign,
    textShadow: config.textShadow,
    transform: config.transform,
    boxSizing: "border-box",
  };
}

function getTitleBaseFontSize(title: string) {
  const length = title.trim().length;

  if (length <= 3) return 68;
  if (length <= 4) return 74;
  if (length <= 8) return 68;
  if (length <= 12) return 58;
  if (length <= 16) return 50;
  return 42;
}

function getTitleStyleLevel(title: string) {
  const length = title.trim().length;

  if (length <= 4) return "short";
  if (length <= 8) return "medium";
  return "long";
}

function getTitleVisualStyle(title: string): CSSProperties {
  const level = getTitleStyleLevel(title);

  if (level === "short") {
    return {
      letterSpacing: "4px",
      WebkitTextStroke: "1.5px rgba(255,220,180,0.55)",
      textShadow: "0 4px 10px rgba(0,0,0,.35), 0 0 8px rgba(111,9,9,.25)",
    };
  }

  if (level === "medium") {
    return {
      letterSpacing: "1px",
      WebkitTextStroke: "1px rgba(255,220,180,0.45)",
      textShadow: "0 3px 8px rgba(0,0,0,.32)",
    };
  }

  return {
    letterSpacing: "-1px",
    WebkitTextStroke: "0.5px rgba(255,220,180,0.35)",
    textShadow: "0 2px 6px rgba(0,0,0,.28)",
  };
}

function TextGroup({ data, template }: CoverRendererProps) {
  const { textGroup } = template;
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const textGroupWidth = Number.parseFloat(textGroup.width);
  const titleBaseFontSize = getTitleBaseFontSize(data.title);
  const titleVisualStyle = getTitleVisualStyle(data.title);
  const [titleFontSize, setTitleFontSize] = useState(titleBaseFontSize);
  const [descriptionFontSize, setDescriptionFontSize] = useState(textGroup.description.fontSize);
  const [descriptionWidth, setDescriptionWidth] = useState(0);

  useLayoutEffect(() => {
    const element = titleRef.current;

    if (!element) {
      return;
    }

    const updateFontSize = () => {
      const nextSize = calculateSingleLineFontSize({
        element,
        maxFontSize: titleBaseFontSize,
        minFontSize: textGroup.title.minFontSize ?? 24,
        maxWidth: textGroupWidth,
      });
      setTitleFontSize(nextSize);
    };

    updateFontSize();

    if (document.fonts) {
      document.fonts.ready.then(updateFontSize);
    }
  }, [data.title, textGroup.title.minFontSize, textGroupWidth, titleBaseFontSize]);

  useLayoutEffect(() => {
    const element = descriptionRef.current;

    if (!element) {
      return;
    }

    const updateDescriptionMetrics = () => {
      const nextSize = calculateSingleLineFontSize({
        element,
        maxFontSize: textGroup.description.fontSize,
        minFontSize: textGroup.description.minFontSize ?? 26,
        maxWidth: textGroupWidth,
      });
      setDescriptionFontSize(nextSize);

      element.style.fontSize = `${nextSize}px`;
      setDescriptionWidth(Math.min(element.scrollWidth, textGroupWidth));
    };

    updateDescriptionMetrics();

    if (document.fonts) {
      document.fonts.ready.then(updateDescriptionMetrics);
    }
  }, [
    data.description,
    textGroup.description.fontSize,
    textGroup.description.minFontSize,
    textGroupWidth,
  ]);

  const inkLineWidth = Math.min(descriptionWidth + textGroup.inkLine.extraWidth, textGroupWidth);

  return (
    <div
      style={{
        position: "absolute",
        left: textGroup.position.left,
        top: textGroup.position.top,
        width: textGroup.width,
        transform: `translateX(-50%) rotate(${textGroup.rotation})`,
        transformOrigin: "center center",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      <div
        ref={titleRef}
        style={{
          ...getTextStyle(textGroup.title),
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: `${titleFontSize}px`,
          ...titleVisualStyle,
          transform: textGroup.title.transform,
        }}
      >
        {data.title}
      </div>

      <div
        style={{
          marginTop: `${textGroup.description.marginTop ?? 18}px`,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          ref={descriptionRef}
          style={{
            ...getTextStyle(textGroup.description),
            display: "inline-block",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: `${descriptionFontSize}px`,
          }}
        >
          {data.description}
        </div>
        <div
          style={{
            position: "relative",
            width: `${inkLineWidth}px`,
            height: `${textGroup.inkLine.height}px`,
            margin: "2px auto 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "2px",
              width: "100%",
              height: `${textGroup.inkLine.height}px`,
              background: textGroup.inkLine.color,
              opacity: textGroup.inkLine.opacity,
              borderRadius: textGroup.inkLine.borderRadius,
              transform: `rotate(${textGroup.inkLine.rotation})`,
              filter: `blur(${textGroup.inkLine.blur})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "8%",
              top: 0,
              width: "72%",
              height: `${Math.max(3, textGroup.inkLine.height - 5)}px`,
              background: textGroup.inkLine.color,
              opacity: 0.55,
              borderRadius: textGroup.inkLine.borderRadius,
              transform: "rotate(1deg)",
              filter: "blur(0.8px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "6px",
              width: "32%",
              height: "3px",
              background: textGroup.inkLine.color,
              opacity: 0.45,
              borderRadius: textGroup.inkLine.borderRadius,
              transform: "rotate(-3deg)",
              filter: "blur(0.6px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const CoverCanvas = forwardRef<HTMLDivElement, CoverCanvasProps>(function CoverCanvas(
  { template, data, scale = 1 },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: `${template.canvas.previewWidth}px`,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      <img
        src={template.background.src}
        alt="background"
        style={{
          width: "100%",
          borderRadius: `${template.background.borderRadius}px`,
          display: "block",
        }}
      />

      <TextGroup template={template} data={data} />
    </div>
  );
});

export function CoverRenderer({ template, data }: CoverRendererProps) {
  const shellStyle = useMemo<CSSProperties>(
    () => ({
      width: "100vw",
      height: "100vh",
      background: template.canvas.backgroundColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "auto",
    }),
    [template.canvas.backgroundColor]
  );

  return (
    <div style={shellStyle}>
      <CoverCanvas template={template} data={data} />
    </div>
  );
}
