#!/bin/sh
# Copyright Eric Moynihan 2019, licensed under MIT
# This file is used to package newlogic on linux
# Usage: ./install.sh <version>
npm run package
cd ./release/linux-unpacked
cp ../../resources/icon.png .
cp ../../install/newlogic.desktop .
tar -cvzf ../newlogic-linux-$1.tar.gz *
