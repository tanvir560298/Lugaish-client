import test from 'node:test';
import assert from 'node:assert/strict';
import { LEARNING_RESOURCES } from './learningResources.js';

for (const language of ['arabic', 'english']) {
  test(`${language} has one valid PDF resource for every PDF day`, () => {
    const resources = LEARNING_RESOURCES[language];
    assert.equal(resources.length, 15);
    assert.deepEqual(resources.map(resource => resource.day), Array.from({ length: 15 }, (_, index) => index * 2 + 1));
    assert.equal(new Set(resources.map(resource => resource.id)).size, resources.length);
    resources.forEach(resource => {
      assert.match(resource.url, /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view/);
      assert.equal(resource.type, 'PDF');
    });
  });
}
