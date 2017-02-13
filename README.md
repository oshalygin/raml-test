# RAML-Test
[![GitHub issues](https://img.shields.io/github/issues/oshalygin/raml-test.svg "GitHub issues")](https://github.com/oshalygin/raml-test/issues)
[![Build Status](https://travis-ci.org/oshalygin/raml-test.svg?branch=master)](https://travis-ci.org/oshalygin/raml-test)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dd2bc0bd4b614832ba8e12e1cf1781db)](https://www.codacy.com/app/oshalygin/raml-test?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=oshalygin/raml-test&amp;utm_campaign=Badge_Grade)

This utility is used to generate tests based on a RAML 1.0 specification.

## Features


####Installation
---
```bash
    npm install raml-test
    # Note, you will need to be authenticated with Artifactory to pull this package.
    # For more information:  https://sadasystems.atlassian.net/wiki/display/ATM/Artifactory+for+Atom
```
####Usage
---
```bash
    # Generate and run tests against a RAML specification
    raml-test my-awesome-api.raml
```

####Development

Start with:
```bash
  npm install
```

Running tests:
```bash
  npm run test
  # Run test with coverage.  The coverage report by default is configured for lcov and can be located in the `./coverage` directory.
  npm run test:cover
```

Building the application:
The resulting source code is built to a `./dist` directory which is where the transpiled source resides.  By default the test files are not built to this directory, only the underlying source.  

Command:
```bash
  npm run build
```
