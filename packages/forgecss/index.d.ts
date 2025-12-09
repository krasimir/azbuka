export type ForgeCSSOptions = {
  source: string;
  inventoryFiles?: string[];
  usageFiles?: string[];
  usageAttributes?: string[];
  mapping?: {
    queries?: {
      [key: string]: string
    };
  };
  output?: string;
};

export type ForgeInstance = {
  parse: (filePathToSpecificFile?: string) => Promise<void>;
};

declare function ForgeCSS(options?: ForgeCSSOptions): ForgeInstance;

export default ForgeCSS;