import Azbuka from '../../../index.js';
import { getPath, expect } from '../../helpers.js';

const __dirname = '/cases/03-media-query';

export default async function test() {
  const azbuka = Azbuka({
    minify: false,
    breakpoints: {
      desktop: "all and (min-width: 1024px)",
      mobile: "all and (max-width: 1023px)",
      portrait: "all and (orientation: portrait)"
    },
    macros: {
      title:() => {
        return 'mt1 inline desktop:mt2';
      }
    },
    bundleAll: true,
    verbose: false
  });
  const result = await azbuka.parseDirectory({ dir: getPath(__dirname + "/src") });
  return expect.toEqualFile(result, __dirname + "/expected.css");
}