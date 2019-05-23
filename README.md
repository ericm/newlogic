# ![newlogic](assets/logo.png?raw=true)

[![Build Status](https://travis-ci.com/ericm/newlogic.svg?branch=master)](https://travis-ci.com/ericm/newlogic)
[![Build status](https://ci.appveyor.com/api/projects/status/x4i8jalu9yf8ioa5/branch/master?svg=true)](https://ci.appveyor.com/project/ericm/newlogic/branch/master)
[![CircleCI](https://circleci.com/gh/ericm/newlogic.svg?style=svg)](https://circleci.com/gh/ericm/newlogic)


**Newlogic** is a *Circuit Builder / Logic Design Desktop Application* (like mmlogic) made with *Electron + React Typescript*. It's currently compatible with **Windows**, **Mac** and **Linux**.

**NOTE**: This app is currently in development so functionality is limited.

## Features

### An intuitive UI
![](assets/screenshot_menu.png?raw=true)

***Newlogic** has a modern, clean UI that's easy to use*

### Easy wire drawing
![](assets/screenshot_ui.gif?raw=true)

*When you draw a wire, it snaps onto the nearest node*

### And best of all,
**It's free!**

---

## Installation

- **Note: requires a node version >= 6, npm version >= 3 and yarn version >= 1.**

First, clone the repo via git:

```bash
git clone https://github.com/TooFiveFive/newlogic.git
```

And then install dependencies.

```bash
$ cd newlogic && yarn
```

---

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

---

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

---

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

---

## Maintainers

- [Eric Moynihan (ericm)](https://github.com/ericm)

## License
MIT © [Eric Moynihan](https://github.com/TooFiveFive)

(Boilerplate) MIT © [C. T. Lin](https://github.com/chentsulin)
