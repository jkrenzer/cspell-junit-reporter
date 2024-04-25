import { JUnitTestCase } from "./JUnitTestCase.js";
import { TESTING } from "../test.js";

let fakeTimeStamp = "1970-01-01T00:00:00.000Z";

function getTimestamp(): string {
    if (TESTING)
        return fakeTimeStamp;
    else
        return (new Date()).toISOString();
}

export class JUnitTestSuite {
    name: string;
    testcases: Array<JUnitTestCase>;
    timestamp: string;
    file: string;
    time: number;

    constructor(name: string, testcases: Array<JUnitTestCase>, file: string = "./", time: number = 0.0, timestamp: string = getTimestamp()) {
        this.name = name;
        this.testcases = testcases;
        this.timestamp = timestamp;
        this.file = file;
        this.time = time;
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
                    time: this.time,
                    file: this.file,
                    timestamp: this.timestamp
                },
                testcase: testcases
            }
        };
    }
};