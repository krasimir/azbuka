export type ForgeCSSOptions = {
  styles: {
    sourceDir: string;
    match?: string[];
  };
  ui: {
    sourceDir: string;
    match?: string[];
    attributes?: string[];
  };
  mapping: {
    queries: {
      [key: string]: {
        query: string;
      };
    };
  };
  output: string
};

export default function forgecss(options?: ForgeCSSOptions): {
  parse: () => Promise<void>;
};