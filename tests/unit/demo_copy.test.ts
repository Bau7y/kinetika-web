import { describe, expect, it } from 'vitest';
import { accountingCopy } from '../../src/data/demos/accounting';
import { compareCopy } from '../../src/data/demos/compare';
import { ordersCopy } from '../../src/data/demos/orders';
import { tramiCopy } from '../../src/data/demos/trami';
import { websiteCopy } from '../../src/data/demos/website';

/** Same keys and same list lengths in both languages, at every level. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  }
  return typeof value;
}

describe('textos de las demos', () => {
  const demos = { accountingCopy, compareCopy, ordersCopy, tramiCopy, websiteCopy };
  for (const [name, copy] of Object.entries(demos)) {
    it(`${name}: español e inglés tienen la misma forma`, () => {
      expect(shape(copy.en)).toEqual(shape(copy.es));
    });
  }
});
