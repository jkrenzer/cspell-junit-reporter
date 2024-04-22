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

import { JUnitTestCase } from "./JUnitTestCase.js";
import { JUnitTestSuite } from "./JUnitTestSuite.js";
import { JUnitObj } from "./JUnitObj.js";

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

export function makeJUnitObj(issues: Array<Issue>) {
    let testcases: Array<JUnitTestCase> = [];
    if (Array.isArray(issues) && issues.length > 0) {
        issues.forEach(
            function (issue, idx) {
                testcases.push(
                    new JUnitTestCase(
                        "SpellingError" + idx,
                        "Spellcheck",
                        issue.uri || "Unknown",
                        issue.line.offset,
                        issue.message || "Spelling error detected",
                        getIssueType(issue),
                        getErrorText(issue)
                    )
                )
            }
        )
    }
    else {
        testcases.push(
            new JUnitTestCase(
                "Spelling",
                "Spellcheck",
                "Unknown",
                0
            )
        )
    }
    let testsuit: JUnitTestSuite = new JUnitTestSuite("CSpellChecks",
        "Spellchecks", testcases);
    return new JUnitObj([testsuit]);
}

export function toXML(obj: JUnitObj | JUnitTestCase | JUnitTestSuite) {
    let builder = new Builder({
        cdata: true
    });
    return builder.buildObject(obj.toXMLObj());
}

export function makeJUnitXML(issues: Array<Issue>) {
    return toXML(makeJUnitObj(issues));
}