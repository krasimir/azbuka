import fx from '../../../client/fx.js';
import { expect } from '../../helpers.js';

const transformations = [
  ["", ""],
  ["a b", "a b"],
  ["a d:x y", "a d:x y"],
  ["a d:x,z m:y", "a d:x d:z m:y"],
  ["hover:red a", "hover:red a"],
  ["[&:hover]:a b", "[&:hover]:a b"],
  ["[&:required:disabled]:red", "[&:required:disabled]:red"],
  ["[true]:my1 red", "my1 red"],
  ["[false]:my1 red", "red"],
  ["[.dark &]:black mt2", "[.dark &]:black mt2"]
];

export default async function test() {
  for(let [input, expected] of transformations) {
    if (!expect.toBe(fx(input), expected)) {
      return false;
    }
  }
  return true;
}