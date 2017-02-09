# RAML-Test

[![Build Status](https://travis-ci.com/sadasystems/kube-config-utility.svg?token=dsDcJ24J6wpmry92sFaJ&branch=master)](https://travis-ci.com/sadasystems/kube-config-utility)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5ce650ebcb7649e3b55936d68ba054e0)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sadasystems/kube-config-utility&amp;utm_campaign=Badge_Grade)

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
