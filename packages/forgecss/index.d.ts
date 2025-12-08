export type ForgeCSSOptions = {
  source: string;
  inventoryFiles?: string[];
  usageFiles?: string[];
  usageAttributes?: string[];
  mapping: {
    queries: {
      [key: string]: {
        query: string;
      };
    };
  };
  output?: string;
};

export type ForgeInstance = {
  parse: (filePathToSpecificFile?: string) => Promise<void>;
};

export default function forgecss(options?: ForgeCSSOptions): ForgeInstance;