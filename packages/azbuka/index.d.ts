export type AzbukaOptions = {
  inventoryFiles?: string[];
  usageFiles?: string[];
  usageAttributes?: string[];
  breakpoints?: {
    media?: {
      [key: string]: string;
    };
    container?: {
      [key: string]: string;
    };
  };
  macros?: {
    [key: string]: Function;
  };
  verbose?: boolean;
  minify?: boolean;
  bundleAll?: boolean;
};

export type AzbukaInstance = {
  parseDirectory: (options: { dir: string; output?: string; watch?: boolean }) => Promise<string>;
  parseFile: (options: { file: string; output?: string; watch?: boolean }) => Promise<string>;
  parse: (options: { css: string; html?: string; jsx?: string; output?: string; }) => Promise<string>;
};

declare function Azbuka(options?: AzbukaOptions): AzbukaInstance;

export default Azbuka;