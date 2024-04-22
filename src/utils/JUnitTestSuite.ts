import { JUnitTestCase } from "./JUnitTestCase.js";

export class JUnitTestSuite {
    name: string;
    testcases: Array<JUnitTestCase>;


    constructor(name: string, testcases: Array<JUnitTestCase>) {
        this.name = name;
        this.testcases = testcases;
    }

    public toXMLObj() {
        let successes = 0;
        let failures = 0;
        let testcases = this.testcases.map(
            function (testcase) {
                if (testcase.error_type != "")
                    failures++;
                else
                    successes++;
                return testcase.toXMLObj().testcase; // Cut the top key to merge in root's key
            });
        let tests = failures + successes;
        return {
            testsuite: {
                $: {
                    name: this.name,
                    tests: tests,
                    failures: failures,
                    errors: 0,
                    skipped: 0,
                    assertions: tests,
                    time: 0.0,
                    file: "./",
                    timestamp: (new Date()).toISOString()

                },
                testcase: testcases

            }
        };
    }

};