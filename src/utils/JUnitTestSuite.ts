import { JUnitTestCase } from "./JUnitTestCase.js";

export class JUnitTestSuite {
    name: string;
    classname: string;
    testcases: Array<JUnitTestCase>;


    constructor(name: string, classname: string, testcases: Array<JUnitTestCase>) {
        this.name = name;
        this.classname = classname;
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
                return testcase.toXMLObj();
            });
        return {
            testsuite: {
                $: {
                    name: this.name,
                    classname: this.classname,
                    tests: failures + successes,
                    failures: failures

                },
                testcases: testcases

            }
        };
    }

};