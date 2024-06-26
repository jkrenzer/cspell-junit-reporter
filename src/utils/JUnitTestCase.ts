import path from "path";
import process from "process";

function uriToPath(uri: string = "", relative: boolean = true): string {
    let abs_path = uri.replace(/^file:\/\//, "");
    if (relative)
        return path.relative(process.cwd(), abs_path);
    else
        return path.normalize(abs_path);
}

export class JUnitTestCase {
    name: string;
    classname: string;
    file: string;
    line: number;
    error_message: string;
    error_type: string;
    error_context: string;

    constructor(name: string, classname: string, file: string, line: number, error_message: string = "", error_type: string = "", error_context: string = "") {
        this.name = name;
        this.classname = classname;
        this.file = uriToPath(file);
        this.line = line;
        this.error_message = error_message;
        this.error_type = error_type;
        this.error_context = error_context;
    }

    public toXMLObj() {
        let testcase_attr = {
            name: this.name,
            classname: this.classname,
            file: this.file,
            line: this.line,
            assertions: 1,
            time: 0.0
        }
        if (this.error_type) {
            return {
                testcase: {
                    $: testcase_attr,
                    failure: {
                        $: {
                            message: this.error_message,
                            type: this.error_type
                        },
                        _: this.error_context || ""

                    }
                }
            };
        }
        else {
            return {
                testcase: {
                    $: testcase_attr
                }
            };
        }
    }

};