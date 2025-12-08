import ForgeCSS from '../../../index.js';
import { getPath, expect } from '../../helpers.js';

export default async function test() {
  const forgecss = ForgeCSS({
    source: getPath("/cases/01/src"),
    mapping: {
      queries: {
        desktop: {
          query: "(min-width: 1024px)"
        }
      }
    }
  });
  const result = await forgecss.parse();
  return expect.toEqualFile(result, "/cases/01/expected.css");
}