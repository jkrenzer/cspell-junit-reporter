# cspell-junit-reporter

JUnit.xml reporter for [cspell](https://github.com/streetsidesoftware/cspell).

## Installation

You can install the reporter with npm from the [default registry](https://www.npmjs.com/package/cspell-junit-reporter):

```shell
npm i cspell-junit-reporter
```

## Usage

The reporter understands the same option as the official cspell-json-reporter. Usage example:

```shell
cspell-cli lint --reporter cspell-junit-reporter /**/*.md
```

Will spell-check all markdown files and output JUnit compatible XML to stdout.