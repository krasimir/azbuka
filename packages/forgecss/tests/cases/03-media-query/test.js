import ForgeCSS from '../../../index.js';
import { getPath, expect } from '../../helpers.js';

const __dirname = '/cases/03-media-query';

export default async function test() {
  const forgecss = ForgeCSS({
    source: getPath(__dirname + "/src"),
    mapping: {
      queries: {
        desktop: "(min-width: 1024px)",
        mobile: "(max-width: 1023px)",
        portrait: "(orientation: portrait)"
      }
    }
  });
  const result = await forgecss.parse();
  return expect.toEqualFile(result, __dirname + "/expected.css");
}