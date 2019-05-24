#! /usr/bin/env node
// Copyright Eric Moynihan 2019, licensed under MIT
// This file is used to run newlogic on linux
const exec = require("child_process").execSync;
exec(`electron ${__dirname}/app`);