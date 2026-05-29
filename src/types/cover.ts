export type CoverData = {
  title: string;
  description: string;
};

export type CoverRow = CoverData & {
  id: string;
};

export type TextStyleConfig = {
  fontFamily: string;
  fontSize: number;
  minFontSize?: number;
  fontWeight?: number | string;
  color: string;
  lineHeight?: number | string;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right";
  textShadow?: string;
  transform?: string;
  marginTop?: number;
};

export type TextGroupConfig = {
  position: {
    left: string;
    top: string;
  };
  rotation: string;
  width: string;
  title: TextStyleConfig;
  description: TextStyleConfig;
  inkLine: {
    extraWidth: number;
    height: number;
    color: string;
    opacity: number;
    borderRadius: string;
    rotation: string;
    blur: string;
  };
};

export type TemplateFontsConfig = {
  title: string;
  description: string;
};

export type CoverTemplateConfig = {
  id: string;
  name: string;
  canvas: {
    width: number;
    previewWidth: number;
    backgroundColor: string;
  };
  background: {
    src: string;
    borderRadius: number;
  };
  fonts: TemplateFontsConfig;
  textGroup: TextGroupConfig;
};
