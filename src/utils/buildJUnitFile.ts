import { Builder } from "xml2js";

import {
    ErrorLike,
    Issue,
    IssueType,
    MessageType,
    ProgressFileComplete,
    ProgressItem,
    RunResult,
} from '@cspell/cspell-types';

import { JUnitTestCase, uriToPath } from "./JUnitTestCase.js";
import { JUnitTestSuite } from "./JUnitTestSuite.js";
import { JUnitObj } from "./JUnitObj.js";

type Dictionary<Key extends keyof any, Value> = {
    [key in Key]: Value; // Mapped types syntax
};

function getIssueType(issue: Issue) {
    if (issue.issueType != undefined && issue.issueType == IssueType.spelling)
        return "spelling";
    else
        return "directive";
}

function getErrorText(issue: Issue) {
    let text = issue.text || "";
    if (issue.suggestions != undefined)
        return text + "\n\nSuggestions:\n" + issue.suggestions;
    else
        return text;
}

export function makeJUnitObj(issues: Array<Issue>, progress: Array<ProgressItem>) {
    let testsuits: Dictionary<string, JUnitTestSuite> = {};
    progress.forEach(
        function (item, idx) {
            if (item.type == "ProgressFileComplete") {
                let file = uriToPath(item.filename)
                let testcases = [];
                if ((item.numErrors || 0) == 0)
                    testcases.push(
                        new JUnitTestCase(
                            "SpellingCheck",
                            file,
                            file,
                            0
                        )
                    )
                testsuits[file] = new JUnitTestSuite("Spellcheck", testcases, file, item.elapsedTimeMs || 0 / 1000);
            }
        }
    )
    issues.forEach(
        function (issue, idx) {
            let file = uriToPath(issue.uri)
            testsuits[file].testcases.push(
                new JUnitTestCase(
                    "SpellingCheck" + idx,
                    file,
                    file,
                    issue.line.offset,
                    issue.message || "Spelling error detected",
                    getIssueType(issue),
                    getErrorText(issue)
                )
            );
        }
    )


    return new JUnitObj(Object.values(testsuits));
}

export function toXML(obj: JUnitObj | JUnitTestCase | JUnitTestSuite) {
    let builder = new Builder({
        cdata: true
    });
    return builder.buildObject(obj.toXMLObj());
}

export function makeJUnitXML(issues: Array<Issue>, progress: Array<ProgressItem>) {
    return toXML(makeJUnitObj(issues, progress));
}