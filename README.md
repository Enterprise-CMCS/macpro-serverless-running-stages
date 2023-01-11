<!--
Render Markdown in VS Code

SHIFT + CMD/CTRL + V
-->

<h1 align="center" style="border-bottom: none;"> macpro-serverless-running-stages</h1>
<h3 align="center">NPM module to identify currently running stages of the [Serverless framework](https://www.serverless.com/) in an AWS account.</h3>
<p align="center">
  <a href="https://github.com/cmsgov/macpro-serverless-running-stages/releases/latest">
    <img alt="latest release" src="https://img.shields.io/github/release/cmsgov/macpro-serverless-running-stages.svg">
  </a>
  <a href="https://www.npmjs.com/package/@enterprise-cmcs/macpro-serverless-running-stages">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/@enterprise-cmcs/macpro-serverless-running-stages/latest.svg">
  </a>
  <a href="https://codeclimate.com/github/CMSgov/macpro-serverless-running-stages/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/7aa40b9f69c550a8cf72/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/CMSgov/macpro-serverless-running-stages/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/7aa40b9f69c550a8cf72/test_coverage" />
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release">
  </a>
  <a href="https://dependabot.com/">
    <img alt="Dependabot" src="https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
</p>

---

## Usage and Getting Started

To install the package run the following command:

```
npm install @enterprise-cmcs/macpro-serverless-running-stages
```

or

```
yarn add @enterprise-cmcs/macpro-serverless-running-stages
```

After installing the package in your project include this import statement

```
import { ServerlessRunningStages } from "@enterprise-cmcs/macpro-serverless-running-stages";
```

With ServerlessRunningStages imported you can now execute it like:

```
await ServerlessRunningStages.getAllStagesForRegion("us-east-1");
```

## Contributing

Found a bug, want to help with updating the docs or maybe you want to help add a feature. Refer to our contribution documentation for more information: [Documentation](./docs/CONTRIBUTING.MD)

## Instructions to test locally with a yarn project

- in your terminal from your local clone of macpro-serverless-running-stages with your development branch
- `yarn link` (note, when testing is complete, run `yarn unlink`)
  that will return output like:

```
yarn link v1.22.19
warning ../../../package.json: No license field
success Registered "@enterprise-cmcs/macpro-serverless-running-stages".
info You can now run `yarn link "@enterprise-cmcs/macpro-serverless-running-stages"` in the projects where you want to use this package and it will be used instead.
✨  Done in 0.06s.
```

- npm install
- npm run build (this builds the package)

In your local yarn project that will be using the macpro-serverless-running stages package, run:

- `rm -rf node_modules`
- `yarn link "@enterprise-cmcs/macpro-serverless-running-stages"`
  that will return output like:

```
yarn link v1.22.19
warning ../../../package.json: No license field
success Using linked package for "@enterprise-cmcs/macpro-serverless-running-stages".
✨  Done in 0.05s.
```

- `yarn install`
- Note: when testing is complete run `yarn unlink "@enterprise-cmcs/macpro-serverless-running-stages"`

## License

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE) for full details.
