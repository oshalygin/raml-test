import Mocha, { Test } from 'mocha';
import { expect } from 'chai';

const mochaInstance = new Mocha();
const suiteInstance = Mocha.Suite.create(mochaInstance.suite, 'Test Suite');

suiteInstance.addTest(new Test('sanity check'), () => {
  const expected = 7;
  const actual = 2 + 5;

  expect(actual).equals(expected);
});
