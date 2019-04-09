# ![newlogic](assets/logo.png?raw=true)

[![Build Status](https://travis-ci.com/ericm/newlogic.svg?branch=master)](https://travis-ci.com/ericm/newlogic)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a0f924120c6c46979c43fa0089a71dbf)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=TooFiveFive/newlogic&amp;utm_campaign=Badge_Grade)


**Newlogic** is a *Circuit Builder / Logic Design Desktop Application* (like mmlogic) made with *Electron + React Typescript*. It's currently compatible with **Windows**, **Mac** and **Linux**.

**NOTE**: This app is currently in development so functionality is limited.

## Screenshot

![Demo](assets/scr1.gif?raw=true)

## Installation

- **Note: requires a node version >= 6 and an npm version >= 3.**

First, clone the repo via git:

```bash
git clone https://github.com/TooFiveFive/newlogic.git
```

And then install dependencies.

```bash
$ cd newlogic && npm i
```


## Run

Run these two commands **simultaneously** in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

## Packaging

To package apps for the local platform:

```bash
$ npm run package
```

To package apps for all platforms:

```bash
$ npm run package-all
```

To package apps with options:

```bash
$ npm run package -- --[option]
```

## Further commands

To run the application without packaging run

```bash
$ npm run build
$ npm start
```

To run unit tests:
```bash
npm test
```

To run End-to-End Test

```bash
$ npm run build
$ npm run test-e2e
```

## Maintainers

- [Eric Moynihan](https://github.com/TooFiveFive)

## License
MIT © [Eric Moynihan](https://github.com/TooFiveFive)

(Boilerplate) MIT © [C. T. Lin](https://github.com/chentsulin)
