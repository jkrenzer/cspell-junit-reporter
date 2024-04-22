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
        this.file = file;
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