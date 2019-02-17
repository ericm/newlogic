# ![newlogic](assets/logo.svg?raw=true)

[![Build Status](https://travis-ci.com/TooFiveFive/newlogic.svg?token=jyRxn4zkYKsnfs8jmdDd&branch=master)](https://travis-ci.com/TooFiveFive/newlogic)


**Newlogic** is a *Circuit Builder / Logic Design Desktop Application* (like mmlogic) made with *Electron + React Typescript*. It's Compatible with **Windows**, **Mac** and **Linux**.

**NOTE**: This app is currently in development so functionality is limited.

## Screenshot

![Demo](assets/scr1.gif?raw=true)

## Installation

- **Note: requires a node version >= 6 and an npm version >= 3.**

First, clone the repo via git:

```bash
git clone https://github.com/TooFiveFive/newlogic.git your-project-name
```

And then install dependencies.

```bash
$ cd newlogic && npm i
```


## Run

Run these two commands __simultaneously__ in different console tabs.

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

First, refer to [Multi Platform Build](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) for dependencies.

Then,
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
