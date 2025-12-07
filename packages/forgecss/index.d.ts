export type ForgeCSSOptions = {
  source: string;
  stylesMatch?: string[];
  declarationsMatch?: string[];
  declarationsMatchAttributes?: string[];
  mapping: {
    queries: {
      [key: string]: {
        query: string;
      };
    };
  };
  output: string;
};

export default function forgecss(options?: ForgeCSSOptions): {
  parse: (filePathToSpecificFile?: string) => Promise<void>;
};