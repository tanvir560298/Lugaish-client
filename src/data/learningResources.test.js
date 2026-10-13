import test from 'node:test';import assert from 'node:assert/strict';import {LEARNING_RESOURCES} from './learningResources.js';
for(const language of ['english','arabic','paid_batch'])test(`${language} has no legacy resource fallback after reset`,()=>assert.deepEqual(LEARNING_RESOURCES[language],[]));
