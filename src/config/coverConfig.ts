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
        textShadow: "3px 3px 5px rgba(0,0,0,0.28)",
        transform: "scaleX(0.96)",
        lineHeight: 1,
        textAlign: "center",
      },
      description: {
        fontFamily: "DescFont, sans-serif",
        fontSize: 38,
        minFontSize: 26,
        fontWeight: 700,
        color: "#f3e3bd",
        textShadow: "2px 2px 5px rgba(0,0,0,0.7)",
        lineHeight: 1,
        textAlign: "center",
        marginTop: 14,
      },
      inkLine: {
        extraWidth: 48,
        height: 6,
        color: "rgba(90, 10, 10, 0.85)",
        opacity: 0.9,
        borderRadius: "999px",
        rotation: "-1deg",
        blur: "0.4px",
      },
    },
  },
};

export const activeCoverTemplate = coverTemplates.default;
