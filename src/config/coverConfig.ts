import type { CoverTemplateConfig } from "../types/cover";

export const fontFaces = [
  {
    family: "TitleFont",
    src: "/fonts/思源宋体-Heavy-4.otf",
    fallback: "serif",
  },
  {
    family: "DescFont",
    src: "/fonts/思源黑体-Bold-6.otf",
    fallback: "sans-serif",
  },
] as const;

export const coverTemplates: Record<string, CoverTemplateConfig> = {
  default: {
    id: "default",
    name: "默认封面模板",
    canvas: {
      width: 540,
      previewWidth: 540,
      backgroundColor: "#111",
    },
    background: {
      src: "/templates/background.png",
      borderRadius: 12,
    },
    fonts: {
      title: "TitleFont, serif",
      description: "DescFont, sans-serif",
    },
    textGroup: {
      position: {
        left: "58%",
        top: "300px",
      },
      rotation: "-6deg",
      width: "380px",
      title: {
        fontFamily: "TitleFont, serif",
        fontSize: 88,
        minFontSize: 24,
        fontWeight: 700,
        color: "#7b0d0d",
        letterSpacing: 2,
        textShadow: "0 4px 10px rgba(0,0,0,.35), 0 0 8px rgba(111,9,9,.25)",
        transform: "scaleX(0.96)",
        lineHeight: 1,
        textAlign: "center",
      },
      description: {
        fontFamily: "DescFont, sans-serif",
        fontSize: 38,
        minFontSize: 26,
        fontWeight: 700,
        color: "#f5e6c8",
        textShadow: "1px 1px 3px rgba(0,0,0,.6), 0 0 8px rgba(255,220,180,.15)",
        lineHeight: 1,
        textAlign: "center",
        marginTop: 14,
      },
      inkLine: {
        extraWidth: 48,
        height: 6,
        color: "rgba(120,0,0,.55)",
        opacity: 0.9,
        borderRadius: "999px",
        rotation: "-1deg",
        blur: "1px",
      },
    },
  },
};

export const activeCoverTemplate = coverTemplates.default;
