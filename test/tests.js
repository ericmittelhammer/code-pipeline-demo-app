const assert = require('assert');

const NUM_TESTS = 50

const FAIL_SWITCH = (process.env['FAIL_SWITCH'] !== undefined) ? parseFloat(process.env['FAIL_SWITCH']) : 0.0;
const FAIL_THRESHOLD = (process.env['FAIL_THRESHOLD'] !== undefined) ? parseFloat(process.env['FAIL_THRESHOLD']) : 0.0;

const FAIL_MODE = Math.random() < FAIL_SWITCH;

describe(`generating ${NUM_TESTS} tests`, () => {
    console.log('FAIL_SWITCH', FAIL_SWITCH);
    console.log('FAIL_THRESHOLD', FAIL_THRESHOLD);
    console.log('FAIL_MODE', FAIL_MODE);
    for (let i = 0; i < NUM_TESTS; i++) {
        it(`Test #${i}`, () => {
            if(FAIL_MODE) {
                assert(Math.random() > FAIL_THRESHOLD);
            } else {
                assert(true);
            }
        });
    }
});