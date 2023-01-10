<!--
Render Markdown in VS Code

SHIFT + CMD/CTRL + V
-->

<h1 align="center" style="border-bottom: none;"> macpro-serverless-running-stages</h1>
<h3 align="center">Common UI/UX Library built on USWDS 3.0 and packaged for easier distribution throughout CMS.</h3>
<p align="center">
  <a href="https://cmsgov.github.io/macpro-serverless-running-stages/">
    <img alt="Storybook" src="https://img.shields.io/badge/Storybook-Docs-pink.svg">
  </a>
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

### See the [Storybook](https://cmsgov.github.io/macpro-serverless-running-stages/) for a preview of the component library.

---

## Overview

This is a React implementation of USWDS 3.0 in conjuction with some MACPRO theming. This library is meant to be consumed for implementing a USWDS compliant web application in React. For more information about USWDS and their design principles refer to the below link.

[USWDS Design Standards](https://designsystem.digital.gov/design-principles/)

## Usage and Getting Started

To install the package run the following command:

```
npm install @enterprise-cmcs/macpro-serverless-running-stages
```

or

```
yarn add @enterprise-cmcs/macpro-serverless-running-stages
```

After installing the package in the root level of your project include this import statement

```
import "@enterprise-cmcs/macpro-serverless-running-stages/build/assets/css/index.css";
```

This will include the css required for the styles to be applied to any components that are used.

With the project now set up you can import any of the components in your code and use them. Refer to the [StoryBook](https://cmsgov.github.io/macpro-serverless-running-stages/) for implementation details on each component.

## Contributing

Found a bug, want to help with updating the docs or maybe you want to help add a feature. Refer to our contribution documentation for more information: [Documentation](./docs/CONTRIBUTING.MD)

## License

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE) for full details.

## Instructions to test locally with a yarn project

- in your terminal from your local clone of macpro-serverless-running-stages with your development branch
- `yarn link`

- that's going to spit out some output like this
  info You can now run `yarn link "@stratiformdigital/serverless-stage-destroyer"` in the projects where you want to use this package and it will be used instead.
- save that yarn link output for later, dont forget the quotes... yarn link "@stratiformdigital/serverless-stage-destroyer"
- run npm install
- run npm run gen (this builds the package)
- go into your cms-bigmac repo
- checkout the thai branch
- run rm -rf node_modules
- run yarn link "@stratiformdigital/serverless-stage-destroyer"
- run yarn install
- at this point, if you go to finder or a terminal, you should see that node_modules/@stratiformdigital/serverless-stage-destroyer is actually a symlink to your repo's folder... this is the trick... the link tells it to get the code from wherever you generated the link
- now you can destroy and itll use your code
