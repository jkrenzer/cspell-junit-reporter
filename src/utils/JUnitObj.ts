import { JUnitTestSuite } from './JUnitTestSuite.js';

export class JUnitObj {
    testsuites: Array<JUnitTestSuite>;

    constructor(testsuites: Array<JUnitTestSuite>) {
        this.testsuites = testsuites;
    }

    public toXMLObj() {
        let tests = 0;
        let failures = 0;
        let testsuites = this.testsuites.map(
            function (testsuit) {
                let obj = testsuit.toXMLObj().testsuite; // Cut the top key to merge in root's key
                tests += obj.$.tests || 0;
                failures += obj.$.failures || 0;
                return obj;
            }
        );
        return {
            testsuites: {
                $: {
                    failures: failures,
                    tests: tests
                },
                testsuite: testsuites
            }
        }
    }
}