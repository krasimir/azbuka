import az from '../../../lib/az.js';
import { expect } from '../../helpers.js';

const transformations = [
  ["", ""],
  ["a b", "a b"],
  ["a d:x y", "a d_x y"],
  ["a d:x,z m:y", "a d_x d_z m_y"],
  ["hover:red a", "hover_red a"],
  ["[&:hover]:a b", "I-hover_a b"],
  ["[&:required:disabled]:red", "I-required-disabled_red"],
  ["[true]:my1 red", "my1 red"],
  ["[false]:my1 red", "red"],
  ["[.dark &]:black mt2", "dark-I_black mt2"],
  ["mt1 [.dark &[type='password']]:mt2", "mt1 dark-Itype-password_mt2"],
  ["desktop:[.dark &]:b", "desktop-dark-I_b"],
  ["m1 theme(text(big) layout(flex center))", "m1 theme-text-big-layout-flex-center"],
  ["title()", "title"]
];

export default async function test() {
  for(let [input, expected] of transformations) {
    if (!expect.toBe(az(input), expected)) {
      return false;
    }
  }
  return true;
}