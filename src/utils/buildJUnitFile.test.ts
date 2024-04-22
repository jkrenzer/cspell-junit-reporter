import { describe, expect, test } from 'vitest';

import { JUnitObj } from "./JUnitObj.js";
import { JUnitTestSuite } from "./JUnitTestSuite.js";
import { JUnitTestCase } from "./JUnitTestCase.js";

import { toXML } from './buildJUnitFile.js';

describe('toXMLObj', () => {
    let testcase1 = new JUnitTestCase('name', 'classname', 'file', 0, 'error_message', 'error_type', 'error_context');
    let testcase2 = new JUnitTestCase('name', 'classname', 'file', 0);
    test.each([
        { Obj: new JUnitObj([]) },
        { Obj: new JUnitTestSuite('name', 'classname', []) },
        { Obj: testcase1 },
        { Obj: testcase2 }
    ])('$Obj minimal -> Obj', ({ Obj }) => {
        let obj = Obj.toXMLObj();
        expect(obj).toMatchSnapshot();
        expect(() => toXML(Obj)).not.toThrow();
        let xmlObj = toXML(Obj);
        expect(xmlObj).toMatchSnapshot();
    });
    let testsuite = new JUnitTestSuite('name', 'classname', [testcase1, testcase2]);
    let testobj = new JUnitObj([testsuite]);
    test.each([
        { Obj: testobj },
        { Obj: testsuite },
        { Obj: testcase1 },
        { Obj: testcase2 }
    ])('$Obj inkremental -> Obj', ({ Obj }) => {
        let obj = Obj.toXMLObj();
        expect(obj).toMatchSnapshot();
        expect(() => toXML(Obj)).not.toThrow();
        let xmlObj = toXML(Obj);
        expect(xmlObj).toMatchSnapshot();
    });
    test.each([
        { Obj: testsuite, root: "testsuite" },
        { Obj: testobj, root: "testsuites" }
    ])('Failure count calculation', ({ Obj, root }) => {
        let obj = Obj.toXMLObj();
        let attr: object = obj[root].$;
        expect(attr.failures).toEqual(1);
        expect(attr.tests).toEqual(2);
    });

});