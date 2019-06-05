#!/bin/sh
# Copyright Eric Moynihan 2019, licensed under MIT
# This file is used to package newlogic on linux
npm run package
cd ./release/linux-unpacked
tar -cvzf ../newlogic-linux-$1.tar.gz *
