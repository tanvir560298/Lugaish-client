import test from 'node:test';
import assert from 'node:assert/strict';
import {thirdPersonFov} from '../src/classroom/world.js';
test('wall-compressed third-person framing widens smoothly within bounded desktop and portrait limits',()=>{
 assert.equal(thirdPersonFov(5.2),62);assert.equal(thirdPersonFov(1),86);
 assert.equal(thirdPersonFov(5.2,true),82);assert.equal(thirdPersonFov(.1,true),90);
 assert.ok(thirdPersonFov(2)>thirdPersonFov(3));
 assert.ok(Math.abs(thirdPersonFov(2)-thirdPersonFov(2.001))<.01);
});
