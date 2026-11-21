import test from 'node:test';
import assert from 'node:assert/strict';
import { tidy, names } from '../src/lib/nbsp.js';
test('mobile typography keeps short names intact without creating unbreakable sentences',()=>{
 assert.equal(names('Pioneer Mill'),'Pioneer\u00a0Mill');
 assert.ok(names('Bowling Green State University').includes(' '));
 assert.match(tidy('Bowling Green businesses serve families.'),/Green businesses/);
 assert.ok(tidy('Rutherford B. Hayes Presidential Library welcomes visitors.').split(' ').every(s=>s.length<=22));
});
